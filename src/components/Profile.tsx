import {Container,Form,Card} from "react-bootstrap"
import React, { useContext,useState } from "react"
import { AuthContext } from "../AuthContext"
import axios from "axios"
import ClearIcon from '@mui/icons-material/Clear';

type File={
  name:string,
  size:string,
  type:string
}
export const Profile=()=>{
  const {state}=useContext(AuthContext)
  const [isSelected,setIsSelected]=useState<boolean>(false)
  const [file,setFile]=useState<File>({
    name:"",
    size:"",
    type:""
  })

  const handleChange=(event:any)=>{
    setFile(event.target.files[0])
    file && setIsSelected(true)
  }
  const handleSubmit=(event:any)=>{
    event.preventDefault()
    const url='http://localhost:3000/uploadFile'
    const formData=new FormData()
    formData.append("file",file.name)
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });
  }
  const deleteFile=()=>{
    setIsSelected(false)
    setFile({
      name:"",
      size:"",
      type:""
    })
  }
  return(
    <Container className="mt-5">
      <h2>{state.userInfo.displayName}</h2>
      <p>{state.userInfo.email}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Your Resume</Form.Label>
      <Form.Control type="file" onChange={handleChange}/>
      </Form>
      {isSelected && <Card className="mt-4 w-50">
      <Card.Body style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{file.name}</p> 
        <ClearIcon onClick={deleteFile}/></Card.Body>
    </Card>}
    </Container>
  )
}