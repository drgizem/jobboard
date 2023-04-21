import {Container,Form,Card, Button} from "react-bootstrap"
import "../styles/Profile.sass"
import React, { useContext,useState,useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { storage} from "../firebase";
import {ref, uploadBytesResumable,getDownloadURL,listAll,deleteObject} from "firebase/storage"
import ClearIcon from '@mui/icons-material/Clear';


export const Profile=()=>{
  const {state,dispatch}=useContext(AuthContext)
 const [userFile,setUserFile]=useState<File>({} as File)
 const [url,setUrl]=useState<string[]>([])
 const [upload,setUpload]=useState<boolean>(true)
 const [validated,setValidated]=useState<boolean>(false)

 const fileListRef = ref(storage, `${state.userInfo!.uid}/`)

  const handleSubmit=(e:any)=>{
    e.preventDefault()
    setValidated(true)
    const storageRef=ref(storage,`/${state.userInfo!.uid}/${userFile.name}`)
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
      state.list.length===0 && setUpload(false)
    })
  },[])
  const handleDelete=(name:string)=>{
    const deleteRef=ref(storage,`${state.userInfo!.uid}/${name}`)
    const newFile=state.list.find(item=>item.name ===name)
    deleteObject(deleteRef).then(()=>{
      dispatch({
        type:"resume_delete",payload:newFile
      })
    })
  }

  return(
    <Container className="mt-5">
      <h2>{state.userInfo.displayName}</h2>
      <p>{state.userInfo.email}</p>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Form.Label>Your Resume</Form.Label>
      <Form.Control required type="file" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
        setUserFile(e.target.files![0])}}/>
      <Button variant="success" className="mt-3" type="submit">Upload</Button>
      </Form>
      {state.list.map((file)=>{
      return <Card className="mt-4 profile_card">
        <Card.Body><a href={url[state.list.findIndex((item)=>item===file)]}>{file.name}</a></Card.Body>
        <ClearIcon onClick={()=>handleDelete(file.name)}/>
        </Card>})}
        {!upload && <div className="text-danger mt-3">*No uploaded resume</div>}
    </Container>
  )
}