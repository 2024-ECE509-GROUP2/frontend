import { useContext, useState } from "react";
import { NotificationContext } from "../../contexts/NotificationContex";
import "../../styles/notification.css";

export default function NotificationBar() {

    const notifier = useContext(NotificationContext);

    const type = notifier.type;
    const title = notifier.title;
    const message = notifier.message;
    const closed = notifier.closed;

    let classes = "notification "+type+" ";

    if (closed) {
        classes = "notification "+type+" closed";
    }

    function handleClose() {
        notifier.popNotice();
    }

    return (
        <section className="notification-container">
            <section>
                <div className={classes}>
                    <span className="title">{title}</span>{message}<span className="close" onClick={handleClose}>X</span>
                </div>
            </section>
        </section>
        
    )
    
}