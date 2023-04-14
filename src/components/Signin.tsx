import React,{ useContext, useState } from "react"
import {Container, Form,Button} from "react-bootstrap"
import {UserData} from "../types"
import "../styles/Signin.sass"
import {Link, Navigate} from "react-router-dom"
import { AuthContext } from "../AuthContext"
import {auth} from "../firebase"
import {signInWithEmailAndPassword} from "firebase/auth"
import {setDoc,doc} from "firebase/firestore"
import {db} from "../firebase"

export const Signin=()=>{
  const [user,setUser]=useState<UserData>({} as UserData)
  const [validated,setValidated]=useState<boolean>(false)
  const {state,dispatch}=useContext(AuthContext)
  const [error,setError]=useState<boolean>(false)


  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    setUser((pre)=>{
      return {...pre,[name]:value}
    })
  }
  const handleSubmit=(e:any)=>{
    e.preventDefault()
    setValidated(true)
    signInWithEmailAndPassword(auth,user.email,user.password)
    .then((userCredential)=>{
      const user=userCredential.user
      dispatch({
        type:"login",payload:user
      })
    })
    .then(()=>{
      setDoc(doc(db,"users",`${auth.currentUser!.uid}`),{
        savedJobs:[],
        search:[]
      })
    })
    .catch((error)=>{
      console.log(error.message)
      error.message.includes("wrong-password") && setError(true)
    })
  }

 return (
  <Container>
    {state.isLogin && <Navigate to="/" />}
    <Form onSubmit={handleSubmit} validated={validated} style={{maxWidth:"500px"}} className="form">
      <h2 className="mb-4">Signin</h2>
      <Form.Control className="mb-3" required onChange={handleChange} name="email" placeholder="Enter your email" type="email" value={user.email || ""}/>
      <Form.Control className="mb-3" required onChange={handleChange}  name="password" value={user.password || ""}  type="password" placeholder="Enter your password"/>
      {error && <Form.Text className="mb-3 error">Wrong password !</Form.Text>}
      <Form.Text className="mb-3 d-flex">Create an account<Link to="/signup"><div>Sign up</div></Link></Form.Text>
      <Button variant="success"type="submit">Sign in</Button>
    </Form>
  </Container>
 )
}