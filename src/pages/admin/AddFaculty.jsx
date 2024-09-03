import { useContext, useState } from "react";
import { NotificationContext } from "../../contexts/NotificationContex";
import '../../constants/FirebaseConfig';
import { BASE_URL,REST_API_BASE_URL } from "../../constants/BaseConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddFacultyPage() {

    let notifer = useContext(NotificationContext);
    let navigate = useNavigate();
    const auth = useContext(AuthContext)

    if(auth.user == null) {
        navigate(BASE_URL+'/', {replace: true})
    }

    let [details, setFaculty] = useState({
        faculty_name: '',
        shouldLoad: true
    })

    // Process any event and updates state as needed
    function handleFormUpdate(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName == 'nameField') {
            setFaculty(values=>({...values, faculty_name: fieldValue}))
        }
    }

    // Handle the form when submitted
    // This 
    function addFacultyForm(event) {
        event.preventDefault()

        // Makes request to API
        fetch(REST_API_BASE_URL+'/api/v1/faculty/', {
            method: 'post',
            body: JSON.stringify({
                'faculty_name': details.faculty_name,
            })
        })
        .then( response => {
            // Check response if successfull
            if(response.status == 201) {
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
            setFaculty( values => ({...values, shouldLoad: true}))
            notifer.pushNotice("Faculty Added", "Changes Saved", 'success')
        })
        .catch( reason => {
            //  This part is to 'catch' the error if any occur
            console.log('Promised rejected due to:'+reason)
            notifer.pushNotice("Faculty Creation Failed", "Something Went Wrong", 'error')
        })
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <h2>Create Faculty</h2>
                    </section>
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={addFacultyForm} >
                            <div className="form-group-row">
                                <label htmlFor="nameField">Faculty Name</label>
                                <input type="text" name="nameField" value={details.faculty_name} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <input type="submit" value="Create" />
                            </div>
                        </form>

                    </section>
                </div>
            </div>
        
        </>
    )
}