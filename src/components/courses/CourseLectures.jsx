import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react"
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { Skeleton } from "primereact/skeleton";
import { Chip } from "primereact/chip";
import LecturerChip from "./TeacherChipCustom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import SelectStaffPanel from "../staff/SelectStaffView";

export default function CourseLecturers({uuid, cycle=''}) {

    //state variables
    let [teachersAssigned, setTeacherAssigned] = useState({
        items: [],
        loading: true,
        shouldLoad: true,
    });

    let [visible, setVisible] = useState(false);

    useEffect(() => {
        // We don't it fetching every frame
        if(teachersAssigned.shouldLoad){
            fetch(REST_API_BASE_URL+'/api/v1/courses/'+uuid+'/staff?cycle='+cycle, {
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
                setTeacherAssigned({
                    items: json,
                    loading: false,
                    shouldLoad: false
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                setTeacherAssigned(values => ({...values, loading:false}))
            })
        }
    })

    const chips = teachersAssigned.items.map( data => {
        return (
            <>
                <LecturerChip data={data}/>
            </>
        )
    })

    if(teachersAssigned.loading) {
        return(
            <Skeleton className="mb-2" borderRadius="16px"></Skeleton>
        )
    }

    return(
        <div className="card flex gap-2 w-full overflow-auto">
            {chips}
            {/* The button opend the dialog when clicked */}
            <Button icon='pi pi-plus' raised  rounded onClick={() => { if (visible) return; setVisible(true); }} />
            <Dialog visible={visible} style={{ width: '90vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                {/* the hideList is to so the a staff can't be added twice */}
                <SelectStaffPanel hideList={teachersAssigned.items.map(data => data.staff)}/>
            </Dialog>
        </div>
    )
}