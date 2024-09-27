import React, { useEffect, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { REST_API_BASE_URL } from "../../constants/BaseConfig";

export default function DepartmentDropdownSelection({value=null, onSelect=(value) => {}}) {

    let [data, setData] = useState({
        loading: true,
        shouldLoad: true,
        items: [],
        selected: value
    });

    // Fetches Data from API
    useEffect(()=> {
        if (data.shouldLoad) {
            fetch(REST_API_BASE_URL+'/api/v1/departments', {
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
                setData(values => ({...values, items: json, selected:value, loading: false, shouldLoad: false}))
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

    function handleSelectOption(event) {

        setData(values => ({...values, selected: event.value}));
        onSelect(event.value);
    }

    const departments = data.items.map( (item) => {
        return {name: item.department_name, code: item.uuid}
    });

    return (
        <div className="flex justify-content-center">
            <Dropdown loading={data.loading} value={data.selected} onChange={(e) => handleSelectOption(e)} options={departments} optionLabel="name" optionValue="code"
                placeholder="Select Department" className="w-full md:w-14rem" />
        </div>
    )
}