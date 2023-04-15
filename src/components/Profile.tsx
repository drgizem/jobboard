import {Container,Form,Card, Alert, Button} from "react-bootstrap"
import "../styles/Profile.sass"
import React, { useContext,useState,useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { storage,auth } from "../firebase";
import {ref, uploadBytesResumable} from "firebase/storage"
import ClearIcon from '@mui/icons-material/Clear';




export const Profile=()=>{
  const {state}=useContext(AuthContext)
 const [upload,setUpload]=useState<boolean>(false)
 const [userFile,setUserFile]=useState<File>({} as File)

 const fileUrl=`https://storage.googleapis.com/${auth.currentUser!.uid}/${userFile}`
  useEffect(()=>{
    const fetchApi= async ()=>{
      const res=await fetch(fileUrl,
        {
          method:"GET"
        });
        const data=await res.json();
        console.log(data)
      }
      fetchApi()
      console.log(userFile)
  })
  const handleSubmit=(e:any)=>{
    e.preventDefault()
    const file = e.target[0]?.files[0]
    if(!file) return
      
    const storageRef=ref(storage,`/${auth.currentUser!.uid}/${file.name}`)
    const uploadTask=uploadBytesResumable(storageRef,file)
    console.log(file)
    setUserFile(file)
    setUpload(true)
  }
  
  return(
    <Container className="mt-5">
      <h2>{state.userInfo.displayName}</h2>
      <p>{state.userInfo.email}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Your Resume</Form.Label>
      <Form.Control type="file"/>
      <Button variant="success" className="mt-3" type="submit">Upload</Button>
      </Form>
      {upload && <Card className="mt-4 profile_card">
        <Card.Body>{userFile.name}</Card.Body>
        <ClearIcon/>
        </Card>}
    </Container>
  )
}