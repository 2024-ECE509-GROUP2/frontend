import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContex";

const REST_API_BASE_URL = import.meta.env.VITE_REST_API

export default function StaffSessionPage() {


    let [initial, setInitial] = useState(false);

    let navigate = useNavigate();

    let auth = useContext(AuthContext);
    let notifier = useContext(NotificationContext);

    if(auth.user == null) {
        useEffect(() => {
            navigate("/");
        })
    } 

    let [sessions, setSessions] = useState({
        items: [],
        isLoading: false
    })

    let [currentSession, setSession] = useState({
        session: null,
        label: '',
        started: false,
        dateStarted: new Date().toISOString().split('T')[0],
        ended: false,
        dateEnded: new Date().toISOString().split('T')[0]
    })

    
    
    useEffect(() => {
        if(!initial) {
            fetch(REST_API_BASE_URL+"/api/v1/sessions/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSessions({
                    items: json,
                    isLoading: true
                })
                setInitial(true)
            });
        }
        
    })
    
    const options = sessions.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['session_label']}</option>
            </>
        )
    })

    function handleSessionSelection(event) {

        const sessionUuid = event.target.value;

        if(event.target != document.getElementById('selectSessionOptions')) {
            return
        }
        
        if(sessionUuid != '') {
            
            const getSession = sessions.items.find(item => item['uuid'] === sessionUuid);
            console.log(getSession);
            if(getSession != null) {
                setSession({
                    session: sessionUuid,
                    label: getSession['session_label'],
                    started: getSession['has_started'],
                    dateStarted: getSession['date_start'],
                    ended: getSession['has_ended'],
                    dateEnded: getSession['date_end']
                })
            }
        }else {
            setSession({
                session: null,
                label: '',
                started: false,
                dateStarted: Date(),
                ended: false,
                dateEnded: Date()
            })
        }
        
    }

    function handleSubmittedAdd(event) {

        event.preventDefault();

        fetch(REST_API_BASE_URL+"/api/v1/sessions/", {
            method: "post",
            body: JSON.stringify({
                "session_label": currentSession.label,
                "date_start": "2011-04-23T18:25:43.511Z"
            })
        })
        .then(resp => {
            if (resp.status === 201) {
                notifier.pushNotice("Success", "Created Session", 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(json => {
            setInitial(false)
            setSession( values => ({...values, session: json['uuid']}))
        });
    }
    
    function handleSubmittedUpdate(event) {

        event.preventDefault();
        
        if(currentSession.session == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/sessions/"+currentSession.session, {
            method: "put",
            body: JSON.stringify({
                "session_label": currentSession.label,
                "has_started": currentSession.started,
                "date_start": currentSession.dateStarted,
                "has_ended": currentSession.ended,
                "date_end": currentSession.dateEnded
            })
        })
        .then(resp => {
            if (resp.status === 200) {
                notifier.pushNotice("Success", "Updated Details For Session "+currentSession.label, 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                notifier.pushNotice("Error", "Failed To Update Details For Session "+currentSession.label, 'error')

                return Promise.reject("server")
            }
        })
        .then(json => {
            setInitial(false)
            setSession({
                session: json['uuid'],
                label: json['session_label'],
                started:  json['has_started'],
                dateStarted:  json['date_start'].split('T')[0],
                ended:  json['has_ended'],
                dateEnded:  json['date_end'].split('T')[0]
            })
        });
    }

    function handleRemoveSession(event) {

        event.preventDefault();

        if(currentSession.session == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/sessions/"+currentSession.session, {
            method: "delete",
        })
        .then(resp => {
            if (resp.status === 204) {
                notifier.pushNotice("Success", "Successfully Deleted Session", 'success')
                
                return "Successfully Deleted Session "+currentSession.label
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(result => {
            console.log(result)
            setSession({
                session: null,
            })   
            setInitial(false)

        });
    } 

    function handleResetSession(event) {
        
        if(currentSession.session == null) {
            return
        }

        setInitial(false)
        setSession({
            session: null,
        })  
    }

    function handleFormChange(event) {
        
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName === 'sessionLabel') {
            setSession( values => ({...values, label: fieldValue}))
        }else if(fieldName === 'sessionEnded') {
            setSession( values => ({...values, ended: !currentSession.ended }))
        }else if(fieldName === 'sessionStarted') {
            setSession( values => ({...values, started: !currentSession.started}))
        }else if(fieldName === 'sessionStartDate') {
            setSession( values => ({...values, dateStarted: fieldValue }))
        }else if(fieldName === 'sessionEndDate') {
            setSession( values => ({...values, dateEnded: fieldValue}))
        }
        
        console.log(currentSession)
    }

    function buildSection() {

        if(currentSession.session == null){
            return (
                <section className="page-section">
                    <form className="form-section-group" onSubmit={handleSubmittedAdd}>
                        <div className="form-group-row">
                            <input type="text" name="sessionLabel" id="" value={currentSession.label} onChange={handleFormChange} placeholder="Session Label" />
                        </div>
                        
                        <div className="form-group-row">
                            <input type="submit" name="sessionSubmit" value="Add" />
                        </div>
                    </form>
                </section>
            )
        }

        return (
            <>

                <section className="page-section">
                    <form className="form-section-group" onSubmit={handleSubmittedUpdate}>
                        <div className="form-group-row">
                            <input type="text" name="sessionLabel" value={currentSession.label} onChange={handleFormChange} placeholder="Session Label" />
                        </div>
                        <div className="form-group-row">
                            <label htmlFor="sessionStarted">Session Started</label>
                            <input type="checkbox" name="sessionStarted" checked={currentSession.started} onChange={handleFormChange}/>
                            
                            <input type="date" name="sessionStartDate" value={currentSession.dateStarted != null ? currentSession.dateStarted.split('T')[0]: NaN} onChange={handleFormChange} disabled={!currentSession.started} id="" placeholder="Session Started" />
                        </div>
                        <div className="form-group-row">
                            <label htmlFor="sessionEnded">Session Ended</label>
                            <input type="checkbox" name="sessionEnded" checked={currentSession.ended} onChange={handleFormChange}/>
                        
                            <input type="date" name="sessionEndDate" value={currentSession.dateEnded != null ? currentSession.dateEnded.split('T')[0] : NaN} onChange={handleFormChange} disabled={!currentSession.ended}  id="" placeholder="Session Ended" />
                        </div>
                        <div className="form-group-row">
                            <input type="submit" name="sessionSubmit" value="Update" readOnly={true} />
                        </div>
                    </form>
                </section>
            </>
        )
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={handleRemoveSession} onReset={handleResetSession}>
                            <label htmlFor="selectSession">Session</label>
                            <select className="" name="selectSession" id="selectSessionOptions" value={currentSession.session} onChange={handleSessionSelection}>
                                <option value=""></option>
                                {options}
                            </select>
                            <input type="submit" hidden={currentSession.session == null} value="Delete Session" />
                            <input type="reset" hidden={currentSession.session == null} value="Clear" />
                        </form>
                    </section>
                    {buildSection()}
                </div>
            </div>
        </>
    );
}