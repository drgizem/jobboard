import {Container,Form,Card, Button} from "react-bootstrap"
import "../styles/Profile.sass"
import React, { useContext,useState,useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { storage,auth } from "../firebase";
import {ref, uploadBytesResumable,getDownloadURL,listAll,deleteObject} from "firebase/storage"
import ClearIcon from '@mui/icons-material/Clear';


export const Profile=()=>{
  const {state,dispatch}=useContext(AuthContext)
 const [userFile,setUserFile]=useState<File>({} as File)
 const [url,setUrl]=useState<string[]>([])
 const [upload,setUpload]=useState<boolean>(true)

 const fileListRef = ref(storage, `${auth.currentUser!.uid}/`)
  const handleSubmit=(e:any)=>{
    e.preventDefault()
    if(!userFile) return
   
    const storageRef=ref(storage,`/${auth.currentUser!.uid}/${userFile.name}`)
    uploadBytesResumable(storageRef,userFile).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url) => {
        setUrl((prev) => [...prev, url]);
    })
    .then(()=>{
      dispatch({
        type:"resume_add",payload:userFile
      })
    })
    setUpload(true)
  })  
  }
  useEffect(()=>{
    listAll(fileListRef).then((response)=>{
      response.items.forEach((item)=>{
        getDownloadURL(item).then((url)=>{
          setUrl((prev)=>[...prev,url])
        })
        .then(()=>{
          dispatch({
            type:"upload_page",payload:response.items
          })
        })
      })
    })

  },[])
  const handleDelete=(name:string)=>{
    const deleteRef=ref(storage,`${auth.currentUser!.uid}/${name}`)
    const newFile=state.list.find(item=>item.name ===name)
    deleteObject(deleteRef).then(()=>{
      dispatch({
        type:"resume_delete",payload:newFile
      })
    })
  }
console.log(state)
  return(
    <Container className="mt-5">
      <h2>{state.userInfo.displayName}</h2>
      <p>{state.userInfo.email}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Your Resume</Form.Label>
      <Form.Control type="file" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
        setUserFile(e.target.files![0])}}/>
      <Button variant="success" className="mt-3" type="submit">Upload</Button>
      </Form>
      {upload && state.list.map((file)=>{
      return <Card className="mt-4 profile_card">
        <Card.Body><a href={url[state.list.findIndex((item)=>item===file)]}>{file.name}</a></Card.Body>
        <ClearIcon onClick={()=>handleDelete(file.name)}/>
        </Card>})}
    </Container>
  )
}