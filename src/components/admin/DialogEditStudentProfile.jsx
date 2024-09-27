import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, REST_API_BASE_URL } from "../../constants/BaseConfig";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { useEffect, useRef, useState } from "react";
import { Badge } from "primereact/badge";
import DepartmentDropdownSelection from "../forms/DropdownDepartments";
import { profileImageRef } from "../../constants/FirebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

export default function DialogEditStudentProfile() {

    // Get Parameter from Route
    let {uuid} = useParams();

    let navigate = useNavigate();

    // State Variable to hold data after it has been fectched
    let [data, setData] = useState({
        loading: true,
        shouldLoad: true,
        item: {}
    });

    let [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        department: '',
        student_id: '',
        profileURL: null,
        isStaff: false,
    })

    // Holds the data for image 
    let [profileImage, setProfileImage] = useState(null);
    let [isUploadingImage, toggleUploading] = useState(false);

    // Reference For Upload Button
    let fileUpload = useRef(null);

    // Fetches Data from API
    useEffect(()=> {
        if (data.shouldLoad & uuid != null) {
            fetch(REST_API_BASE_URL+'/api/v1/students/'+uuid, {
            })
            // get response
            .then( response => {
                // 200 means request was successful
                if(response.status == 200) {
                    // pass on the json response we were expecting
                    return response.json()
                }else {
                    // logs the error on the console
                    console.log("Status: " + response.status)
                    // if the request failed then tell fucntion to stop waiting
                    return Promise.reject("server")
                }
            })
            .then( json => {
                // the json was 
                console.log(json)
                setData({
                    item: json,
                    shouldLoad: false,
                    loading: false
                })
                setFormData({
                    first_name: json.first_name,
                    middle_name: json.middle_name,
                    last_name: json.last_name,
                    email: json.email,
                    department: json.department,
                    student_id: json.student_id,
                    profileURL: json.profile_url,
                    isStaff: false,
                })
            })
            // if there is an error i.e like when we 'reject'
            .catch( reason => {
                // logs the errror to console
                console.log('Promised rejected due to:'+reason)
                // stops the function running every single frame
                setData(values => ({...values, loading: false, shouldLoad: false}))
            }) 
        }
               
    });

    function handleSubmit() {
        
    }

    // When The Dialog is Closed
    function onCloseDialog() {
        navigate(BASE_URL+'/students', {replace: true})
        setData({
            loading: true,
            shouldLoad: true,
            item: {}
        });
        setFormData({
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            department: '',
            profileURL: null,
            isStaff: false,
        })
        setProfileImage(null);
    }

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            setProfileImage(file.objectURL); // store the image 
        };
    };

    const uploadImage = (event) => {
        event.preventDefault();

        var uploadTask;

        var extenstion = 'jpg';//profileImage.name.split('.')[1];

        if(profileImage != null) {
            toggleUploading(true);
            uploadTask = uploadBytes(profileImageRef('profile'+uuid+'.'+extenstion), profileImage)
            .then((snapshot) => {
                
                getDownloadURL(snapshot.ref)
                .then( result => {
                    return result
                }).then( url => {
                    console.log(url)
                    toggleUploading(false)
                    setFormData(values => ({...values, profileURL: url}))
                    fileUpload.current.clear();
                    toast.success("Uploaded New Profile Picture")
                })
                
                document.getElementById("profilePicker").files = null
                setProfileImage(null);
            })
            .catch(() => {
                toast.error("Something Went Wrong")
            });
        }  
    }

    return(
        <>
            <Dialog visible={uuid != null} onHide={onCloseDialog} className="w-full m-5">
                <div className="p-5 grid gap-3">

                    <div className="col-12 grid">
                        <div className="col-fixed" style={{width:'200px'}}>
                            <Avatar image={profileImage != null ? profileImage: formData.profileURL} icon='pi pi-user' shape="circle" size="large" style={{ width: '90px', height: '90px' }}>
                                <Badge value={profileImage == null ? '': '*'} severity={profileImage == null ? 'info': 'warning'} />
                            </Avatar>
                        </div>
                        <div className="col-9 p-0 align-content-end">
                            <div className="flex">
                                <FileUpload ref={fileUpload} mode="basic" name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={customBase64Uploader} onUpload={customBase64Uploader} onClear={() => {setProfileImage(null)}} customUpload removeIcon='pi pi-eject' />
                                <Button disabled={profileImage == null} className="ml-3" label="Upload Image" onClick={uploadImage} style={{width: '200px'}} size="small" />
                                <Button visible={profileImage != null} severity="danger" className="ml-3" label="Clear" style={{width: '200px'}} size="small" onClick={() => {fileUpload.current.clear()}}/>
                            </div>
                            
                        </div>
                    </div>

                    <div className="field grid">
                        <label htmlFor="fieldFirstName"  className="col-fixed" style={{width:'200px'}} >First Name</label>
                        <div className="col">
                            <InputText name="fieldFirstName" required value={formData.first_name} onChange={(e) => {setFormData(values => ({...values, first_name: e.target.value}))}} placeholder="First Name" />

                        </div>

                    </div>
                    <div className="field grid">

                        <label htmlFor="fieldLastName" className="col-fixed" style={{width:'200px'}}>Last Name</label>
                        <div className="col">
                            <InputText name="fieldLastName" value={formData.last_name} onChange={(e) => {setFormData(values => ({...values, last_name: e.target.value}))}} placeholder="Last Name" />

                        </div>

                    </div>
                    <div className="field grid col-12 p-0">

                        <label htmlFor="fieldMiddleName" className="col-fixed" style={{width:'200px'}}>Middle Name</label>
                        <div className="col">
                            <InputText name="fieldMiddleName" value={formData.middle_name} onChange={(e) => {setFormData(values => ({...values, middle_name: e.target.value}))}} placeholder="Middle Name" />

                        </div>

                    </div>
                    <div className="field grid col-12 p-0">

                        <label htmlFor="fieldEmail" className="col-fixed" style={{width:'200px'}}>Email</label>
                        <div className="col">
                            <InputText name="fieldEmail" value={formData.email} onChange={(e) => {setFormData(values => ({...values, email: e.target.value}))}} placeholder="Email" />

                        </div>

                    </div>
                    <div className="field grid">

                        <label htmlFor="fieldStudentId" className="col-fixed" style={{width:'200px'}}>Student ID</label>
                        <div className="col">
                            <InputText name="fieldStudentId" disabled value={formData.student_id}  placeholder="Student ID" />

                        </div>

                    </div>
                    <div className="field grid col-12 p-0">

                        <p className="font-bold ">School Details</p>

                    </div>
                    <div className="field grid">
                        <label htmlFor="fieldDepartment" className="col-fixed" style={{ width: '200px' }} >Department</label>
                        <div className="col">
                            <div className="flex justify-content-center">
                                <DepartmentDropdownSelection value={formData.department} onSelect={(e) => { console.log(e)}} />
                            </div>
                        </div>

                    </div>

                    <div className="field grid col-12 p-0">
                        <div className="col">
                            <Button onClick={handleSubmit} label="Save Changes" />
                        </div>

                    </div>
                    
                    
                </div>
            </Dialog>
        </>
    )

}