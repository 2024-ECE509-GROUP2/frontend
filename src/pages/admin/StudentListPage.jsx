import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import StudentTile from "../../components/custom/StudentTile";
import { BASE_URL,REST_API_BASE_URL } from "../../constants/BaseConfig";
import UserTileButton from "../../components/custom/StudentTileButton";

export default function StudentListPage() {

    let navigate = useNavigate()

    let auth = useContext(AuthContext)
    let notifier = useContext(NotificationContext)

    let [student, setStudent] = useState({
        uuid : '',
        student_id : '',
        department : '',
        first_name: '',
        last_name: '',
        department_joined : '',
        session_joined : '',
    })

    let [students, setStudents] = useState({
        items: [],
        shouldFetchitems: true
    })

    let [searchField, setSearchValue] = useState('')

    function handleSearchFieldUpdate(event) {
        setSearchValue(event.target.value)
    }

    useEffect(()=> {
        if(students.shouldFetchitems) {
            fetch(REST_API_BASE_URL+"/api/v1/students/")
            .then(resp => {
                if (resp.status === 200) {
                    
                    return resp.json()
                } else {
                    console.log("Status: " + resp.status)
                    return Promise.reject("server")
                }
            })
            .then(json => {
                console.log(json)
                setStudents({
                    items: json,
                    shouldFetchItems: false
                })
            });
        }
    })

    function handleItemClick(uuid) {

        navigate(BASE_URL+'/students/'+uuid)
    }

    const studentsTiles = students.items.map( data => {

        return (
            <>
                <UserTileButton uuid={data['uuid']} profileURL={data['profile_url']} onClick={() => handleItemClick(data['uuid'])} first_name={data['first_name']} last_name={data['last_name']} department_name={data['department_name']}/>
            </>
        )
    })

    return(
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <form className="form-section-group" >
                            <div className="form-group-row">
                                <input type="text" value={searchField} onChange={handleSearchFieldUpdate} name="searchCourse" id="searchSourceField" />
                                <input type="reset" hidden={searchField.length == 0} value="Clear" />
                                <input type="submit" name="addStudentButton" id="" value={"Enroll New Student"} onClick={() =>{toggleSideBarTab("details")}}/>
                            </div>
                            
                        </form>
                        <form action="">
                            {}
                        </form>
                    </section>
                    <section className="page-section">
                        <div className="section-list">
                            {studentsTiles}
                        </div>
                    </section>
                </div>
            </div>
        </>
    )

   
}