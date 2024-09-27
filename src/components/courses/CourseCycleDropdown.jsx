import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { REST_API_BASE_URL } from "../../constants/BaseConfig";

export default function CourseCardDropdown({uuid, update= (uuid) => {}}) {

    let [data, setData] = useState({
        items: [],
        selected: null,
        shouldLoad: true,
        loading: false
    });

    useEffect(()=> {

        if(data.shouldLoad) {
            fetch(REST_API_BASE_URL+'/api/v1/cycles?course='+uuid, {
            })
            .then( response => {
                if(response.status == 200) {
                    return response.json();
                }else {
                    console.log("Status: " + response.status)
                    return Promise.reject("server");
                }
            })
            .then( json => {
                console.log(json)
                setData({
                    items: json,
                    selected: null,
                    shouldLoad: false,
                    loading: false
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
            })
        }
            
    })

    const options = data.items.map( (item) => ({name: item.semster.semester_label, code: item.uuid}))

    return(
        <>
            <div className="flex flex-row justify-content-end w-full pt-1 pb-1">
                <Dropdown value={data.selected} options={options} optionLabel="name"
                    onChange={(e) => setData(values => ({ ...values, selected: e.value }))}
                    placeholder="Cycle" />
            </div>

        </>
    )
}