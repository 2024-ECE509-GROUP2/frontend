
export default function TimetableWeek() {

    const today = new Date();

    const monday = today.getDate() - (today.getDay() -1);
    const tuesday = monday + 1;
    const wednesday = monday + 2;
    const thursday = monday + 3;
    const friday = monday + 4;
    const saturday = monday + 5;

    const isActive = "dashboard-timetable-weekday dashboard-timetable-weekday--active";

    return (
        <>
            <div className="d-block w-100 justify-content-between">
                <ol className="dashboard-timetable-week">
                    <li className={ today.getDay() == 1 ?  isActive : "dashboard-timetable-weekday"}>Mon <br /><span>{monday}</span></li>
                    <li className={ today.getDay() == 2 ?  isActive : "dashboard-timetable-weekday"}>Tues<br /><span>{tuesday}</span></li>
                    <li className={ today.getDay() == 3 ?  isActive : "dashboard-timetable-weekday"} >Wed<br/><span>{wednesday}</span></li>
                    <li className={ today.getDay() == 4 ?  isActive : "dashboard-timetable-weekday"}>Thur <br /><span>{thursday}</span></li>
                    <li className={ today.getDay() == 5 ?  isActive : "dashboard-timetable-weekday"}>Fri <br /><span>{friday}</span></li>
                    <li className={ today.getDay() == 6 ?  isActive : "dashboard-timetable-weekday"}>Sat <br /><span>{saturday}</span></li>
                </ol>
            </div>
        </>
    )
}