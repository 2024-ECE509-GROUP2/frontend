import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import TableList from "../../components/common/TableList";

export default function SchoolCalenderPage(){

    useEffect(() => {
        
    })

    let navigate = useNavigate();

    let auth = useContext(AuthContext);
    let notifier = useContext(NotificationContext);

    if(auth.user == null) {
        useEffect(() => {
            navigate("/");
        })
    } 

    // Creating the state variables to hold values

    let [programmes, setProgrammes] = useState({
        items: [],
        selected: null,
        shouldLoad: true
    })

    let [sessions, setSessions] = useState({
        items: [],
        selected: null,
        shouldLoad: false
    })

    let [semesters, setSemesters] = useState({
        items: [],
        selected: null,
        shouldLoad: false
    })

    let [currentCalender, updateCurrent] = useState({
        session: null,
        semester: null,
        session_label: '',
        semester_label: '',
        programme: '',
        items: [],
        shouldLoad: true
    })

    let [noCalender, setNoCalender] = useState(false)

    useEffect(() => {

        // The conditions are to prevent the page from requesting the api more than needed
        if(semesters.shouldLoad && sessions.selected !== null) {
            fetch(REST_API_BASE_URL+"/api/v1/sessions/"+sessions.selected)
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSemesters({
                    items: json['semesters'],
                    shouldLoad: false
                })
            });
        }

        if(sessions.shouldLoad && programmes.selected !== null) {
            fetch(REST_API_BASE_URL+"/api/v1/programme/"+programmes.selected)
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSessions({
                    items: json['sessions'],
                    shouldLoad: false
                })
            });
        }

        //  Check for the current session and semster and hold the value
        if(currentCalender.shouldLoad & programmes.selected != null) {
            fetch(REST_API_BASE_URL+"/api/v1/calender/edit/"+programmes.selected)
            .then(res=> {
                if(res.status == 200) {
                    return res.json()
                }else if(res.status == 404){
                    return Promise.reject("not_found")
                }  
            })
            .then(json => {
                console.log(json)
                setNoCalender(false)
                updateCurrent({
                    programme: json['programme_label'],
                    session: json['current_session'],
                    semester: json['current_semester'],
                    session_label: json['session_details'] == null ? "" : json['session_details']['session_label'],
                    semester_label: json['semester_details'] == null ? "" : json['semester_details']['semester_label'],
                    items: [],
                    shouldLoad: false
                })
            }).catch(
                reason => {
                    if(reason == 'not_found'){
                        setNoCalender(true)
                    }else {
                        console.log("Promise Failed:"+reason)
                    }
                }
            );
        }else if(currentCalender.shouldLoad) {
            fetch(REST_API_BASE_URL+"/api/v1/calender/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                updateCurrent(values => ({...values, items: json, shouldLoad: false}))
            });
        }

        if(programmes.shouldLoad) {
            fetch(REST_API_BASE_URL+"/api/v1/programme/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setProgrammes({
                    items: json,
                    shouldLoad: false
                })
            });
        }

    })

    const optionsForSemesters = semesters.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['semester_label']}</option>
            </>
        )
    })

    const optionsForSessions = sessions.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['session_label']}</option>
            </>
        )
    })

    const optionsForProgrammes = programmes.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['programme_label']}</option>
            </>
        )
    })

    let tiles = currentCalender.shouldLoad ? 
        <>
            <tr>
                <th scope="row"></th>
                <td>...Loading</td>
            </tr>
        </> :
        <>
            <tr>
                <th scope="row">1</th>
                <td>{currentCalender.programme}</td>
                <td>{currentCalender.session == null ? "No Current Running Session": currentCalender.session_label}</td>
                <td>{currentCalender.semester == null ? "No Current Running Semester": currentCalender.semester_label}</td>
            
            </tr>
        </>

    if(currentCalender.items.length > 0) {
        let count = 0
        tiles = currentCalender.items.map ( item => {
            count += 1
            return (
                <tr>
                    <th scope="row">{count}</th>
                    <td>{item['programme_label']}</td>
                    <td>{item['session_details'] == null ? "No Current Running Session" : item['session_details']['session_label']}</td>
                    <td>{item['semester_details'] == null ? "No Current Running Semester" : item['semester_details']['semester_label']}</td>
                </tr>
            )
        })
    }


    function handleFormUpdate(event) {
        const fieldName = event.target.name; // get input name
        const fieldValue = event.target.value; //get input value

        // Depending the name of the input modify state variables
        console.log(fieldName)
        console.log(fieldValue)
        if(fieldName == 'selectProgramme') {
            if(fieldValue == "") {
                setProgrammes(values=>({...values, selected: null}))
                updateCurrent(values => ({...values, shouldLoad: true}))
                setSessions({
                    items: [],
                    shouldLoad: false
                })
            }else {
                setProgrammes(values => ({ ...values, selected: fieldValue}))
                updateCurrent(values => ({ ...values, shouldLoad: true }))
                setSessions({items: [] ,shouldLoad: true })
            }
            
        }else if(fieldName == 'selectSession') {
            setSessions(values=>({...values, selected: fieldValue}))
            setSemesters(values=>({...values, shouldLoad: true}))
        }else if(fieldName == 'selectSemester') {
            setSemesters(values=>({...values, selected: fieldValue}))
        }
    }

    function handleAddFormSubmit(event) {
        event.preventDefault()

        // The request to the API
        fetch(REST_API_BASE_URL+'/api/v1/calender/', {
            method: 'post',
            body: JSON.stringify({
                'programme': programmes.selected,
            })
        })
        // Depending on the response we change the data on the page
        // Since it's a put request, we want a 201 or 200
        .then( response => {
            if(response.status == 201) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        })
        .then( json => {
            console.log(json)
            setProgrammes(values => ({...values, shouldLoad: true}))
            notifier.pushNotice("Calender Updated", "Changes Saved", 'success')
        })
        .catch( reason => {
            console.log('Promised rejected due to:'+reason)
            notifier.pushNotice("Calender Update Failed", "Something Went Wrong", 'error')
        })
    }
    
    function handleEditFormSubmit(event) {
        event.preventDefault()

        // The request to the API
        fetch(REST_API_BASE_URL+'/api/v1/calender/edit/'+programmes.selected, {
            method: 'put',
            body: JSON.stringify({
                'programme': programmes.selected,
                'current_session': sessions.selected,
                'current_semester': semesters.selected,
            })
        })
        // Depending on the response we change the data on the page
        // Since it's a put request, we want a 201 or 200
        .then( response => {
            if(response.status == 201) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        })
        .then( json => {
            console.log(json)
            setProgrammes( values => ({...values, shouldLoad: true}))
            updateCurrent( values => ({...values, shouldLoad: true}))
            notifier.pushNotice("Calender Updated", "Changes Saved", 'success')
        })
        .catch( reason => {
            console.log('Promised rejected due to:'+reason)
            notifier.pushNotice("Calender Update Failed", "Something Went Wrong", 'error')
        })
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <h3>Current School Calender</h3>
                    </section>
                    <section className="page-section">

                        <form className="form-section-group" onSubmit={handleAddFormSubmit}>
                            <div className="form-group-row">
                                <label htmlFor="selectProgramme">Programme</label>
                                <select className="" name="selectProgramme" value={programmes.selected} onChange={handleFormUpdate}>
                                    <option value=""></option>
                                    {optionsForProgrammes}
                                </select>
                            </div>

                            <div hidden={!noCalender} className="form-group-row">                       
                                <input type="submit" name="sessionSubmit" value="Add Programme to Calender" />
                            </div>
                            <div className="form-group-row">
                                <div className="row">
                                    <TableList headings={["Programme", "Current Session", "Current Semester"]}>
                                        {tiles}
                                    </TableList>
                                </div> 
                            </div>
                        </form>

                    </section>

                    <section hidden={programmes.selected == null} className="page-section">
                        <form className="form-section-group" onSubmit={handleEditFormSubmit}>
                            <div className="form-group-row">
                                <label htmlFor="selectSession">Current Session</label>
                                <select className="" name="selectSession"  value={sessions.selected} onChange={handleFormUpdate}>
                                    <option value=""></option>
                                    {optionsForSessions}
                                </select>
                            </div>

                            <div className="form-group-row">
                                <label htmlFor="selectSemester">Current Semester</label>
                                <select className="" name="selectSemester" value={semesters.selected} onChange={handleFormUpdate}>
                                    <option value=""></option>
                                    {optionsForSemesters}
                                </select>
                            </div>
                            
                            <div className="form-group-row">
                                
                                <input type="submit" disabled={programmes.selected == null} name="sessionSubmit" value="Update Calender" />
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
}