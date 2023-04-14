import { createContext, useEffect, useReducer } from "react"
import { AuthReducer } from "./AuthReducer"


export type InitialStateType={
  userInfo:UserInfo,
  isLogin:boolean,
  savedJobs:SavedJob[],
  search:Search[]
}
export type UserInfo={
  email:string,
  uid:string,
  displayName:string,
  photoURL:string
}
export type SavedJob={
  title:string,
  company:Company,
  location:string,
  id:string,
  savedDate:string
}
export type Company={
  display_name:string
}
export type Search={
  title:string,
  location:string,
  id:string,
  searchDate:string
}
export const INITIAL_STATE:InitialStateType={
  userInfo:JSON.parse(localStorage.getItem("user") ||"") || {},
  isLogin:false,
  savedJobs:[],
  search:[]
}

export const AuthContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: INITIAL_STATE,
  dispatch: () => null
});

export const AuthContextProvider=({children}:{ children: React.ReactNode })=>{
  const[state,dispatch]=useReducer(AuthReducer,INITIAL_STATE)
 console.log(state.userInfo)
 console.log(state.savedJobs)
  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.userInfo))
  },[state.userInfo])

  return (
    <AuthContext.Provider value={{dispatch,state}}>{children}</AuthContext.Provider>
  )
}
  
  