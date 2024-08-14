
export default function ListTile({title='', subtitle='', leadingIcon=null, onClick={}}) {
    
    function buildLeadingSection() {

        if(leadingIcon != null) {

            const icon = "bi-"+leadingIcon;
            return (
                <i className={icon}></i>
            )
        }
        return (
            <></>
        )
    }
    
    return (

        <>
            <option className="list-tile">
                <span className="leading">
                    {buildLeadingSection()}
                </span>
                <div className="body">
                    <h6 className="title">
                        {title}
                    </h6>
                    <p className="subtitle">
                        {subtitle}
                    </p>
                </div>
                <span className="trailing">
                    <button className="onAction">
                        Edit
                    </button>
                </span>
            </option>
        </>
    )
}