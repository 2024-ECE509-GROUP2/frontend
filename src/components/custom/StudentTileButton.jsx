import { Avatar } from "primereact/avatar"

export default function UserTileButton({
    uuid, first_name, last_name, department_name,
    profileURL=null,
    isSelected=false, hasActions=false,
    onClick = () => {}, OnDelete= ()=> {}
}) {

    let classes = "selectable-tile"

    if(isSelected) {
        classes = "selectable-tile selected"
    }

    function ProfileImage({url=null}) {

        if(url == null) {
            return (
                <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
            )
        }

        return (
            <>
                <div style={{maxWidth: 60+'px', maxHeight: 60+'px'}} className="profile-container">
                    <img style={{maxWidth: 60+'px', maxHeight: 60+'px'}} src={url} />
                </div>
                
            </>
        )
    }

    if(hasActions) {
        return (
            <>
                <button key={uuid} className={classes} name="itemClick" id="" onClick={onClick} value={uuid}>
                    <div className="list-tile" >
                        <span className="leading">
                            <ProfileImage url={profileURL}/>
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
                        <ProfileImage url={profileURL}/>
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