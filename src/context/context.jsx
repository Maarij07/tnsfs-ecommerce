import { createContext, useState,useContext,useEffect } from "react";
import {auth,provider } from '../lib/firebase';

const AddContext = createContext();

export function useLocalContext(){
    return useContext(AddContext);
}
export function ContextProvider({children}){
    const [loggedInUser,setLoggedInUser] = useState(null);    

    const value = { 
        loggedInUser,
        setLoggedInUser,
     };

    return <AddContext.Provider value={value} >{children}</AddContext.Provider>;
}
