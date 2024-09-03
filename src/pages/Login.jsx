import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import "../styles/login.css";
import { REST_API_BASE_URL } from "../constants/BaseConfig";
import { NotificationContext } from "../contexts/NotificationContex";


// Moved from /components/login/

const Login = () => {

    let navigate = useNavigate();
    let notifier = useContext(NotificationContext)
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

        fetch(REST_API_BASE_URL+'/api/v1/login/', {
            method: 'post',
            body: JSON.stringify({
                "id": 'u18/302001'
            })
        })
        .then( response => {

            if (response.status === 200) {
                notifier.pushNotice("Login Successful", "", 'success')
                
                return response.json()
            } else {
                notifier.pushNotice("Login Failed", "", 'error')

                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
            
            
        })
        .then(
            json => {

                var user = {
                    id: json['uuid'],
                    firstname: json['first_name'],
                    lastname: json['last_name'],
                    isStaff: json['user_type'] == "staff"
                }

                auth.signin(user, () => {
                    navigate("/dashboard", { replace: true });
                });
            }
        )

        
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
        navigate("/dashboard");
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
                        <div className="form-group">

                            <div className="form-group-row">
                                <input type="checkbox" id="keep-signed-in" />
                                <span className="checkmark"></span>
                                <label htmlFor="keep-signed-in" className="checkbox-container">
                                    Keep me signed in until I sign out
                                </label>
                            </div>
                            

                            <button type="submit" onClick={handleStudentLogin} style={{ fontSize: "16px" }}>
                                Student Sign In
                            </button>
                            <button type="submit" onClick={handleStaffLogin} style={{ fontSize: "16px" }}>
                                Staff Sign In
                            </button>
                            <p style={{width: 100+'%'}}>
                                <a href="" style={{ textAlign: "center" }}>
                                    Forgot Password?
                                </a>
                            </p>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
