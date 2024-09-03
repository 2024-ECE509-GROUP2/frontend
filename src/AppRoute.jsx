import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { createBrowserRouter, createRoutesFromElements, Outlet, redirect, Route, RouterProvider } from "react-router-dom";
import SideBar from "./components/common/SideBar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MaterialsPage from "./pages/MaterialsPage";
import SchedulePage from "./pages/SchedulePage";
import StaffCoursePage from "./pages/staff/StaffCoursesPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffSchedulePage from "./pages/staff/StaffSchedulePage";
import AssignmentsPage from "./pages/student/AssignmentsPage";
import CoursesPage from "./pages/student/CoursesPage";

import ErrorPage from "./pages/ErrorPage";
import NotFound from "./pages/NotFound";
import StaffProgrammePage from "./pages/staff/StaffProgrammePage";
import SchoolSessionPage from "./pages/admin/SchoolSessions";
import StudentListPage from "./pages/staff/StudentListPage";
import Classroom from "./pages/student/Classroom";
import './styles/layout.css';
import EditStudentProfile from "./pages/admin/EditStudentProfile";
import AddStudentPage from "./pages/admin/AddStudent";
import AddFacultyPage from "./pages/admin/AddFaculty";
import DepartmentsListPage from "./pages/admin/EditFaculty";
import FacultyListPage from "./pages/admin/FacultyList";
import AddDepartmentPage from "./pages/admin/AddDepartment";
import EditDepartmentPage from "./pages/admin/EditDepartment";
import SchoolCalenderPage from "./pages/admin/SchoolCalender";
import SchoolSemestersPage from "./pages/admin/SchoolSemsters";

export default function AppRoute() {

    // get context for authunticated user
    let auth = useContext(AuthContext);

    // We need to store the routes generated
    let paths = <></>;

    

    // if(auth.user == null) {
    //     routes = <>
    //         <R
    //     </>
    // }

    if(auth.isStaff) {
        //
        paths =
            <>
                <Route path="/dashboard" element={<StaffDashboard />} />
                <Route path="/students">
                    <Route path="enroll" element={<AddStudentPage />} />
                    <Route path=":uuid" element={<EditStudentProfile/>}/>
                    <Route index element={<StudentListPage/>}/>
                </Route>
                <Route path="/faculty">
                    <Route index element={<FacultyListPage />} />
                    <Route path="add" element={<AddFacultyPage />} />
                    <Route path=":uuid" element={<DepartmentsListPage/>}/>
                    <Route path=":uuid/addDepartment" element={<AddDepartmentPage/>}/>
                    <Route path=":uuid/edit/:edit" element={<EditDepartmentPage/>}/>
                </Route>
                <Route path="/school">
                    <Route index element={<SchoolCalenderPage />} />
                    <Route path="calender" element={<SchoolCalenderPage/>} />
                    <Route path="sessions" element={<SchoolSessionPage/>} />
                    <Route path="semesters" element={<SchoolSemestersPage/>} />
                    <Route path="programmes" element={<StaffProgrammePage/>} />
                </Route>
                <Route path="/schedule" element={<StaffSchedulePage/>} />
                <Route path="/courses" element={<StaffCoursePage/>} />
            </>
    }else {
        paths = <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/classroom" element={<Classroom />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/materials" element={<MaterialsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
            </>
    }

    const routes = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="*" element={<NotFound/>} errorElement={<ErrorPage/>}/>
                <Route path="/" element={<Login /> } errorElement={<ErrorPage/>} />
                <Route 

                    loader={
                        ()=> {
                            if(auth.user == null) {
                                return redirect('/')
                            }

                            return null
                        }
                    }
                
                    element={
                        <section className="layout">
                            <SideBar />
                            <Outlet />
                        </section>
                    }

                    errorElement={<ErrorPage/>}
                >
                    
                    {paths}
                    
                </Route>

            </>
        )
    )

    return(
        <RouterProvider router={routes} />
    );

}