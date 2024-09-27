import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

export default function NavigationBar() {

    let [data, setData] = useState({

    });

    let currentUser = useContext(AuthContext);

    return(
        <>
            <div className="m-3 flex flex-row justify-content-between ">
                <div className="flex flex-row align-items-center">
                    <Avatar image={currentUser.profile_url} icon='pi pi-user' shape="circle" size="large" />
                    <div className="flex justify-content-center ml-3">
                        <p>Welcome,  </p>
                        <p className="font-bold"> {" "+currentUser.lastname}</p>
                    </div>
                </div>
                <div className="">
                    <i className="pi pi-bell cursor-pointer p-overlay-badge" style={{fontSize: '2rem'}} text aria-label="Notices" size="large">
                        <Badge value="5+" severity="danger" />
                    </i>
                    <i className=" ml-5 cursor-pointer pi pi-sign-out" style={{fontSize: '2rem'}} text aria-label="Sign Out" size="large" onClick={() => { currentUser.logout()}}></i>
                </div>

            </div>
        </>
    );
}