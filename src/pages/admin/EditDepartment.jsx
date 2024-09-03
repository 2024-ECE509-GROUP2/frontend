import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../contexts/NotificationContex";
import '../../constants/FirebaseConfig';
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditDepartmentPage() {

    let notifer = useContext(NotificationContext);
    let navigate = useNavigate();
    const auth = useContext(AuthContext)

    if(auth.user == null) {
        navigate('/',)
    }

    // Get data from route (url)
    let {uuid, edit} = useParams();

    // Creating variables to hold our values
    let [details, setDetails] = useState({
        department_name: '',
        department_code: '',
        faculty: uuid,
    })

    let [faculty, setFaculty] = useState({
        faculty_name: '',
        shouldLoad: true
    })

    let [departments, setDepartments] = useState({
        items: [],
        shouldLoad: false
    })

    useEffect(()=> {

        //  Check if we have already made request (We don't want to query every time the page changes)
        if(!faculty.shouldLoad) {
            return
        }

        fetch(REST_API_BASE_URL+'/api/v1/faculty/'+uuid+'/departments')
        .then( response => {
            if(response.status == 200) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        },
            reason => {
            return JSON.stringify({
                'message' : reason,
            })        
        })
        .then( json => {
            console.log(json)
            setFaculty({
                faculty_name: json['faculty_name'],
                shouldLoad: false
            })
            setDepartments({
                items: json['departments'],
                shouldLoad: false
            })

            let department = json['departments'].find( (item) => { return item['uuid'] == edit })
            console.log(department)
            setDetails( values => ({...values, department_name: department['department_name'], department_code: department['department_code']}))
        })
        .catch( reason => {
            console.log(reason)
        })
    })

    // handles when of the form fields changes
    function handleFormUpdate(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName == 'nameField') {
            setDetails(values=>({...values, department_name: fieldValue}))
        }else if(fieldName == 'codeField') {
            setDetails(values=>({...values, department_code: fieldValue}))
        }
    }

    // Handle the form when submitted
    // This 
    function editDepartmentForm(event) {
        event.preventDefault()

        // Makes request to API
        fetch(REST_API_BASE_URL+'/api/v1/departments/'+edit, {
            method: 'put',
            body: JSON.stringify({
                'department_name': details.department_name,
                'department_code': details.department_code.length < 0 ? null: details.department_code,
                'faculty': details.faculty,
            })
        })
        .then( response => {
            // Check response if successfull
            // In this case, we want 201 to show it created something
            if(response.status == 200) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                // This will tell the function an error occured
                return Promise.reject("server")
            }
        })
        .then( json => {
            // This part only runs if the request was succesfull
            console.log(json)
            setDetails( values => ({...values, shouldLoad: true}))
            notifer.pushNotice("Department Updated", " Changes Saved", 'success')
            navigate(-1)
        })
        .catch( reason => {
            //  This part is to 'catch' the error if any occur
            console.log('Promised rejected due to:'+reason)
            notifer.pushNotice("Department Update Failed", "Something Went Wrong", 'error')
        })
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <h2>Edit Department</h2>
                    </section>
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={editDepartmentForm} >
                            <div className="form-group-row">
                                <label htmlFor="lastNameField">Faculty</label>
                                <input type="text" name="lastNameField" value={faculty.faculty_name} disabled={true} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="nameField">Department Name</label>
                                <input type="text" name="nameField" value={details.department_name} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="codeField">Department Code</label>
                                <input type="text" name="codeField" value={details.department_code} onChange={handleFormUpdate} required />
                            </div>
                            
                            <div className="form-group-row">
                                <input type="submit" value="Save Changes" />
                            </div>
                        </form>
                        
                        <form className="form-group-row">
                            
                            
                        </form>
                    </section>
                </div>
            </div>
        
        </>
    )
}