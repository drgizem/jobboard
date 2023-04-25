import { createContext, useEffect, useReducer } from "react"
import { AuthReducer } from "./AuthReducer"


export type InitialStateType={
  userInfo:UserInfo,
  isLogin:boolean,
  job:SearchJob,
  list:File[],
}
export type SearchJob={
  title:string,
  location:string
}
export type UserInfo={
  email:string,
  uid:string,
  displayName:string,
  photoURL:string,
}
export type SavedJob={
  title:string,
  company:{display_name:string},
  location:string,
  id:string,
  savedDate:string,
}
export type File={
  name:string,
  id:string
}
export const INITIAL_STATE:InitialStateType=JSON.parse(localStorage.getItem("user") || "" ) || {
  userInfo:{email:"",
    uid:"",
    displayName:"",
    photoURL:"",}, 
  isLogin:false,
  job:{title:"",location:""},
  list:[],
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

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state))
  },[state.userInfo,state.isLogin,state.list])
 
  
  return (
    <AuthContext.Provider value={{dispatch,state}}>{children}</AuthContext.Provider>
  )
}
  
  