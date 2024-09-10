import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

import "../styles/login.css";
import { BASE_URL, REST_API_BASE_URL } from "../constants/BaseConfig";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


// Moved from /components/login/

const Login = () => {

    let navigate = useNavigate();
    let auth = useContext(AuthContext);

    // The Form Data
    // We'll use 'onChange' to update the values here
    let [form, setForm] = useState({
        userID: '',

    })

    // TODO: You need to click twice before it works. FIXED: problem came from loader function from router
    function handleSubmit(event) {
        event.preventDefault();

        // Speacial Login For Admin (we will not leave it like this, just to make testing faster)
        if(form.userID == 'admin') {
            var user = {
                id: 'admin',
                firstname: 'Admin',
                lastname: 'User',
                isStaff: true
            }
    
            auth.signin(user, () => {
                navigate(BASE_URL+"/dashboard", { replace: true });
                toast.success("Admin Secrect Unlock Login");
            });
        }else {
            // Make request to api
            fetch(REST_API_BASE_URL + '/api/v1/login/', {
                method: 'post',
                body: JSON.stringify({
                    "id": form.userID
                })
            })
                .then(response => {

                    if (response.status === 200) {

                        return response.json();
                    } else if (response.status === 400) {

                        return Promise.reject("not_found");

                    } else {

                        console.log("Status: " + response.status);
                        return Promise.reject("server");
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
                            navigate(BASE_URL + "/dashboard", { replace: true });
                            toast.success("Login Successful");
                        });


                    }
                ).catch(
                    reason => {

                        if (reason == 'not_found') {
                            toast.error("Could Not Find User With That ID")
                        } else {
                            toast.error("Failed To Communicate With Server")
                        }

                    }
                )
        }

        
    }

    function onFieldChange(event) {
        var fieldName = event.target.name
        var fieldValue = event.target.value

        if(fieldName == 'userField') {
            setForm(value => ({...value, userID: fieldValue}))
        }
    }

    return (
        <>
            
            <div className="container">

                <div className=" col-6 left-side">
                    <h3 style={{ fontSize: "35px" }}>
                        Welcome Back to
                        <br />
                        UNIPORT LEARNING
                    </h3>
                    <div className="decorative-bar"></div>
                    <p style={{ fontSize: "15px" }}>Sign In to continue your learning</p>
                </div>

                <div className="right-side">
                    <form style={{width: 90+'%', padding: 35+'px'}} id="loginform" className="" onSubmit={handleSubmit}>
                        
                        <div className="form-group">
                            <InputText type="text" name="userField" value={form.userID} onChange={onFieldChange} placeholder="Matriculation Number/Staff ID" />
                        </div>
                        <div className="form-group">
                            <InputText type="password" name="passwordField" placeholder="PIN" disabled={true} />
                        </div>
                        <div className="form-group">
                            <Button label="Login" />
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
