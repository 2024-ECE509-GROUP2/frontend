import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react"
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function CourseStudents({uuid}) {

    //state variables
    let [studentsEnrolled, setStudentsEnrolled] = useState({
        items: [],
        loading: true,
        shouldLoad: true,
    });

    useEffect(() => {
        // We don't it fetching every frame
        if(studentsEnrolled.shouldLoad){
            fetch(REST_API_BASE_URL+'/api/v1/courses/'+uuid+'/students', {
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
                setStudentsEnrolled({
                    items: json,
                    loading: false,
                    shouldLoad: false
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                setStudentsEnrolled(values => ({...values, loading:false}))
            })
        }
    })

    if(studentsEnrolled.loading) {
        return(
            <Skeleton className="mb-2" borderRadius="16px"></Skeleton>
        )
    }

    function actionTemplate(item) {

        if(item.approved) {
            return (
                <>
                    <Tag value="Approved" />
                </>
            )
        }


        return(
            <>
                <div className="flex flex-row gap-1">
                    <Button icon="pi pi-check" label="Approve"></Button>
                    <Button icon="pi pi-times" label="Reject" className="p-button-danger"></Button>
                </div>
                
            </>
            
        )
    }

    return(
        <DataTable value={studentsEnrolled.items} tableStyle={{ minWidth: '50rem' }}>
            <Column field="student.first_name" header="First Name"></Column>
            <Column field="student.last_name" header="Last Name"></Column>
            <Column field="student.middle_name" header="Middle Name"></Column>
            <Column field="student.department_name" header="Last Name"></Column>
            <Column  header="" body={actionTemplate}></Column>

        </DataTable>
    )
}