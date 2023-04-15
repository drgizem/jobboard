import { InitialStateType, SearchJob, UserInfo } from "./AuthContext"


type ContextAction=
 | {type:"login" | "logout" ;payload:UserInfo}
 | {type:"search"; payload:SearchJob}


export const AuthReducer=(state:InitialStateType,action:ContextAction)=>{
  switch (action.type){
    case "login":
      return {...state,userInfo:action.payload,isLogin:true}
      case "logout":
        return {...state,userInfo:{email:"",uid:"",photoURL:"",displayName:""},isLogin:false}
      case "search":
        return {...state,job:{title:action.payload.title,location:action.payload.location}}
        default:
          return state
  }
}