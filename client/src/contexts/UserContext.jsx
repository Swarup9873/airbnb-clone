import React,{ useState, createContext, useEffect } from "react";
import axios from 'axios'

export const UserContext = createContext();

export function UserContextProvider({children}){
    const [user,setUser] = useState(null);
    const [userReady,setUserReady] = useState(false);
    const [searchString, setSearchString] = useState("");
    useEffect(()=>{
        if(!user){
            axios.get('/profile').then(({data})=>{
                setUser(data);
                setUserReady(true);
            });
        }
    }, [])
    return (
        <UserContext.Provider value={{user,setUser,userReady,searchString, setSearchString}}>
            {children}
        </UserContext.Provider>
    );
}