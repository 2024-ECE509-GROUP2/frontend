import { createContext } from "react";

export let AuthContext = createContext({
    uuid: null,
    first_name: '',
    middle_name: '',
    lastname: '',
    email: '',
    profile_url: '',
    isStaff: false,
    isAdmin: false, // the admin is seperate from being a staff member 
    login: () => {},
    logout: () => {}
});