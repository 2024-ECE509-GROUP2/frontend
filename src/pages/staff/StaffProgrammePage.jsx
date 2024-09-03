import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";

const REST_API_BASE_URL = import.meta.env.VITE_REST_API

export default function StaffProgrammePage() {


    let [initialized, setInitialized] = useState(false);

    let navigate = useNavigate();

    let auth = useContext(AuthContext);
    let notifier = useContext(NotificationContext);

    if(auth.user == null) {
        useEffect(() => {
            navigate(BASE_URL+"/");
        })
    } 

    let [programmes, setProgrammes] = useState({
        items: [],
        isLoading: false
    })

    let [currentProgramme, setProgramme] = useState({
        programme: null,
        label: '',
    })
    
    useEffect(() => {
        if(!initialized) {
            fetch(REST_API_BASE_URL+"/api/v1/programme/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setProgrammes({
                    items: json,
                    isLoading: true
                })
                setInitialized(true)
            });
        }
        
    })


    

    const options = programmes.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['programme_label']}</option>
            </>
        )
    })

    function handleProgramSelection(event) {

        const programmeUuid = event.target.value;

        if(event.target != document.getElementById('selectProgrammeOption')) {
            return
        }
        
        if(programmeUuid != '') {
            
            const getSession = programmes.items.find(item => item['uuid'] === programmeUuid);
            console.log(getSession);
            if(getSession != null) {
                setProgramme({
                    programme: programmeUuid,
                    label: getSession['programme_label'],
                })
            }
        }else {
            setProgramme({
                programme: null,
                label: '',
            })
        }
        
    }

    function handleSubmittedAdd(event) {

        event.preventDefault();

        fetch(REST_API_BASE_URL+"/api/v1/programme/", {
            method: "post",
            body: JSON.stringify({
                "programme_label": currentProgramme.label,
            })
        })
        .then(resp => {
            if (resp.status === 201) {
                notifier.pushNotice("Success", "Created Programme", 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(json => {
            setInitialized(false)
            setProgramme( values => ({...values, programme: json['uuid']}))
        });
    }
    
    function handleSubmittedUpdate(event) {

        event.preventDefault();
        
        if(currentProgramme.programme == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/programme/"+currentProgramme.session, {
            method: "put",
            body: JSON.stringify({
                "programme_label": currentProgramme.label,
            })
        })
        .then(resp => {
            if (resp.status === 200) {
                notifier.pushNotice("Success", "Updated Details For Programme "+currentProgramme.label, 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                notifier.pushNotice("Error", "Failed To Update Details For Session "+currentProgramme.label, 'error')

                return Promise.reject("server")
            }
        })
        .then(json => {
            setInitialized(false)
            setProgramme( values => ({...values, programme: json['uuid']}))
        });
    }

    function handleRemoveProgramme(event) {

        event.preventDefault();

        if(currentProgramme.programme == null) {
            return
        }

        fetch(REST_API_BASE_URL+"/api/v1/programme/"+currentProgramme.programme, {
            method: "delete",
        })
        .then(resp => {
            if (resp.status === 204) {
                notifier.pushNotice("Success", "Successfully Deleted Programme", 'success')
                
                return "Successfully Deleted Programme "+currentProgramme.label
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(result => {
            console.log(result)
            setProgramme({
                programme: null,
            })   
            setInitialized(false)

        });
    } 

    function handleResetProgram(event) {
        // event.preventDefault()
        
        if(currentProgramme.programme == null) {
            return
        }

        setInitialized(false)
        setProgramme({
            programme: null,
        })  
    }

    function handleFormChange(event) {
        
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName === 'programmeLabel') {
            setProgramme( values => ({...values, label: fieldValue}))
        }

        console.log(currentProgramme)
    }

    function buildSection() {

        if(currentProgramme.session == null){
            return (
                <section className="page-section">
                    <form className="form-section-group" onSubmit={handleSubmittedAdd}>
                        <div className="form-group-row">
                            <input type="text" name="programmeLabel" id="" value={currentProgramme.label} onChange={handleFormChange} placeholder="Programme Label" />
                        </div>
                        
                        <div className="form-group-row">
                            <input type="submit" name="programmeSubmit" value="Add" />
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
                            <input type="text" name="programmeLabel" value={currentProgramme.label} onChange={handleFormChange} placeholder="Programme Label" />
                        </div>
                        <div className="form-group-row">
                            <input type="submit" name="programmeSubmit" value="Update" readOnly={true} />
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
                        <form className="form-section-group" onSubmit={handleRemoveProgramme} onReset={handleResetProgram}>
                            <label htmlFor="select">Programme: </label>
                            <select className="" name="selectProgramme" id="selectProgrammeOption" value={currentProgramme.session} onChange={handleProgramSelection}>
                                <option value=""></option>
                                {options}
                            </select>
                            <input type="submit" hidden={currentProgramme.programme == null} value="Delete Programme" />
                            <input type="reset" hidden={currentProgramme.programme == null} value="Clear" />
                        </form>
                    </section>
                    {buildSection()}
                </div>
            </div>
        </>
    );
}