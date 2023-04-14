import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Navigate } from "react-router-dom"

export const RequireAuth=({children}:{ children: React.ReactNode }):any=>{
  const{state}=useContext(AuthContext)
  
  return state.userInfo.email !=="" ? children : <Navigate to="/signin"/>
}