import { createContext } from "react";

export let NotificationContext = createContext({
    closed: false, title:'', message: '', type:'normal', pushNotice: (title, message, type)=> {}, popNotice: ()=> {}
});