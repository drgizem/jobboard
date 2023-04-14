import { InitialStateType, UserInfo } from "./AuthContext"
import {Search,SavedJob} from "./AuthContext"

type ContextAction=
 | {type:"login" | "logout" ;payload:UserInfo}
 | {type:"search" ;payload:Search}
 | {type:"save" ; payload:SavedJob}
 | {type:"deleteJob";payload:SavedJob[]}
 | {type:"deleteSearch"; payload:string}


export const AuthReducer=(state:InitialStateType,action:ContextAction)=>{
  switch (action.type){
    case "login":
      return {...state,userInfo:action.payload,isLogin:true}
      case "logout":
        return {...state,userInfo:{email:"",uid:"",photoURL:"",displayName:""},isLogin:false}
      case "search":
        return {...state,search:[...state.search,action.payload]}
      case "save":
        return {...state,savedJobs:[...state.savedJobs,action.payload]}  
      case "deleteJob":
        return {...state,savedJobs:action.payload}
      case "deleteSearch":
        return {...state,search:state.search.filter((item)=>item.id !==action.payload)}
        default:
          return state
  }
}