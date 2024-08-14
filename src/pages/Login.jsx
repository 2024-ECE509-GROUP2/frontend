import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import "../styles/login.css";


// Moved from /components/login/

const Login = () => {

    let navigate = useNavigate();
    let auth = useContext(AuthContext);

    console.log(auth.user);

    let [userIDField, setUserField] = useState('')

    function handleSubmit(event) {
        event.preventDefault();

        var user = {
            id: 'sample1234',
            firstname: "John",
            lastname: "Ihyemi"
        }

        auth.signin(user, () => {

            navigate("/dashboard", { replace: true });
        });
    }

    function handleStudentLogin(event) {
        event.preventDefault();

        var user = {
            id: 'sample1234',
            firstname: "John",
            lastname: "Ihyemi",
            isStaff: false
        }

        auth.signin(user, () => {

            navigate("/dashboard", { replace: true });
        });
    }

    function handleStaffLogin(event) {
        event.preventDefault();

        var user = {
            id: 'sample1234',
            firstname: "John",
            lastname: "Ihyemi",
            isStaff: true
        }

        auth.signin(user, () => {

            navigate("/dashboard", { replace: true });
        });
    }

    function onFieldChange(event) {
        
    }

    if (auth.user != null) {
        useEffect(() => {
            navigate("/dashboard");
        })
    }


    return (
        <>
            <div className="container">
                <div className="left-side">
                    <h3 style={{ fontSize: "35px" }}>
                        Welcome Back to
                        <br />
                        UNIPORT LEARNING
                    </h3>
                    <div className="decorative-bar"></div>
                    <p style={{ fontSize: "15px" }}>Sign In to continue your learning</p>
                </div>

                <div className="right-side">
                    <form id="loginform" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="ID" id="ID" value={userIDField} placeholder="Matriculation Number/Staff ID"/>
                        </div>
                        <div className="form-group">
                            <input type="ID" id="ID" placeholder="Password" />
                        </div>
                        <input type="checkbox" id="keep-signed-in" />
                        <span className="checkmark"></span>
                        <label htmlFor="keep-signed-in" className="checkbox-container">
                            Keep me signed in until I sign out
                        </label>

                        <button type="submit" onClick={handleStudentLogin} style={{ fontSize: "16px" }}>
                            Student Sign In
                        </button>
                        <button type="submit" onClick={handleStaffLogin} style={{ fontSize: "16px" }}>
                            Staff Sign In
                        </button>


                        <label>
                            <p>
                                <a href="" style={{ textAlign: "center" }}>
                                    Forgot Password?
                                </a>
                            </p>
                        </label>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
