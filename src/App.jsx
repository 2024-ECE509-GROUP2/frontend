import { useState } from "react";
import AppRoute from "./AppRoute";

import { AuthContext } from "./contexts/AuthContext";

import './styles/bootstrap.css';
import './styles/root.css';

import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import 'rsuite/dist/rsuite.min.css';


function App() {

    // Holds the value of the current user
    const [user, setUser] = useState({
        id: null,
        firstname: "",
        lastname: "",
        isStaff: false
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
                <section>
                    <AuthContext.Provider value={{
                        user: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        isStaff: user.isStaff,
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
