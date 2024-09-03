export default function StudentTile({
    uuid, first_name, last_name, department_name,
    hasActions=false,
    onEdit = () => {}, OnDelete= ()=> {}
}) {

    if(hasActions) {
        return (
            <>
                <div key={uuid} className="student-tile" name="itemClick" id="" value={uuid}>
                    <div className="list-tile" >
                        <span className="leading">
                            <i className="bi-person"></i>
                        </span>
                        <div className="body">
                            <h6 className="title">
                                {first_name} {last_name} 
                            </h6>
                            <p className="subtitle">
                                {department_name}
                            </p>
                            
                        </div>
                        <span className="trailing">
                            <i className="bi-pen action--edit" onClick={onEdit}></i>
                            <i className="bi-trash action--delete" onClick={OnDelete}></i>
                        </span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div key={uuid} className="student-tile" name="itemClick" id="" value={uuid}>
                <div className="list-tile" >
                    <span className="leading">
                        <i className="bi-person"></i>
                    </span>
                    <div className="body">
                        <h6 className="title">
                            {first_name} {last_name} 
                        </h6>
                        <p className="subtitle">
                            {department_name}
                        </p>
                        
                    </div>
                    <span className="trailing">
                        
                    </span>
                </div>
            </div>
        </>
    )
}