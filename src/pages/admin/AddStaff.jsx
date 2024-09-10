import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { Breadcrumb } from "rsuite";
import BreadcrumbItem from "rsuite/esm/Breadcrumb/BreadcrumbItem";
import BreadLink from "../../components/custom/BreadcrumbLink";

import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import '../../constants/FirebaseConfig';
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";

export default function AddStaffPage() {

    //  Our State Variables
    let [formFields, setProfile] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        profileURL: null,
        department: null,
        isStaff: true,
        shouldLoad: true
    })

    function handleFormUpdate(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName == 'firstNameField') {
            setProfile(values=>({...values, first_name: fieldValue}))
        }else if(fieldName == 'lastNameField') {
            setProfile(values=>({...values, last_name: fieldValue}))
        }else if(fieldName == 'middleNameField') {
            setProfile(values=>({...values, middle_name: fieldValue}))
        }else if(fieldName == 'emailField') {
            setProfile(values=>({...values, email: fieldValue}))
        }

        if(fieldName == 'selectFaculty') {
            setFaculties(values=>({...values, selected: fieldValue, shouldLoad: true}))
        }else if(fieldName == 'selectDepartment') {
            setDepartments(values=>({...values, selected: fieldValue}))
        }
    }

    // Handle the form when submitted
    // This 
    function addStaffForm(event) {
        event.preventDefault()

        // Makes request to API
        fetch(REST_API_BASE_URL+'/api/v1/staff/', {
            method: 'post',
            body: JSON.stringify({
                'first_name': formFields.first_name,
                'last_name': formFields.last_name,
                'middle_name': formFields.middle_name.length < 1 ? null: formFields.middle_name,
                'email': formFields.email,
                
                'department': deparments.selected,
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
            setProfile( values => ({...values, shouldLoad: true}))
            toast.success("Staff Added")
        })
        .catch( reason => {
            //  This part is to 'catch' the error if any occur
            console.log('Promised rejected due to:'+reason)
            toast.error("Something Went Wrong")
        })
    }


    // Now we get the data for the dropdown menus

    // State Varables to hold the values

    let [faculties, setFaculties] = useState({
        items: [],
        selected: null,
        shouldLoad: true
    })

    let [deparments, setDepartments] = useState({
        items: [],
        selected: null,
        shouldLoad: false
    })

    useEffect( () => {

        // We don't it fetching every frame
        if(faculties.shouldLoad){
            fetch(REST_API_BASE_URL+'/api/v1/faculty/', {
            })
            .then( response => {
                if(response.status == 200) {
                    return response.json()
                }else {
                    console.log("Status: " + response.status)
                    return Promise.reject("server")
                }
            })
            .then( json => {
                console.log(json)
                setFaculties({
                    items: json,
                    selected: null,
                    shouldLoad: false
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
            })
        }     

        // check if a faculty is selected
        if(faculties.selected == null) {
            return
        }

        // Request from API 
        fetch(REST_API_BASE_URL+'/api/v1/faculty/'+faculties.selected+'/departments')
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
            setDepartments({
                items: json['departments'],
                selected: null,
                shouldLoad: false
            })
        })
        .catch( reason => {
            console.log(reason)
        })
    })

    // For the items on the dropdown to select the faculty
    const optionsForFaculty = faculties.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['faculty_name']}</option>
            </>
        )
    })

    // For the items on the dropdown to select the departments
    const optionsForDeparments = deparments.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['department_name']}</option>
            </>
        )
    })

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <Breadcrumb>
                            <BreadcrumbItem as={BreadLink} href="/">Home</BreadcrumbItem>
                            <BreadcrumbItem as={BreadLink} href="/staff">Staff</BreadcrumbItem>
                            <BreadcrumbItem >Enroll Staff</BreadcrumbItem>
                        </Breadcrumb>
                    </section>
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={addStaffForm} >
                        <div className="form-group-row">
                                <h5>Personal Details</h5>
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="firstNameField">First Name</label>
                                <input type="text" name="firstNameField" value={formFields.first_name} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="lastNameField">Last Name</label>
                                <input type="text" name="lastNameField" value={formFields.last_name} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="middleNameField">Middle Name</label>
                                <input type="text" name="middleNameField" value={formFields.middle_name} onChange={handleFormUpdate}  />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="emailField">Email</label>
                                <input type="text" name="emailField" value={formFields.email} onChange={handleFormUpdate} required />
                            </div>
                            <div className="form-group-row">
                                <h5>School Details</h5>
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="selectFaculty">Select Faculty</label>
                                <select className="" name="selectFaculty" id="selectFacultyOptions" value={faculties.selected} onChange={handleFormUpdate}>
                                    <option value=""></option>
                                    {optionsForFaculty}
                                </select>
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="selectDepartment">Select Department</label>
                                <select className="" name="selectDepartment" id="selectDepartmentOptions" value={deparments.selected} onChange={handleFormUpdate}>
                                    <option value=""></option>
                                    {optionsForDeparments}
                                </select>
                            </div>
                            <div className="form-group-row">
                                <input type="submit" value="Enroll" />
                            </div>
                        </form>

                    </section>
                </div>
            </div>
        
        </>
    )
}