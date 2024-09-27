import { Card } from "primereact/card"
import { DataScroller } from "primereact/datascroller"
import { DataView } from "primereact/dataview"
import { useEffect, useState } from "react";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";

export default function SelectStaffPanel({hideList=[]}) {

    //state variables
    let [staff, setStaff] = useState({
        items: [],
        loading: true,
        shouldLoad: true,
    });

    let [visible, setVisible] = useState(false);

    useEffect(() => {
        // We don't it fetching every frame

        if(staff.shouldLoad){
            fetch(REST_API_BASE_URL+'/api/v1/staff', {
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
                setStaff({
                    items: json,
                    loading: false,
                    shouldLoad: false
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                setStaff(values => ({...values, loading:false}))
            })
        }
    })

    

    const template = (data) => {

        function assignStaffToCycle() {

        }

        function IncludeBadge() {
            if(!hideList.includes(data.uuid)){
                return( <></>)
            }
            return (<>
                <Badge value={hideList.includes(data.uuid) ? "Already Added" : null} className="z-5 text-base" severity="info"></Badge>
            </>)
        }

        return(
            <div className="col-12 md:col-6 xl:col-3 p-3">
                <div className="surface-card shadow-2 border-round p-3 p-overlay-badge">
                    <IncludeBadge/>           

                    <div className="flex flex-column align-items-center border-bottom-1 surface-border pb-3">
                       
                        <Avatar image={data.profile_url} icon='pi pi-user' className="text-center" size="xlarge" shape="circle" />
                        <div className="flex flex-column align-items-center surface-border pb-3">
                            <span className="text-xl text-900 font-medium mb-2">
                                {data.first_name} {data.last_name}
                            </span>
                            <span className="text-600 font-medium mb-2">Lecturer</span>
                        </div>
                        
                    </div>
                    <div className="flex w-full pt-3 justify-content-center">
                        <Button rounded disabled={hideList.includes(data.uuid) } label="Add" className="w-full" />                        
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <>
            <div className="px-4 py-8 md:px-6 lg:px-8">
                <div className="grid grid-nogutter">
                    <DataView value={staff.items} itemTemplate={template}   />
                    
                </div>
            </div>
        </>
    )
}