import { createContext, useReducer } from "react"
import { AuthReducer } from "./AuthReducer"


export type InitialStateType={
  userInfo:string,
  isLogin:boolean,
  savedJobs:SavedJob[],
  search:Search[]
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
  userInfo:"",
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

  return (
    <AuthContext.Provider value={{dispatch,state}}>{children}</AuthContext.Provider>
  )
}
  
  