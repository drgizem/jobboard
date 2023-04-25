import { File, InitialStateType, SearchJob, UserInfo } from "./AuthContext"



type ContextAction=
 | {type:"login" | "logout" ;payload:UserInfo}
 | {type:"search"; payload:SearchJob}
 | {type:"resume_add" | "resume_delete" ; payload:File}
 | {type:"upload_page" ; payload:File[]}
 | {type:"uploadPhoto"; payload:string}



export const AuthReducer=(state:InitialStateType,action:ContextAction)=>{
  switch (action.type){
    case "login":
      return {...state,userInfo:action.payload,isLogin:true}
      case "logout":
        return {...state,userInfo:{email:"",uid:"",photoURL:"",displayName:""},isLogin:false}
      case "search":
        return {...state,job:{title:action.payload.title,location:action.payload.location}}
       case "resume_add":
        return {...state,list:[...state.list,action.payload]} 
       case "resume_delete":
        return {...state,list:state.list.filter((item)=>item.name !==action.payload.name)} 
      case "upload_page":
        return {...state,list:action.payload}
        case "uploadPhoto":
          return {...state,userInfo:{...state.userInfo,photoURL:action.payload}}
        default:
          return state
  }
}