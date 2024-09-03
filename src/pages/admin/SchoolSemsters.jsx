import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import TableList from "../../components/common/TableList";
import { BASE_URL,REST_API_BASE_URL } from "../../constants/BaseConfig";

export default function SchoolSemestersPage() {

    let navigate = useNavigate();

    let auth = useContext(AuthContext);
    let notifier = useContext(NotificationContext);

    if(auth.user == null) {
        useEffect(() => {
            navigate(BASE_URL+"/");
        })
    }

    // First we want to hold the variables for the state

    let [semesters, setSemesters] = useState({
        items: [],
        shouldLoad: true
    });

    let [sessions, setSessions] = useState({
        items: [],
        selected: null,
        shouldLoad: true
    });

    let [selectedSemester, selectSemester] = useState({
        reference: null,
        session: '',
        label: '',
        dateStarted: new Date().toISOString().split('T')[0],
        dateEnded: new Date().toISOString().split('T')[0]
    });

    
    
    useEffect(() => {

        // We don't want the page to request every single time
        

        if(sessions.shouldLoad) {
            fetch(REST_API_BASE_URL+"/api/v1/sessions/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSessions({
                    items: json,
                    shouldLoad: false
                })
            });
        }

        // if(semesters.shouldLoad & sessions.selected != null) {
        //     fetch(REST_API_BASE_URL+"/api/v1/sessions/"+sessions.selected)
        //     .then(res=> res.json())
        //     .then(json => {
        //         console.log(json)
        //         setSemesters({
        //             items: json['semesters'],
        //             shouldLoad: false
        //         })
        //     });
        // }
        
        if(semesters.shouldLoad) {
            fetch(REST_API_BASE_URL+"/api/v1/semesters/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSemesters({
                    items: json,
                    shouldLoad: false
                })
            });
        }
        
    });
    
    // TODO: fix bug
    const optionsForSemesters = semesters.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['semester_label']}</option>
            </>
        )
    });

    const optionsForSessions = sessions.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['session_label']}</option>
            </>
        )
    });

    let count = 0
    let tiles = semesters.items.map ( item => {
        count += 1
        return (
            <tr>
                <th scope="row">{count}</th>
                <td>{item['semester_label']}</td>
                <td>{item['date_start'] == null ? "No Current Running Session" : item['date_start']}</td>
                <td>{item['date_end'] == null ? "No Current Running Semester" : item['date_end']}</td>
            </tr>
        )
    })

    function handleSessionSelection(event) {

        const sessionUuid = event.target.value;

        if(event.target != document.getElementById('selectSessionOptions')) {
            return
        }
        
        if(sessionUuid != '') {
            
            const getSession = semesters.items.find(item => item['uuid'] === sessionUuid);
            console.log(getSession);
            if(getSession != null) {
                selectSemester({
                    reference: sessionUuid,
                    session: getSession['programme'],
                    label: getSession['session_label'],
                    dateStarted: getSession['date_start'],
                    dateEnded: getSession['date_end']
                })
            }
        }else {
            selectSemester({
                reference: null,
                session: '',
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
                "session_label": selectedSemester.label,
                "programme": selectedSemester.session,
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
            selectSemester( values => ({...values, reference: json['uuid']}))
        });
    }
    
    function handleSubmittedUpdate(event) {

        event.preventDefault();
        
        if(selectedSemester.reference == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/sessions/"+selectedSemester.reference, {
            method: "put",
            body: JSON.stringify({
                "session_label": selectedSemester.label,
                "programme": selectedSemester.session,
                "has_started": selectedSemester.started,
                "date_start": selectedSemester.dateStarted,
                "has_ended": selectedSemester.ended,
                "date_end": selectedSemester.dateEnded
            })
        })
        .then(resp => {
            if (resp.status === 200) {
                notifier.pushNotice("Success", "Updated Details For Session "+selectedSemester.label, 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                notifier.pushNotice("Error", "Failed To Update Details For Session "+selectedSemester.label, 'error')

                return Promise.reject("server")
            }
        })
        .then(json => {
            setInitial(false)
            selectSemester({
                reference: json['uuid'],
                session: json['programme'],
                label: json['session_label'],
                dateStarted:  json['date_start'].split('T')[0],
                dateEnded:  json['date_end'].split('T')[0]
            })
        });
    }

    function handleRemoveSession(event) {

        event.preventDefault();

        if(selectedSemester.reference == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/sessions/"+selectedSemester.reference, {
            method: "delete",
        })
        .then(resp => {
            if (resp.status === 204) {
                notifier.pushNotice("Success", "Successfully Deleted Session", 'success')
                
                return "Successfully Deleted Session "+selectedSemester.label
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(result => {
            console.log(result)
            selectSemester({
                reference: null,
            })   
            setInitial(false)

        });
    } 

    function handleResetSession(event) {
        
        if(selectedSemester.reference == null) {
            return
        }

        setInitial(false)
        selectSemester({
            reference: null,
        })  
    }

    function handleFormChange(event) {
        
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName === 'sessionLabel') {
            selectSemester( values => ({...values, label: fieldValue}))
        }else if(fieldName === 'sessionEnded') {
            selectSemester( values => ({...values, ended: !selectedSemester.ended }))
        }else if(fieldName === 'sessionStarted') {
            selectSemester( values => ({...values, started: !selectedSemester.started}))
        }else if(fieldName === 'sessionStartDate') {
            selectSemester( values => ({...values, dateStarted: fieldValue }))
        }else if(fieldName === 'sessionEndDate') {
            selectSemester( values => ({...values, dateEnded: fieldValue}))
        }else if(fieldName === 'selectProgramme') {
            selectSemester( values => ({...values, session: fieldValue}))
        }
        
        console.log(selectedSemester)
    }

    function buildSection() {

        if(selectedSemester.reference == null){
            return (
                <section className="page-section">
                    <form className="form-section-group" onSubmit={handleSubmittedAdd}>
                        <div className="form-group-row">
                            <label htmlFor="selectProgramme">Programme</label>
                            <select className="" name="selectProgramme"  value={selectedSemester.session} onChange={handleFormChange}>
                                <option value=""></option>
                                {optionsForSessions}
                            </select>
                        </div>

                        <div className="form-group-row">
                            <label htmlFor="selectSession">Session</label>
                            <select className="" name="selectSession" value={selectedSemester.session} onChange={handleFormChange}>
                                <option value=""></option>
                                {optionsForSessions}
                            </select>
                        </div>
                        
                        <div className="form-group-row">
                            <div className="row">
                                <TableList headings={["Semester", "Start Date", "End Date"]}>
                                    {tiles}
                                </TableList>
                            </div> 
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
                            <input type="text" name="sessionLabel" value={selectedSemester.label} onChange={handleFormChange} placeholder="Session Label" />
                        </div>
                        <div className="form-group-row">
                            <label htmlFor="selectProgramme">Programme</label>
                            <select className="" name="selectProgramme" id="selectProgrammeOptions" value={selectedSemester.session} onChange={handleFormChange}>
                                <option value=""></option>
                                {optionsForSessions}
                            </select>
                        </div>
                        <div className="form-group-row">
                            <label htmlFor="sessionStarted">Session Started</label>
                            <input type="checkbox" name="sessionStarted" checked={selectedSemester.started} onChange={handleFormChange}/>
                            
                            <input type="date" name="sessionStartDate" value={selectedSemester.dateStarted != null ? selectedSemester.dateStarted.split('T')[0]: NaN} onChange={handleFormChange} disabled={!selectedSemester.started} id="" placeholder="Session Started" />
                        </div>
                        <div className="form-group-row">
                            <label htmlFor="sessionEnded">Session Ended</label>
                            <input type="checkbox" name="sessionEnded" checked={selectedSemester.ended} onChange={handleFormChange}/>
                        
                            <input type="date" name="sessionEndDate" value={selectedSemester.dateEnded != null ? selectedSemester.dateEnded.split('T')[0] : NaN} onChange={handleFormChange} disabled={!selectedSemester.ended}  id="" placeholder="Session Ended" />
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
                            <select className="" name="selectSession" id="selectSessionOptions" value={selectedSemester.reference} onChange={handleSessionSelection}>
                                <option value=""></option>
                                {optionsForSemesters}
                            </select>
                            <input type="submit" hidden={selectedSemester.reference == null} value="Delete Session" />
                            <input type="reset" hidden={selectedSemester.reference == null} value="Clear" />
                        </form>
                    </section>
                    {buildSection()}
                </div>
            </div>
        </>
    );
}