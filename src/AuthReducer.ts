import { InitialStateType } from "./AuthContext"
import {Search,SavedJob} from "./AuthContext"

type ContextAction=
 | {type:"login" | "logout" ;payload:string}
 | {type:"search" ;payload:Search}
 | {type:"save" ; payload:SavedJob}
 | {type:"deleteJob";payload:SavedJob[]}


export const AuthReducer=(state:InitialStateType,action:ContextAction)=>{
  switch (action.type){
    case "login":
      return {...state,userInfo:action.payload,isLogin:true}
      case "logout":
        return {...state,userInfo:"",isLogin:false}
      case "search":
        return {...state,seach:[...state.search,action.payload]}
      case "save":
        return {...state,savedJobs:[...state.savedJobs,action.payload]}  
      case "deleteJob":
        return {...state,savedJobs:action.payload}
        default:
          return state
  }
}