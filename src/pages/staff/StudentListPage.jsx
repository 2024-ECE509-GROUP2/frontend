import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContex";
import StudentTile from "../../components/custom/StudentTile";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import StudentTileButton from "../../components/custom/StudentTileButton";

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

    if(auth.user == null) {
        useEffect(() => {
            navigate("/");
        })
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

        if(student.uuid != null && student.uuid === uuid){
            setStudent({
                uuid : '',
                student_id : '',
                department : '',
                first_name: '',
                last_name: '', 
                department_joined : '',
                session_joined : '',
            });
            toggleSideBar(true)
            return
        }
        
        console.log(uuid);
        fetch(REST_API_BASE_URL+"/api/v1/students/"+uuid)
        .then(res=> res.json())
        .then(json => {
            console.log(json)
            setStudent({
                uuid : json['uuid'],
                student_id : '',
                first_name: json['first_name'],
                last_name: json['last_name'],
                department : '',
                department_joined : '',
                session_joined : '',
            })
            toggleSideBar(false);
        });
    }

    const studentsTiles = students.items.map( data => {

        return (
            <>
                <StudentTileButton uuid={data['uuid']} isSelected={data['uuid']==student.uuid} onClick={() => handleItemClick(data['uuid'])} first_name={data['first_name']} last_name={data['last_name']} department_name={data['department_name']}/>
            </>
        )
    })
    
    let [isSideBarClosed, toggleSideBar] = useState(true)
    let [sidebarView, toggleSideBarTab] = useState('details')

    const sideBar =  isSideBarClosed  ? "secondary-sidebar closed": "secondary-sidebar";

    
    let [sessions, setSessions] = useState({
        items: [],
        selected: '',
        isLoading: false
    })

    let [semesters, setSemesters] = useState({
        items: [],
        selected: '',
        isLoading: false
    })

    let [programmes, setProgrammes] = useState({
        items: [],
        selected: '',
        isLoading: false
    })

    useEffect(() => {
        if(!sessions.isLoading && programmes.selected != '') {
            fetch(REST_API_BASE_URL+"/api/v1/sessions/programme/"+programmes.selected)
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSessions({
                    items: json,
                    isLoading: true
                })
            });
        }

        if(!semesters.isLoading && sessions.selected != '') {
            fetch(REST_API_BASE_URL+"/api/v1/semesters/session/"+sessions.selected)
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setSemesters({
                    items: json,
                    isLoading: true
                })
            });
        }
        
        if(!programmes.isLoading) {
            fetch(REST_API_BASE_URL+"/api/v1/programme/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setProgrammes({
                    items: json,
                    isLoading: true
                })
            });
        }
    })

    const sessionOptions = sessions.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['session_label']}</option>
            </>
        )
    }) 

    const semesterOptions = semesters.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['semester_label']}</option>
            </>
        )
    })  

    const programmeOptions = programmes.items.map( data => {
        return (
            <>
                <option value={data['uuid']}>{data['programme_label']}</option>
            </>
        )
    })

    function handleResetCycle(event) {

        event.preventDefault();

        setSemesters( values => ({...values, selected: ''}))
        setSessions( values => ({...values, selected: ''}))
        setProgrammes( values => ({...values, selected: ''}))
    }

    function handleProgrammeSelection(event) {

        const programmeUuid = event.target.value;
        console.log(programmeUuid)
        if(programmeUuid != '') {
            setProgrammes( values => ({...values, selected: programmeUuid}))
            setSessions( values => ({...values, isLoading: false, items:[]}))
        }else {
            setProgrammes( values => ({...values, selected: ''}))
            setSessions( values => ({...values, isLoading: false, items:[]}))
        }
        
    }

    function handleSessionSelection(event) {

        const sessionUuid = event.target.value;
        console.log(sessionUuid)
        if(sessionUuid != '') {
            setSessions( values => ({...values, selected: sessionUuid}))
            setSemesters( values => ({...values, isLoading: false, items:[]}))
        }else {
            setSessions( values => ({...values, selected: ''}))
            setSemesters( values => ({...values, isLoading: false, items:[]}))
        }
        
    }

    function handleSemesterSelection(event) {

        const semesterUuid = event.target.value;
        console.log(semesterUuid)
        if(semesterUuid != '') {
            setSemesters( values => ({...values, selected: semesterUuid}))
        }else {
            setSemesters( values => ({...values, selected: ''}))
        }
        
    }

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
            <div className={sideBar}>
                <>
                    <div className="secondary-sidebar-tab">
                        <a href="#" className={ sidebarView == "details" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("details")}}>Details</a>
                        <a href="#" className={ sidebarView == "courses" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("courses")}}>Courses</a>
                    </div>
                </>
                <div className="container">
                    {SideBarView()}         
                </div>
            </div>
        </>
    )

    function handleFormChange() {

    }

    function SideBarView() {
        
        if(sidebarView == 'details') {
            return (
                DetailsView()
            )
        }else if(sidebarView == 'courses') {
            return (
                <CourseView/>
            )
        }
        return (
            <>
                
            </>
        )
    }

    function DetailsView() {

        function handleFormChange(event) {
        
            const fieldName = event.target.name;
            const fieldValue = event.target.value;
    
            if(fieldName === 'courseName') {
                setStudent( values => ({...values, name: fieldValue}));
            }else if(fieldName === 'courseCode') {
                setStudent( values => ({...values, code: fieldValue }));
            }
            
            console.log(student)
        }

        function handleUpdate(event) {
            event.preventDefault();
        }

        function handleAdd(event) {
            event.preventDefault();
        }

        function handleDelete(event) {
            event.preventDefault();
        }

        function handleReset(event) {
            event.preventDefault();
        }

        return  <div className="wrap-forms">
                    <form className="form-sidebar-group" onSubmit={handleDelete} >
                        
                        <input type="submit" value={"Delete Student"} />
                    </form>
                    <form className="form-sidebar-group" onSubmit={student.uuid != null ? handleUpdate : handleAdd} onReset={handleReset}>

                        <label htmlFor="courseName">First Name</label>
                        <input type="text" name="courseName" value={student.first_name} onChange={handleFormChange} />
                        <label htmlFor="courseCode">Last Name</label>
                        <input type="text" name="courseCode" value={student.last_name} onChange={handleFormChange} />
                        
                        <input hidden={student.uuid == null} type="reset" value="New Course" />
                        <input type="submit" value={student.uuid == null ? "Add Course" : "Update Course"} />
                    </form>
                </div>
    }

    function CourseCycleSelectionComponent() {
        return <form className="form-sidebar-group" onReset={handleResetCycle}>
            <div className="form-group-row">
                <div className="inline">
                    <label htmlFor="selectProgramme">Programme: </label>
                    <select className="" defaultValue={programmes.selected} value={programmes.selected} onChange={handleProgrammeSelection} name="selectProgramme" id="selectProgrammeOptions">
                        <option value=""></option>
                        {programmeOptions}
                    </select>
                </div>
            </div>
            <div className="form-group-row">
                <div className="inline">
                    <label htmlFor="selectSession">Session: </label>
                    <select className="" defaultValue={sessions.selected} value={sessions.selected} onChange={handleSessionSelection} name="selectSession" id="selectSessionOptions">
                        <option value=""></option>
                        {sessionOptions}
                    </select>
                </div>
                <div className="inline">
                    <label htmlFor="selectSemester">Semester: </label>
                    <select className="" defaultValue={semesters.selected} value={semesters.selected} onChange={handleSemesterSelection} name="selectSemester" id="selectSemesterOptions">
                        <option value=""></option>
                        {semesterOptions}
                    </select>
                </div>
                <input type="reset" value="Clear" />
            </div>

        </form>;
    }

    function CourseView() {

        let [courses, setCourses] = useState({
            items: [],
            selected: '',
            isLoading: false
        })

        useEffect(() => {

            if(programmes.selected != null && semesters.selected != '' && !courses.isLoading) {
                fetch(REST_API_BASE_URL+"/api/v1/students/"+student.uuid+"/"+programmes.selected+"/"+semesters.selected+"/")
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
                    if(json){
                        setCourses({
                            items: json,
                            isLoading: true
                        })
                    }else{
                        setCourses({
                            items: [],
                            isLoading: true
                        })
                    }
                    
                });
            }
            
        })

        const courseTiles = courses.items.map( data => {
            return (
                <>
                    <div>{data['course_name']}</div>
                </>
            )
        })

        return  <div className="section-list">
            {CourseCycleSelectionComponent()}
            {courseTiles}
        </div>
    }
}