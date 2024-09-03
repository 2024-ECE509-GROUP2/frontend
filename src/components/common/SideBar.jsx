import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { BASE_URL } from "../../constants/BaseConfig";

function SideBarLink({to=BASE_URL+'/dashboard', displayText, subdirectories=[]}) {

    let navigate = useNavigate();
    let location = useLocation();

    let [submenuOpen, toggleSubmenu] = useState(false)

    function handleLink(event) {
        event.preventDefault();

        navigate(to);
        console.log(location.pathname);
    }

    // gets divides the url by spliting them at '/'
    const pathList = location.pathname.split('/');
    const linkPathList = location.pathname.split('/');
    pathList.pop();
    const parent = pathList.join('/');

    const root = "/"+pathList[1]

    let isActive = to == location.pathname || to == parent || to == root;

    if(subdirectories.length > 0) {

        const submenu = subdirectories.map( directory => {
            return (
                <SideBarSubLink to={directory.path} displayText={directory.text}/>
            )
        });

        return (
            <li className={ isActive ? "dashboard-sidebar-link dashboard-sidebar-link--active" : "dashboard-sidebar-link"} >
                <a href="#" onClick={handleLink}>{displayText} <span><i className="bi-caret-right-fill"></i></span></a>
                <div className="dropdown-container">
                    <SideBarSubLink to={to} displayText={displayText}/>
                    {submenu}
                </div>
            </li>
        )
    }

    return (
        <li className={ isActive ? "dashboard-sidebar-link dashboard-sidebar-link--active" : "dashboard-sidebar-link"} >
            <a href="#" onClick={handleLink}>{displayText} </a>
        </li>
    )
}

function SideBarSubLink({to=BASE_URL+'/dashboard', displayText}) {

    let navigate = useNavigate();
    let location = useLocation();

    function handleLink(event) {
        event.preventDefault();

        navigate(to);
    }

    let isActive = to == location.pathname;

    return (
        <li className={ isActive ? "dashboard-sidebar-sublink dashboard-sidebar-sublink--active" : "dashboard-sidebar-sublink"} >
            <a href="#" onClick={handleLink}>{displayText}</a>
        </li>
    )
}

export default function SideBar() {

    let navigate = useNavigate();
    let auth = useContext(AuthContext);

    let links = <></>;

    if(auth.isStaff) {
        links = 
            <>
                <SideBarLink displayText={"Home"}/>
                <SideBarLink to={BASE_URL+"/schedule"} displayText={"Schedule"}/>     
                <SideBarLink to={BASE_URL+"/students"} displayText={"Students"}
                    subdirectories={[
                        { path: BASE_URL+'/students/enroll', text: "Add Students" }
                    ]}
                />
                <SideBarLink to={BASE_URL+"/faculty"} displayText={"Faculty"}
                    subdirectories={[
                        { path: BASE_URL+'/faculty/add', text: "Add Faculty" }
                    ]}
                />
                <SideBarLink to={BASE_URL+"/school"} displayText={"School"}
                    subdirectories={[
                        { path: BASE_URL+'/school/programmes', text: "Programmes" },
                        { path: BASE_URL+'/school/sessions', text: "Sessions" },
                        { path: BASE_URL+'/school/semesters', text: "Semesters" },
                    ]}
                />
            </>
        ;
    } else {
        links = 
            <>
                <SideBarLink displayText={"Home"}/>
                <SideBarLink to={BASE_URL+"/schedule"} displayText={"Schedule"}/>
                <SideBarLink to={BASE_URL+"/classroom"} displayText={"Classroom"}/>
                <SideBarLink to={BASE_URL+"/courses"} displayText={"Courses"}/>
                <SideBarLink to={BASE_URL+"/materials"} displayText={"Materials"}/>
                <SideBarLink to={BASE_URL+"/assignments"} displayText={"Assignments"}/>
            </>
        ;
    }

    function handleLogout(event) {
        event.preventDefault();

        auth.logout(()=> {
            navigate(BASE_URL+'/', {replace: true});
        });
    }

    return (
        <>
            <div className="dashboard-sidebar col-2 h-100 mb-0 mx-0 d-inline-flex align-items-center p-2 bg-dark text-white">
                
                <div className="logo d-block mx-0 text-center w-100">
                    LMS-UNIPORT
                </div>
                <div className="d-block w-100" id="style-3" style={{overflowY: 'auto', maxHeight: 55+'vh', }}>
                    <ul className="dashboard-sidebar-links">
                        {links}
                    </ul>
                </div>
                <div className="d-block w-100">
                    <div className="row px-3">
                        <i className="col-3 bi-person-circle" style={{fontSize: 2.1 + 'rem', paddingRight:0}}></i>
                        <div className="col-6">
                            <span className="row" style={{fontSize: 1+ 'rem'}}>{auth.lastname} {auth.firstname}</span>
                            <span className="row" style={{fontSize: 0.7 + 'rem'}}>
                                {auth.isStaff ? "Staff": "Student"}
                            </span>
                        </div>
                    </div>
                    <form className="sidebar-form-group" onSubmit={handleLogout}>
                        <input style={{width: 100+'%'}} type="submit" value={"Log Out"}/>
                    </form>
                </div>

            </div>
        </>
    )
}