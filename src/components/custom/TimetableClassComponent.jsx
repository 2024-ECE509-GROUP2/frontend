
export default function TimetableClass() {
    return (
        <>
            <div className="d-block w-100 h-75 ">
                <div className="dashboard-timetable-item">
                    <div className="time-row">
                        <span className="" style={{fontSize: 0.7+'rem'}}>10:00</span>
                        <span className="" style={{fontSize: 0.7+'rem'}}>-</span>
                        <span className="" style={{fontSize: 0.7+'rem'}}>-</span>
                        <span className="" style={{fontSize: 0.7+'rem'}}>-</span>
                        <span className="" style={{fontSize: 0.7+'rem'}}>12:00</span>
                    </div>
                    <div className="class">
                        <div className="class-name">Software Engineering</div>
                        <div className="class-teacher">
                            <i className=" bi-person-circle" style={{fontSize: 0.8 +'rem', paddingRight:0 } }></i>
                            Dr. Daniel
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}