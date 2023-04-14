import {Container,Form,Button,Card} from "react-bootstrap"
import "../styles/Signup.sass"
import React, { useContext, useState } from "react";
import {Navigate} from "react-router-dom"
import {NewUser} from "../types"
import {auth} from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthContext } from "../AuthContext";
import google from "../google.png"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export const Signup=()=>{
  const [newUser,setNewUser]=useState<NewUser>({} as NewUser)
  const [signup,setSignup]=useState<boolean>(false)
  const [validated, setValidated] = useState(false);
  const {dispatch}=useContext(AuthContext)


  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    setNewUser((user)=>{
      return {...user,[name]:value}
    })
  }
  const handleSubmit=(e:any)=>{
   e.preventDefault()
   setValidated(true)
   createUserWithEmailAndPassword(auth,newUser.email,newUser.password)
   .then(()=>{
      updateProfile(auth.currentUser!,{
        displayName:newUser.name
    })
   })
   .then(()=>{
      dispatch({
        type:"login",payload:auth.currentUser
      })
   })
   .catch((error)=>{
      console.log(error.message)
   })
  }
  const handleGoogle=()=>{
    const provider=new GoogleAuthProvider()
    signInWithPopup(auth,provider)
    .then(()=>{
      setSignup(true)
    })
  }
  return(
    <Container className="container">
      {signup && <Navigate to="/signin"/>}
      <Form onSubmit={handleSubmit} validated={validated} style={{maxWidth:"500px"}} className="form">
        <h2 className="mb-4">Sign up</h2>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control required  onChange={handleChange} value={newUser.name || ""} name="name" type="text" placeholder="Enter an username" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control required  onChange={handleChange} value={newUser.email || ""} name="email" type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Password</Form.Label>
        <Form.Control required  onChange={handleChange} value={newUser.password || ""} name="password" type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="success" type="submit">
        Submit
      </Button>
     </Form>
     <h5 className="mt-4 signup">or Sign up with </h5>
        <Card className="mt-4">
          <Card.Body className="d-flex" onClick={handleGoogle}><img className="img" src={google} alt=""/>Continue with Google</Card.Body>
        </Card>
    </Container>
  )


}