import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function SideBarLink({to='/dashboard', displayText}) {

    let navigate = useNavigate();
    let location = useLocation();

    function handleLink(event) {
        event.preventDefault();

        navigate(to);
        console.log(location.pathname);
    }

    let isActive = to == location.pathname;

    return (
        <li className={ isActive ? "dashboard-sidebar-link dashboard-sidebar-link--active" : "dashboard-sidebar-link"} >
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
                <SideBarLink to="/schedule" displayText={"Schedule"}/>
                <SideBarLink to="/courses" displayText={"Courses"}/>
                <SideBarLink to="/sessions" displayText={"Sessions"}/>
                <SideBarLink to="/programmes" displayText={"Programmes"}/>
            </>
        ;
    } else {
        links = 
            <>
                <SideBarLink displayText={"Home"}/>
                <SideBarLink to="/schedule" displayText={"Schedule"}/>
                <SideBarLink to="/courses" displayText={"Courses"}/>
                <SideBarLink to="/materials" displayText={"Materials"}/>
                <SideBarLink to="/assignments" displayText={"Assignments"}/>
            </>
        ;
    }

    function handleLogout(event) {
        event.preventDefault();

        auth.logout(()=> {
            navigate('/', {replace: true});
        });
    }

    return (
        <>
            <div className="dashboard-sidebar col-2 h-100 mb-0 d-inline-flex align-items-center p-2 bg-dark text-white">
                
                <div className="logo d-block text-center w-100">
                    LMS-UNIPORT
                </div>
                <div className="d-block w-100">
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