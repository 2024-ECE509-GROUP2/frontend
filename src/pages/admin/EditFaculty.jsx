import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL,REST_API_BASE_URL } from "../../constants/BaseConfig";
import '../../constants/FirebaseConfig';
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import TableList from "../../components/common/TableList";

export default function DepartmentsListPage() {

    let notifer = useContext(NotificationContext);
    let { uuid } = useParams();
    let navigate = useNavigate();
    const auth = useContext(AuthContext)

    if(auth.user == null) {
        navigate(BASE_URL+'/', {replace: true})
    }

    // Set Initail State to be Empty
    let [faculty, setFaculty] = useState({
        faculty_name: '',
        shouldLoad: true
    })

    let [departments, setDepartments] = useState({
        items: [],
        shouldLoad: false
    })

    let [editMode, toggleEdit] = useState(false)

    useEffect(()=> {

        //  Check if we have already made request (We don't want to query every time the page changes)
        if(!faculty.shouldLoad) {
            return
        }

        // Request from API 
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
        // On a succesful query
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
        })
        .catch( reason => {
            console.log(reason)
        })
    })

    function handleFormUpdate(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName == 'nameField') {
            setFaculty(values=>({...values, faculty_name: fieldValue}))
        }
    }

    function addDepartment(event) {
        event.preventDefault();

        navigate(BASE_URL+'/faculty/'+uuid+'/addDepartment');
    }

    // This functions handle the effect when the edit button is clicked
    function editDepartment(value) {
        navigate(BASE_URL+'/faculty/'+uuid+'/edit/'+value);
    }

    // This functions handle the request when the delete button is clicked
    function deleteDepartment(value) {

        // The request to the API
        fetch(REST_API_BASE_URL+'/api/v1/departments/'+value, {
            method: 'delete',
        })
        .then( response => {
            // Depending on the response we change the data on the page
            // Since it's a delete request, we want a 204
            // 204 means something was removed
            if(response.status == 204) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        })
        .then( json => {
            // If no errors ocurred then resolve this part
            console.log(json)
            setFaculty( values => ({...values, shouldLoad: true}))
            toggleEdit(false)
            notifer.pushNotice("Department Deleted", "A Faculty Was Deleted", 'success')
        })
        // This part handles any errors if they occur,
        // For now we just want to log to the console.
        
        .catch( reason => {
            console.log('Promised rejected due to:'+reason)
            // This gives the user a visual feedback of what is happening
            notifer.pushNotice("Faculty Removal Failed", "Something Went Wrong", 'error')
        })
    }

    // This functions handle the request we change anything about the faculty
    // For now, we only need to change the name.
    function updateFacultyForm(event) {
        event.preventDefault()

        // The request to the API
        fetch(REST_API_BASE_URL+'/api/v1/faculty/'+uuid, {
            method: 'put',
            body: JSON.stringify({
                'faculty_name': faculty.faculty_name,
            })
        })
        // Depending on the response we change the data on the page
        // Since it's a put request, we want a 201
        // 204 means something was removed
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
            setFaculty( values => ({...values, shouldLoad: true}))
            toggleEdit(false)
            notifer.pushNotice("Faculty Updated", "Changes Saved", 'success')
        })
        .catch( reason => {
            console.log('Promised rejected due to:'+reason)
            notifer.pushNotice("Faculty Update Failed", "Something Went Wrong", 'error')
        })
    }

    function EditableTitle() {

        if(editMode) {
            return (
                <>
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={updateFacultyForm} >
                            <div className="form-group-row">
                                <input type="text" name="nameField" value={faculty.faculty_name} onChange={handleFormUpdate} required />
                                <input type="submit" value="Update" />
                            </div>
                        </form>

                    </section>
                </>
            )
        }
        return (
            <>
                <section className="page-section">
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <h2>{ faculty.shouldLoad ? "...Loading": faculty.faculty_name}</h2>
                            <i className="bi-pencil edit-button" onClick={() => toggleEdit(true)}></i>
                        </div>
                    </section>
            </>
        )
    }

    const tiles = departments.items.map( data => {
        return (
            <>
                <tr>
                    <th scope="row">1</th>
                    <td>{data['department_name']}</td>
                    <td>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <button style={{marginRight: 10+"px"}} onClick={() => editDepartment(data['uuid'])}>Edit</button>
                            <button style={{marginRight: 10+"px"}} onClick={() => deleteDepartment(data['uuid'])}>Delete</button>
                        </div>

                    </td>
                </tr>
            </>
        )
    })

    return (
        <>
            <div className="page">
                <div className="page-container">
                    {EditableTitle()}
                    
                    {/* This section is departments */}
                    <section className="page-section" style={{flexDirection: 'column'}}>
                        <div className="row">
                            <button onClick={addDepartment}>Add Department</button>
                        </div>
                        <div className="row">
                            <TableList headings={["Name",  ""]}>
                                {tiles}
                            </TableList>
                        </div> 
                    </section>
                    
                </div>
            </div>
        
        </>
    )
}