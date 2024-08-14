import { useState } from "react";
import { AuthContext } from "./contexts/AuthContext";

import './styles/bootstrap.css';
import './styles/root.css';
import AppRoute from "./AppRoute";
import { NotificationContext } from "./contexts/NotificationContex";
import NotificationBar from "./components/custom/Notification";

function App() {
    const [user, setUser] = useState({
        id: null,
        firstname: "",
        lastname: "",
        isStaff: false
    });

    const [notifications, setNotification] = useState({
        closed: true, title:'',  message: '', type:'normal'
    })

    function pushNotice(title, message, type) {
        setNotification({
            closed: false, title:title,  message: message, type:type
        });
    }

    function popNotice() {
        setNotification({
            closed: true, title:notifications.title,  message: notifications.message, type:notifications.type
        });
    }

    function handleLogin(user, callback) {
        setUser(user);
        callback();
    }

    function handleLogout(callback) {
        setUser({
            id: null,
            firstname: "",
            lastname: ""
        });
        callback();
    }

    return (
        <>
            <section>
                <AuthContext.Provider value={{
                    user: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isStaff: user.isStaff,
                    signin: handleLogin,
                    logout: handleLogout
                }}>
                    <NotificationContext.Provider value={{
                        closed: notifications.closed,
                        title: notifications.title,
                        message: notifications.message,
                        type: notifications.type,
                        pushNotice: pushNotice,
                        popNotice: popNotice
                    }}>
                        <NotificationBar />
                        <AppRoute/>
                    </NotificationContext.Provider>
                </AuthContext.Provider>
            </section>
        </>
    );
}

export default App;
