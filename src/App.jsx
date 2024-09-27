import { useState } from "react";
import AppRoute from "./AppRoute";

import { AuthContext } from "./contexts/AuthContext";

import './styles/root.css';

import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';

import 'primeflex/primeflex.css';
import 'primeflex/themes/primeone-light.css'; 

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function App() {

    // Holds the value of the current user
    const [user, setUser] = useState({
        user: null,
        firstname: '',
        middle_name: '',
        lastname: '',
        email: '',
        profile_url: '',
        isStaff: false,
        isAdmin: false, // the admin is seperate from being a staff member 
        login: () => {},
        logout: () => {}
    });

    //Replaced Notice with react-toastify

    // Function When A User Logs in
    function handleLogin(user, callback) {
        setUser(user); // The user data is set if login is successful
        callback(); // Runs any passed in function
    }

    // Function When A User Logs Out
    function handleLogout(callback) {
        // remove current user detail (if any)
        setUser({
            id: null,
            firstname: "",
            lastname: ""
        });
        callback();
    }

    const settings = {
        appendTo: 'self',
    }

    return (
        <>
            <PrimeReactProvider value={settings}>
                <section className="p-0 m-0 ">
                    <AuthContext.Provider value={{
                        uuid: user.id,
                        middle_name: user.middle_name,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        profile_url: user.profile_url,
                        isStaff: user.isStaff,
                        isAdmin: user.isAdmin,
                        signin: handleLogin,
                        logout: handleLogout
                    }}>
                        <ToastContainer />
                        <AppRoute />
                    </AuthContext.Provider>
                </section>
            </PrimeReactProvider>
            
        </>
    );
}

export default App;
