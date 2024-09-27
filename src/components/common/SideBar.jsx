import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { BASE_URL } from "../../constants/BaseConfig";
import { ScrollPanel } from "primereact/scrollpanel";

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
            <li >
                <a href="#" className="no-underline text-white mt-3 hover:text-primary" onClick={handleLink}>{displayText} <span><i className="bi-caret-right-fill"></i></span></a>
                <div className="dropdown-container">
                    <SideBarSubLink to={to} displayText={displayText}/>
                    {submenu}
                </div>
            </li>
        )
    }

    return (
        <li >
            <a href="#" className="no-underline text-white mt-2 hover:text-primary" onClick={handleLink}>{displayText} </a>
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
        <li >
            <a href="#" className="no-underline text-white mt-2 hover:text-primary" onClick={handleLink}>{displayText}</a>
        </li>
    )
}

export default function SideBar() {

    let navigate = useNavigate();
    let auth = useContext(AuthContext);

    let links = <></>;

    // moved admin to backend side 
    
    // we are assuming the client has a SMS (Student Management System)
    // we'll use the django admin site to add information, simulating the SMS that will handle GUI

    if(auth.isStaff) {
        // The Staff(Lecturer) will have seperate sidebar links
        links = 
            <>
                <SideBarLink displayText={"Home"}/>
                <SideBarLink to={BASE_URL+"/schedule"} displayText={"Schedule"}/>     
                <SideBarLink to={BASE_URL+"/courses"} displayText={"Courses"}/>     
            </>
        ;
    }  else {
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

    return (
        <>
            <div className="col-2 h-full w-1 lg:w-2 mb-0 mx-0 p-2 surface-900 shadow-2">
                <div className="block h-full w-full" id="style-3" >
                    <ul className="flex flex-column h-full justify-content-center no-underline list-none">
                        {links}
                    </ul>
                </div>
            </div>
        </>
    )
}