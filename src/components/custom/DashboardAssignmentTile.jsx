
export default function DashboardAssignmentTile({courseCode, title, }) {

    return (
        <div className="section-row">
            <div className="section-leading">
                {courseCode}
            </div>
            <div className="section-title">
                {title}
                <p className="section-subtitle" style={{fontSize: 0.65 + "rem", color: "#b0b6bf"}}>
                    Due on: Thursday 1st August
                </p>
            </div>
            <div className="section-trailing">
                --/100
                <p style={{fontSize: 0.65 + "rem", color: "#b0b6bf"}}>
                    Your Grade
                </p>
            </div>
        </div>
    );
}