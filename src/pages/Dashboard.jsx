import React, { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import "../styles/dashboard.css";
// removed bootstrap.css, replaced with primereact.css
import TimetableWeek from "../components/custom/TimetableWeekComponent";
import TimetableClass from "../components/custom/TimetableClassComponent";
import DashboardAssignmentTile from "../components/custom/DashboardAssignmentTile";

// Moved from /components/dashboard/

export default function Dashboard(content) {

    let navigate = useNavigate();
    let auth = useContext(AuthContext);

    console.log(auth.uuid);

    if(auth.uuid == null) {
      useEffect(() => {
        navigate(BASE_URL+"/");
      })
    }

    function handleLogout(event) {
        event.preventDefault();

        auth.logout();
    }


    return (
        <>
            {/* moved to SideBar.jsx and Content.jsx */}
            <div className="col-7 dashboard-content">
                <div className="dashboard-content-row" style={{alignItems: "end", justifyContent: "space-between"}}>
                    <h6 className="dashboard-welcome">Welcome {auth.firstname}</h6>
                    <div>
                        <h6>Week 6</h6>

                    </div>
                    <div style={{display: "flex", justifyContent: "end"}}>
                        <a href="#" className="nav-icon-btn has-notification">
                            <i className="bi-bell" style={{ fontSize: 2.1 + 'rem', paddingRight: 0 }}></i>
                        </a>
                        <a href="#" className="nav-icon-btn">
                            <i className="bi-person-circle " style={{ fontSize: 2.1 + 'rem', paddingRight: 0 }}></i>
                        </a>
                    </div>
                </div>
                <div className="dashboard-content-ongoing">
                    
                    <div className="dashboard-content-header">
                        <p className="ongoing-type">LIVE CLASS</p>
                        <p className="ongoing-name"><span>ECE509:</span>SOFTWARE ENGINEERING</p>
                        <p className="ongoing-message">Class Has already started.</p>
                        <form action="#" method="post">
                            <button className="ongoing-action">JOIN</button>
                        </form>
                        
                    </div>
                        
                </div>
                <div className="dashboard-content-container">
                    <p className="section-header">Your Assignments</p>

                    <div className="dashboard-content-section">
                        <DashboardAssignmentTile courseCode={"ECE518"} title={"Module"}/>
                        <DashboardAssignmentTile courseCode={"ECE518"} title={"Module"}/>
                        <DashboardAssignmentTile courseCode={"ECE518"} title={"Module"}/>
                        <DashboardAssignmentTile courseCode={"ECE518"} title={"Module"}/>
                        
                    </div>
                    <div className="section-row">
                        <a onClick={() => {}} style={{fontSize:0.6+"rem", fontWeight: 600}}>see all</a>
                    </div>
                </div>


            </div>
            <div className="col-3 h-100 mb-0 d-flex align-items-center p-1 dashboard-timetable">
                <div className="dashboard-timetable-date w-100">
                    <h4>{new Date().toLocaleDateString}</h4>

                </div>

                <TimetableWeek />
                <TimetableClass />

            </div>
        </>
    );
};
