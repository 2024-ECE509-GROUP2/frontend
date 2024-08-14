import { createContext } from "react";

export let AuthContext = createContext({
    user: null,
    firstname: '',
    lastname: '',
    isStaff: false,
    login: () => {},
    logout: () => {}
});