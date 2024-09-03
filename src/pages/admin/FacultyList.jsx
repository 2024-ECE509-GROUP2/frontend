import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import { BASE_URL, REST_API_BASE_URL } from "../../constants/BaseConfig";
import StudentTileButton from "../../components/custom/StudentTileButton";

export default function FacultyListPage() {

    let navigate = useNavigate()
    let auth = useContext(AuthContext)
    let notifier = useContext(NotificationContext)

    // I know how faculites is spelt. 
    let [faculites, updateFacultiesList] = useState({
        items: [],
        shouldLoad: true
    })

    let [searchField, setSearchValue] = useState('')

    // Each time the user types on the search the result will update
    function handleSearchFieldUpdate(event) {
        setSearchValue(event.target.value)
    }

    // Like In every other page this is to check for the user authentication
    if(auth.user == null) {
        useEffect(() => {
            navigate(BASE_URL+"/");
        })
    }

    // Load the data for the Page
    // 
    useEffect(()=> {
        if(faculites.shouldLoad) {

            // Makes the request to the backend
            fetch(REST_API_BASE_URL+"/api/v1/faculty/")
            .then(resp => {
                // Check if the response is successful
                // 200 means that this request was succesfull
                if (resp.status === 200) {
                    
                    return resp.json()
                } else {
                    console.log("Status: " + resp.status)
                    return Promise.reject("server")
                }
            }, reason => {
                return JSON.stringify({
                    'message' : reason,
                })        
            }).then(json => {
                console.log(json)
                updateFacultiesList({
                    items: json,
                    shouldLoad: false
                })
            })
            .catch( reason => {
                console.log(reason)
            })
        }
    })

    function handleItemClick(uuid) {

        navigate(BASE_URL+"/faculty/"+uuid)
    }

    const studentsTiles = faculites.items.map( data => {
        return (
            <>
                <StudentTileButton uuid={data['uuid']} onClick={() => handleItemClick(data['uuid'])} first_name={data['faculty_name']} last_name={data['last_name']} department_name={data['department_name']}/>
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
                            </div>
                            
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