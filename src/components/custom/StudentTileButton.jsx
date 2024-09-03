export default function StudentTileButton({
    uuid, first_name, last_name, department_name,
    isSelected=false, hasActions=false,
    onClick = () => {}, OnDelete= ()=> {}
}) {

    let classes = "selectable-tile"

    if(isSelected) {
        classes = "selectable-tile selected"
    }

    if(hasActions) {
        return (
            <>
                <button key={uuid} className={classes} name="itemClick" id="" onClick={onClick} value={uuid}>
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
                </button>
            </>
        )
    }

    return (
        <>
            <button key={uuid} className={classes} name="itemClick" id="" onClick={onClick} value={uuid}>
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
            </button>
        </>
    )
}