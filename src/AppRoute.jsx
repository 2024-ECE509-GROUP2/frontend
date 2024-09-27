import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { createBrowserRouter, createRoutesFromElements, Outlet, redirect, Route, RouterProvider } from "react-router-dom";

// Pages For Error Handling
import ErrorPage from "./pages/ErrorPage";
import NotFound from "./pages/NotFound";

// Components
import SideBar from "./components/common/SideBar";

// Login Page
import Login from "./pages/Login";

// Pages For Staff(Lecturers)
import StaffDashboard from "./pages/staff/StaffDashboard";

// Pages For Student
import Dashboard from "./pages/Dashboard";

// stylesheets
import './styles/layout.css';
import './styles/routes.css';

import NavigationBar from "./components/common/NavBar";
import StaffCoursePage from "./pages/staff/StaffCoursePage";
import StaffClassroomPage from "./pages/staff/StaffClassroomPage";


export default function AppRoute() {

    // get context for authunticated user
    let auth = useContext(AuthContext);

    // We need to store the routes generated
    let paths = <></>;

    
    // removed admin from here
    
    // we are assuming the client has a SMS (Student Management System)
    // we'll use the django admin site to add information, simulating the SMS that will handle GUI

    if(auth.isStaff) {
        //
        paths =
            <>
                <Route path="dashboard" element={<StaffDashboard />} />
                {/* <Route path="schedule" element={<StaffSchedulePage />} /> */}
                <Route path="courses" element={<StaffCoursePage />} />
                <Route path="courses/:uuid" element={<StaffClassroomPage />} />
            </>
    }else {
        paths = <>
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="schedule" element={<SchedulePage />} />
            <Route path="classroom" element={<Classroom />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} /> */}
        </>
    }

    const routes = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/"> 
                    {/* 
                    
                        First We See Is Login Page

                        The Error element will only show if there is an error.
                        
                    */}
                    
                    <Route 
                        index 
                        loader={
                            () => {

                                // I added this to redirect us if the user has logged in, it should return him to this dashboard.
                                // (This is to mitigate the first redirect at all)
                                if(auth.uuid != null) {
                                    return redirect('/dashboard');
                                }

                                return null;
                            }
                        }
                        element={<Login />} 
                        errorElement={<ErrorPage />} 
                    />
                    <Route

                        loader={
                            () => {

                                // If the user is not logged in, it will redirect them to the login page
                                // Seems this method of checking, will fail the first time as the state has updated yet.
                                if (auth.uuid == null) {
                                    return redirect('/')
                                }

                                return null
                            }
                        }

                        element={
                            <section className="layout">
                                <SideBar/>
                                <div className="w-full ">
                                    <NavigationBar/> {/* Custom Navigation Bar  */}
                                    <Outlet /> {/* Changes depending on routes i.e /dashboard  */}
                                </div>
                                
                            </section>
                        }

                        errorElement={<ErrorPage />}
                    >

                        {paths}

                    </Route>
                </Route>
                {/* If the path does not exist then show 404 page */}
                <Route path="*" element={<NotFound />} errorElement={<ErrorPage />} />

            </>
        )
    )

    return(
        <RouterProvider router={routes} />
    );

}