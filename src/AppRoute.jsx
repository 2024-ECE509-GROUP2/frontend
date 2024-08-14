import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SideBar from "./components/common/SideBar";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MaterialsPage from "./pages/MaterialsPage";
import SchedulePage from "./pages/SchedulePage";
import StaffCoursePage from "./pages/StaffCoursesPage";
import StaffDashboard from "./pages/StaffDashboard";
import StaffSchedulePage from "./pages/StaffSchedulePage";

import StaffProgrammePage from "./pages/StaffProgrammePage";
import StaffSessionPage from "./pages/StaffSessionPage";
import './styles/layout.css';

export default function AppRoute() {

    // get context for authunticated user
    let auth = useContext(AuthContext);

    // We need to store the routes generated
    let routes = <></>;

    if(auth.isStaff) {
        //
        routes =
            <>
                <Route path="/dashboard" element={<StaffDashboard />} />
                <Route path="/schedule" element={<StaffSchedulePage/>} />
                <Route path="/courses" element={<StaffCoursePage/>} />
                <Route path="/sessions" element={<StaffSessionPage/>} />
                <Route path="/programmes" element={<StaffProgrammePage/>} />
            </>
    }else {
        routes = <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
            </>
    }

    return(
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route element={
                    <section className="layout">
                        <SideBar />
                        <Outlet />
                    </section>
                }>
                    {routes}
                </Route>

            </Routes>
        </Router>
    );
}