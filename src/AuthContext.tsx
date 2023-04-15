import { createContext, useEffect, useReducer } from "react"
import { AuthReducer } from "./AuthReducer"


export type InitialStateType={
  userInfo:UserInfo,
  isLogin:boolean,
  job:SearchJob
}
export type SearchJob={
  title:string,
  location:string
}
export type UserInfo={
  email:string,
  uid:string,
  displayName:string,
  photoURL:string
}

export const INITIAL_STATE:InitialStateType={
  userInfo:JSON.parse(localStorage.getItem("user") ||"") || {},
  isLogin:false,
  job:{title:"",location:""}
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
    localStorage.setItem("user", JSON.stringify(state.userInfo))
  },[state.userInfo])

  return (
    <AuthContext.Provider value={{dispatch,state}}>{children}</AuthContext.Provider>
  )
}
  
  