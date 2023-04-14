import { InitialStateType, UserInfo } from "./AuthContext"


type ContextAction=
 | {type:"login" | "logout" ;payload:UserInfo}


export const AuthReducer=(state:InitialStateType,action:ContextAction)=>{
  switch (action.type){
    case "login":
      return {...state,userInfo:action.payload,isLogin:true}
      case "logout":
        return {...state,userInfo:{email:"",uid:"",photoURL:"",displayName:""},isLogin:false}
        default:
          return state
  }
}