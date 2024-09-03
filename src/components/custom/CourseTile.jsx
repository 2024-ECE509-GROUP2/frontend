export default function CourseTile({uuid, name, code, isSelected, onClick}) {

    let classes = "selectable-tile"

    if(isSelected) {
        classes = "selectable-tile selected"
    }

    return (
        <>
            <button key={uuid} className={classes} name="itemClick" id="" onClick={onClick} value={uuid}>
                <div className="list-tile" >
                    <span className="leading">
                        <i className="bi-journal"></i>
                    </span>
                    <div className="body">
                        <h6 className="title">
                            {name}
                        </h6>
                        <p className="subtitle">
                            {code}
                        </p>
                        
                    </div>
                    <span className="trailing">
                        
                    </span>
                </div>
            </button>
        </>
    )
}