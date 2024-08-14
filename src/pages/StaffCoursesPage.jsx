import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContex";

const REST_API_BASE_URL = import.meta.env.VITE_REST_API

export default function StaffCoursePage() {

    console.log(REST_API_BASE_URL)

    let [initialized, setInitialized] = useState(false);

    let navigate = useNavigate();

    let auth = useContext(AuthContext);
    let notifier = useContext(NotificationContext)

    let [course, setCourse] = useState({
        uuid: null,
        name: '',
        code: '',
        description: ''
    })

    let [courses, setCourses] = useState({
        items: [],
        isLoading: true
    })

    let [isSideBarClosed, toggleSideBar] = useState(true);

    if(auth.user == null) {
        useEffect(() => {
            navigate("/");
        })
    }

    useEffect(()=> {
        if(!initialized) {
            fetch(REST_API_BASE_URL+"/api/v1/courses/")
            .then(res=> res.json())
            .then(json => {
                console.log(json)
                setCourses({
                    items: json,
                    isLoading: false
                })
                setInitialized(true);
            });
        }
    })

    const options = courses.items.map( data => {

        let classes = "selectable-tile"
        if(data['uuid'] === course.uuid) {
            classes = "selectable-tile selected"
        }
        return (
            <>
                <button key={data['uuid']} className={classes} name="itemClick" id="" onClick={() => handleSelectCourse(data['uuid'])} value={data['uuid']}>
                    <div className="list-tile" >
                        <span className="leading">
                            <i className="bi-journal"></i>
                        </span>
                        <div className="body">
                            <h6 className="title">
                                {data['course_name']}
                            </h6>
                            <p className="subtitle">
                                {data['course_code']}
                            </p>
                            
                        </div>
                        <span className="trailing">
                            
                        </span>
                    </div>
                </button>
            </>
        )
    })

    function handleSelectCourse(uuid) {

        if(course.uuid != null && course.uuid === uuid){
            setCourse({
                uuid: null,
                name: '',
                code: '',
                description: ''
            });
            toggleSideBar(true)
            return
        }
        
        console.log(uuid);
        fetch(REST_API_BASE_URL+"/api/v1/courses/"+uuid)
        .then(res=> res.json())
        .then(json => {
            console.log(json)
            setCourse({
                uuid: json['uuid'],
                name: json['course_name'],
                code: json['course_code'],
                description: json['course_description']
            })
            toggleSideBar(false);
        });
    }

    function handleResetForm(event) {

        event.preventDefault()

        if(course.uuid != null){
            setCourse({
                uuid: null,
                name: '',
                code: '',
                description: ''
            });
            return
        }
    
    }

    function handleAddCourse(event) {

        event.preventDefault();
        
        fetch(REST_API_BASE_URL+"/api/v1/courses/", {
            method: "post",
            body: JSON.stringify({
                course_name: course.name,
                course_code: course.code,
                course_description: course.description
            })
        })
        .then(resp => {
            if (resp.status === 201) {
                notifier.pushNotice("Success", "Successfully Added Course", 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(json => {
            console.log(json)
            setCourse({
                uuid: json['uuid'],
                name: json['course_name'],
                code: json['course_code'],
                description: json['course_description']
            })
            setInitialized(false)
        });
    }

    function handleUpdateCourse(event) {

        event.preventDefault();

        if(course.uuid == null){
            return
        }
        
        console.log(course.uuid);

        fetch(REST_API_BASE_URL+"/api/v1/courses/"+course.uuid, {
            method: "put",
            body: JSON.stringify({
                uuid: course.uuid,
                course_name: course.name,
                course_code: course.code,
                course_description: course.description
            })
        })
        .then(resp => {
            if (resp.status === 200) {
                notifier.pushNotice("Success", "Successfully Updated Course", 'success')
                
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(json => {
            console.log(json)
            setCourse({
                uuid: json['uuid'],
                name: json['course_name'],
                code: json['course_code'],
                description: json['course_description']
            })
            setInitialized(false)
        });
    }

    function handleFormChange(event) {
        
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName === 'courseName') {
            setCourse( values => ({...values, name: fieldValue}))
        }else if(fieldName === 'courseCode') {
            setCourse( values => ({...values, code: fieldValue }))
        }else if(fieldName === 'courseDescription') {
            setCourse( values => ({...values, description: fieldValue}))
        }
        
        console.log(course)
    }

    let [courseCycles, setCourseCycles] = useState({
        items: [], isLoading: true
    });

    let [courseCycle, setCourseCycle] = useState({
        cycle: null,
        courseId: null,
        programmeId: null,
        semesterId: null
    })

    useEffect(()=> {

        if(courseCycles.isLoading & course.uuid != null) {
            fetch(REST_API_BASE_URL+"/api/v1/courses/"+course.uuid+"/cycles")
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
                setCourseCycles({
                    items: json,
                    isLoading: false
                })
            });
        }
    })  

    const sideBar =  isSideBarClosed  ? "secondary-sidebar closed": "secondary-sidebar";
    
    let [sidebarView, setSideBarView] = useState("enrollment")

    function toggleSideBarTab(viewName) {
        setSideBarView(viewName);
    }

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
        if(!sessions.isLoading && programmes.selected != null) {
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

        if(!semesters.isLoading && sessions.selected != null) {
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

        setSemesters( values => ({...values, selected: null}))
        setSessions( values => ({...values, selected: null}))
        setProgrammes( values => ({...values, selected: null}))
    }

    function handleProgrammeSelection(event) {

        const programmeUuid = event.target.value;
        console.log(programmeUuid)
        if(programmeUuid != '') {
            setProgrammes( values => ({...values, selected: programmeUuid}))
            setSessions( values => ({...values, isLoading: false, items:[]}))
        }else {
            setProgrammes( values => ({...values, selected: null}))
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
            setSessions( values => ({...values, selected: null}))
            setSemesters( values => ({...values, isLoading: false, items:[]}))
        }
        
    }

    function handleSemesterSelection(event) {

        const semesterUuid = event.target.value;
        console.log(semesterUuid)
        if(semesterUuid != '') {
            setSemesters( values => ({...values, selected: semesterUuid}))
        }else {
            setSemesters( values => ({...values, selected: null}))
        }
        
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <form className="form-section-group" >
                            <input type="text" name="searchCourse" id="searchSourceField" />
                        </form>
                        <form action="">
                            <input type="submit" name="addCourseButton" id="" />
                        </form>
                    </section>
                    <section className="page-section">
                        <div className="section-list">
                            {options}
                        </div>
                    </section>
                </div>
            </div>
            <div className={sideBar}>
                <>
                    <div className="secondary-sidebar-tab">
                        <a href="#" className={ sidebarView == "details" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("details")}}>Details</a>
                        <a href="#" className={ sidebarView == "enrollment" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("enrollment")}}>Enrollments</a>
                        <a href="#" className={ sidebarView == "lecturers" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("lecturers")}}>Lecturers</a>
                        <a href="#" className={ sidebarView == "schedule" ? "tabItem active" : "tabItem"} onClick={() =>{toggleSideBarTab("schedules")}}>Schedule</a>
                    </div>
                </>
                <div className="container">
                    <SideBarView/>         
                </div>
            </div>
        </>
    );

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
                <input type="reset" hidden={course.uuid == null} value="Clear" />
            </div>

        </form>;
    }

    function SideBarView() {
        if (sidebarView == "details") {
            return <DetailsSideBarView/>
        }else if(sidebarView == "enrollment") {
            return <EnrollmentSideBarView/>
        }else if(sidebarView == "lecturers") {
            return <LecturersSideBarView/>
        }

        return <></>
    }

    function DetailsSideBarView() {
        return <div className="wrap-forms">
            <form className="form-sidebar-group" onSubmit={course.uuid != null ? handleUpdateCourse : handleAddCourse} onReset={handleResetForm}>

                <label htmlFor="courseName">Course Name</label>
                <input type="text" name="courseName" value={course.name} onChange={handleFormChange} />
                <label htmlFor="courseCode">Course Code</label>
                <input type="text" name="courseCode" value={course.code} onChange={handleFormChange} />
                <label htmlFor="courseDescription">Course Description</label>

                <textarea type="text" className="longtext" name="courseDescription" value={course.description} onChange={handleFormChange}></textarea>
                <input hidden={course.uuid == null} type="reset" value="New Course" />
                <input type="submit" value={course.uuid == null ? "Add Course" : "Update Course"} />
            </form>
        </div>;
    }

    function EnrollmentSideBarView() {

        let [enrollments, setEnrollments] = useState({
            items: [],
            selected: '',
            isLoading: false
        })

        useEffect(() => {

            if(programmes.selected != null && semesters.selected != null && !enrollments.isLoading) {
                fetch(REST_API_BASE_URL+"/api/v1/courses/"+course.uuid+"/"+programmes.selected+"/"+semesters.selected+"/enroll")
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
                    if(json['students']){
                        setEnrollments({
                            items: json['students'],
                            isLoading: true
                        })
                    }else{
                        setEnrollments({
                            items: [],
                            isLoading: true
                        })
                    }
                    
                });
            }
            
        })

        function handleStudentClick() {

        }

        function getStudentDetails(uuid) {
            
        }

        function getDepartmentDetails(uuid) {

        }

        const students = enrollments.items.map( data => {

            let classes = "selectable-tile"
            if(data['uuid'] === course.uuid) {
                classes = "selectable-tile selected"
            }
            return (
                <>
                    <button key={data['uuid']} className={classes} name="itemClick" id="" onClick={() => handleSelectCourse(data['uuid'])} value={data['uuid']}>
                        <div className="list-tile" >
                            <span className="leading">
                                <i className="bi-person"></i>
                            </span>
                            <div className="body">
                                <h6 className="title">
                                    {data['first_name']} {data['last_name']} 
                                </h6>
                                <p className="subtitle">
                                    {data['department_name']}
                                </p>
                                
                            </div>
                            <span className="trailing">
                                
                            </span>
                        </div>
                    </button>
                </>
            )
        })

        if(enrollments.isLoading && enrollments.items.length < 1) {
            return <>
            <div>
                {CourseCycleSelectionComponent()}
                <div className="sidebar-listview">
                    <p>No Students Have Enrolled For This Cycle Yet</p>
                </div>
            </div>
            
        </>
        }

        return <>
            <div>
                {CourseCycleSelectionComponent()}
                <div className="sidebar-listview">
                    {students}
                </div>
            </div>
            
        </>
        
        
    }

    function LecturersSideBarView() {

        let [assignedLecturers, setAssignedLecturers] = useState({
            items: [],
            selected: '',
            isLoading: false
        })

        useEffect(() => {

            if(programmes.selected != null && semesters.selected != null && !assignedLecturers.isLoading) {
                fetch(REST_API_BASE_URL+"/api/v1/courses/"+course.uuid+"/"+programmes.selected+"/"+semesters.selected+"/teachers")
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
                    if(json['staff']){
                        setAssignedLecturers({
                            items: json['staff'],
                            isLoading: true
                        })
                    }
                    setAssignedLecturers({
                        items: [],
                        isLoading: true
                    })
                });
            }
            
        })

        const staff = assignedLecturers.items.map( data => {

            let classes = "selectable-tile"
            if(data['uuid'] === course.uuid) {
                classes = "selectable-tile selected"
            }
            return (
                <>
                    <button key={data['uuid']} className={classes} name="itemClick" id="" onClick={() => handleSelectCourse(data['uuid'])} value={data['uuid']}>
                        <div className="list-tile" >
                            <span className="leading">
                                <i className="bi-journal"></i>
                            </span>
                            <div className="body">
                                <h6 className="title">
                                    {data['uuid']}
                                </h6>
                                <p className="subtitle">

                                </p>
                                
                            </div>
                            <span className="trailing">
                                
                            </span>
                        </div>
                    </button>
                </>
            )
        })

        if(assignedLecturers.isLoading && assignedLecturers.items.length < 1) {
            return <>
            <div>
                {CourseCycleSelectionComponent()}
                <div className="sidebar-listview">
                    <p className="noItemsText">No Staff Has Been Assigned To This Cycle Yet</p>
                </div>
            </div>
            
        </>
        }

        return <>
            <div>
                {CourseCycleSelectionComponent()}
                <div className="sidebar-listview">
                    {staff}
                </div>
            </div>
            
        </>
        
        
    }
}