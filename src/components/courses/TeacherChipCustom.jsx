import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { useRef, useState } from "react";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";

export default function LecturerChip({data}) {

    let [loading, setLoading] = useState(false);

    function handleRemoveLecturer() {
        setLoading(true);
        
        fetch(REST_API_BASE_URL+'/api/v1/courses/staff/remove/'+data.uuid, {
            method: 'delete'
        })
        .then( response => {
            if(response.status == 204) {
                return response.json()
            }else {
                console.log("Status: " + response.status)
                return Promise.reject("server")
            }
        })
        .then( json => {
            console.log(json);
            setLoading(false);
        })
        .catch( reason => {
            console.log('Promised rejected due to:'+reason);
            setLoading(false);
        })
    }

    let overlaypanel = useRef(null);

    function IncludeTags() {
        if (data.is_supervisor) {
            return(
                <Tag severity={'info'} value='Supervisor'></Tag>
            )
        }

        return (
            <></>
        )
    }

    const template = (
        <>
           
            <span id="lectuerchip" className="ml-2 font-medium cursor-pointer" onClick={(e) => overlaypanel.current.toggle(e)}>{data.first_name+" "+data.last_name}</span>
            <OverlayPanel className="w-30rem h-13rem" appendTo={()=> document.getElementById('lecturerchip')} ref={overlaypanel}>
                <div className="flex justify-content-between w-full">
                    <Avatar className="p-overlay-badge w-8rem h-8rem" image={data.profile_url} icon="pi pi-user" size="xlarge" />
                    <div className="flex flex-column align-self-start" style={{width: 80+'%', marginLeft: 10+'px'}}>
                        <p className="text-900">{data.first_name + " " + data.last_name}</p>
                        <IncludeTags/>
                    </div>

                </div>
                <div className="flex flex-row mt-2 align-self-end">
                    <Button label="Remove" onClick={handleRemoveLecturer} icon={ loading ? 'pi pi-spinner pi-spin': null} />
                </div>
                
            </OverlayPanel>
        </>
    )

    return (
        <>
            <Avatar className="p-overlay-badge w-8rem h-8rem" image={data.profile_url} icon="pi pi-user" size="xlarge" />
            <OverlayPanel className="w-30rem h-13rem" appendTo={()=> document.getElementById('lecturerchip')} ref={overlaypanel}>
                <div className="flex justify-content-between w-full">
                    <Avatar className="p-overlay-badge w-8rem h-8rem" image={data.profile_url} icon="pi pi-user" size="xlarge" />
                    <div className="flex flex-column align-self-start" style={{width: 80+'%', marginLeft: 10+'px'}}>
                        <p className="text-900">{data.first_name + " " + data.last_name}</p>
                        <IncludeTags/>
                    </div>

                </div>
                <div className="flex flex-row mt-2 align-self-end">
                    <Button label="Remove" onClick={handleRemoveLecturer} icon={ loading ? 'pi pi-spinner pi-spin': null} />
                </div>
                
            </OverlayPanel>
        </>
    )
}