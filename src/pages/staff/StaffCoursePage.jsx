import { useEffect, useState } from "react"
import { REST_API_BASE_URL } from "../../constants/BaseConfig";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export default function StaffCoursePage() {

    let [programmes, fetchProgrammes] = useState({
        loading: true,  // if fetch is in progress
        shouldLoad: true, // if it should make the request
        items: [], // where we will store the items
        selected: null // the current selected item
    });

    let [semesters, fetchSemesters] = useState({
        loading: true,  // if fetch is in progress
        shouldLoad: true, // if it should make the request
        items: [], // where we will store the items
        selected: null // the current selected item
    }); // do the same thing for semesters
    
    let [courses, fetchCourse] = useState({
        loading: false,  // if fetch is in progress
        shouldLoad: false, // if it should make the request (at first, no)
        items: [] // where we will store the items
    })

    useEffect(() => {
        //run on each render

        if(programmes.shouldLoad) { // we don't want it load every page
            fetch(REST_API_BASE_URL+'/api/v1/programme/', {
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
                console.log(json) // log to console for debugging

                fetchProgrammes({
                    items: json, // store the json into items
                    loading: false, // notify that it doesn't need to load anymore
                    shouldLoad: false // notfiy that it doesn't need to load anymore
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                fetchProgrammes(values => ({...values, loading:false}))
            })

        }

        if(semesters.shouldLoad) { // we don't want it load every page
            fetch(REST_API_BASE_URL+'/api/v1/semesters/?programme='+programmes.selected, {
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
                console.log(json) // log to console for debugging

                fetchSemesters({
                    items: json, // store the json into items
                    loading: false, // notify that it doesn't need to load anymore
                    shouldLoad: false // notfiy that it doesn't need to load anymore
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                fetchSemesters(values => ({...values, loading:false}))
            })

        }

        if(courses.shouldLoad) { // we don't want it load every page
            fetch(REST_API_BASE_URL+'/api/v1/cycles/?semester='+semesters.selected, {
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
                console.log(json) // log to console for debugging

                fetchCourse({
                    items: json, // store the json into items
                    loading: false, // notify that it doesn't need to load anymore
                    shouldLoad: false // notfiy that it doesn't need to load anymore
                })
            })
            .catch( reason => {
                console.log('Promised rejected due to:'+reason)
                fetchCourse(values => ({...values, loading:false, shouldLoad: false}))
            })

        }
    });

    function handleProgrammeDropdownSelection(e) {
        fetchProgrammes(values => ({ ...values, selected: e.value }))
        fetchSemesters(values => ({ ...values, shouldLoad: true }))
    }

    function handleSemesterDropdownSelection(e) {
        fetchSemesters(values => ({ ...values, selected: e.value }))
        fetchCourse(values => ({ ...values,shouldLoad: true }))
    }

    const optionsForProgrammes = programmes.items.map( (item) => ({name: item.programme_label, code: item.uuid}))
    
    const optionsForSemester = semesters.items.map( (item) => ({name: item.semester_label, code: item.uuid}))


    const cards = courses.items.map( (data) => {
        return(
            <>
                <div className="col-12 md:col-6 xl:col-3 p-3">
                    <div className="surface-card shadow-2 border-round p-3 p-overlay-badge">

                        <div className="flex flex-column align-items-center border-bottom-1 surface-border pb-3">

                            <div className="flex flex-column align-items-center surface-border pb-3">
                                <span className="text-xl text-900 font-medium mb-2">
                                    {data.course.course_name}
                                </span>
                                <span className="text-600 font-medium mb-2">Lecturer</span>
                            </div>

                        </div>
                        <div className="flex w-full pt-3 justify-content-center">
                            <Button rounded outlined label="Open Classroom" className="w-full" />
                        </div>
                    </div>
                </div>
            </>
        )
    });

    return(
        <>
            <div className="grid p-7">
                <div className="flex flex-row justify-content-end w-full pt-1 pb-1">
                    <Dropdown value={programmes.selected} options={optionsForProgrammes} optionLabel="name" optionValue="code"
                        onChange={handleProgrammeDropdownSelection}
                        placeholder="Select Programme" />

                    <Dropdown value={semesters.selected} options={optionsForSemester} optionLabel="name" optionValue="code"
                    onChange={handleSemesterDropdownSelection}
                    placeholder="Pick Semester" />
                </div>

            </div>
            <div className="grid">
                {cards}
            </div>
        </>
    )
}