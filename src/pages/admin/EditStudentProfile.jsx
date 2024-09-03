import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../contexts/NotificationContex";
import '../../constants/FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { profileImageRef } from "../../constants/FirebaseConfig";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditStudentProfile() {



    let notifer = useContext(NotificationContext);
    let { uuid } = useParams();
    let navigate = useNavigate();
    const auth = useContext(AuthContext)

    if(auth.user == null) {
        navigate('/', {replace: true})
    }else if(auth.user == null) {
        navigate('/', {replace: true})
    }

    let [profileImage, setProfileImage] = useState(null)
    let [isUploadingImage, toggleUploading] = useState(false)

    let [profile, setProfile] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        profileURL: null,
        isStaff: false,
        shouldLoad: true
    })

    useEffect(()=> {

        if(!profile.shouldLoad) {
            return
        }

        fetch(REST_API_BASE_URL+'/api/v1/profile/'+uuid)
        .then( response => {
            if(response.status == 200) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        },
            reason => {
            return JSON.stringify({
                'message' : reason,
            })        
        })
        .then( json => {
            console.log(json)
            setProfile({
                id: json['uuid'],
                first_name: json['first_name'],
                middle_name: json['middle_name'],
                email: json['email'],
                last_name: json['last_name'],
                profileURL:json['profile_url'],
                isStaff: json['user_type'] == "staff",
                shouldLoad: false
            })
        })
        .catch( reason => {
            console.log(reason)
        })
    })

    function uploadFile(event) {
        setProfileImage(document.getElementById("profilePicker").files[0])
    }

    function uploadProfileImage(event) {
        event.preventDefault();

        var uploadTask;

        console.log(profileImage.name.split('.')[1])

        if(profileImage != null) {
            toggleUploading(true);
            uploadTask = uploadBytes(profileImageRef('profile'+uuid+'.jpg'), profileImage)
            .then((snapshot) => {
                
                getDownloadURL(snapshot.ref)
                .then( result => {
                    return result
                }).then( url => {
                    console.log(url)
                    toggleUploading(false)
                    setProfile(values => ({...values, profileURL: url}))
                    notifer.pushNotice("Profile Updated", "Uploaded New Profile", 'success')
                })
                
                document.getElementById("profilePicker").files = null
                setProfileImage(null);
            })
            .catch(() => {

            });
        }        
    }

    function handleFormUpdate(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if(fieldName == 'firstNameField') {
            setProfile(values=>({...values, first_name: fieldValue}))
        }else if(fieldName == 'lastNameField') {
            setProfile(values=>({...values, last_name: fieldValue}))
        }else if(fieldName == 'middleNameField') {
            setProfile(values=>({...values, middle_name: fieldValue}))
        }else if(fieldName == 'emailField') {
            setProfile(values=>({...values, email: fieldValue}))
        }
    }

    function updateProfileForm(event) {
        event.preventDefault()

        fetch(REST_API_BASE_URL+'/api/v1/profile/'+uuid, {
            method: 'put',
            body: JSON.stringify({
                'first_name': profile.first_name,
                'last_name': profile.last_name,
                'middle_name': profile.middle_name.length < 1 ? null: profile.middle_name,
                'email': profile.email,
                'profile_url': profile.profileURL,
                'user_type': profile.isStaff ? 'staff' : 'student'
            })
        })
        .then( response => {
            if(response.status == 200) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        })
        .then( json => {
            console.log(json)
            setProfile( values => ({...values, shouldLoad: true}))
            notifer.pushNotice("Profile Updated", "Changes Saved", 'success')
        })
        .catch( reason => {
            console.log('Promised rejected due to:'+reason)
            notifer.pushNotice("Profile Update Failed", "Something Went Wrong", 'error')
        })
    }

    function ProfileImage({url=null}) {

        if(url == null) {
            return (
                <i className="bi-person" ></i>
            )
        }

        return (
            <>
                <div className="profile-container">
                    <img src={url} />
                </div>
                
            </>
        )
    }

    return (
        <>
            <div className="page">
                <div className="page-container">
                    <section className="page-section">
                        <h2>Edit Profile</h2>
                    </section>
                    <section className="page-section">
                        <form className="form-section-group" onSubmit={updateProfileForm} >
                            <div className="form-group-row form-profile-group">
                                <ProfileImage url={profile.profileURL}/>
                                <div>

                                    {/* <label htmlFor="fileUpload" hidden={profileImage != null} className="custom-file-upload">
                                        Upload Image
                                    </label> */}
                                    <input type="file" name="fileUpload" id="profilePicker" onChange={uploadFile}/>
                                    
                                    <span>
                                        <button className="uploadProfileButton" disabled={profileImage == null}  id="updateProfileButton" onClick={uploadProfileImage}>Update Image</button>
                                        <i className="bi-arrow-repeat file-loading-icon" hidden={!isUploadingImage}></i>
                                    </span>
                                    

                                </div>
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="firstNameField">First Name</label>
                                <input type="text" name="firstNameField" value={profile.first_name} onChange={handleFormUpdate} id="" />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="lastNameField">Last Name</label>
                                <input type="text" name="lastNameField" value={profile.last_name} onChange={handleFormUpdate}  id="" />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="middleNameField">Middle Name</label>
                                <input type="text" name="middleNameField" value={profile.middle_name} onChange={handleFormUpdate}  id="" />
                            </div>
                            <div className="form-group-row">
                                <label htmlFor="emailField">Email</label>
                                <input type="text" name="emailField" value={profile.email} onChange={handleFormUpdate}  id="" />
                            </div>
                            <div className="form-group-row">
                                <input type="submit" value="Save" />
                            </div>
                        </form>
                        
                        <form className="form-group-row">
                            
                            
                        </form>
                    </section>
                    {/* This section is for students only */}
                    <section className="page-section">
                        <form className="form-section-group" >
                            <div className="form-group-row">
                                <label htmlFor="departmentField">Department</label>
                                <input type="text" disabled={true} name="firstNameField" id="" />
                                <label htmlFor="sessionField">Session Started:</label>
                                <input type="text" disabled={true} name="lastNameField" id="" />
                            </div>
                            
                        </form>
                    </section>
                    {/* This section is for staff memembers only */}
                    <section className="page-section">
                        <form className="form-section-group" >
                            <div className="form-group-row">
                                <label htmlFor="departmentField">Department</label>
                                <input type="text" disabled={true} name="firstNameField" id="" />
                                <label htmlFor="sessionField">Session Started:</label>
                                <input type="text" disabled={true} name="lastNameField" id="" />
                            </div>
                            
                        </form>
                    </section>
                </div>
            </div>
        
        </>
    )
}