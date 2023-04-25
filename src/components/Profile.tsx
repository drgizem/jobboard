import {Container,Form,Card, Button} from "react-bootstrap"
import "../styles/Profile.sass"
import React, { useContext,useState,useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { auth,storage} from "../firebase";
import {ref, uploadBytesResumable,getDownloadURL,listAll,deleteObject} from "firebase/storage"
import ClearIcon from '@mui/icons-material/Clear';
import { Avatar } from "@mui/material";
import { updateProfile } from "firebase/auth";
import uuid from "react-uuid";
import { useNavigate } from 'react-router'


export const Profile=()=>{
 const {state,dispatch}=useContext(AuthContext)
 const [userFile,setUserFile]=useState<File>({} as File)
 const [image,setImage]=useState<any>(null)
 const [imgUrl,setImgUrl]=useState(null || "")
 const [url,setUrl]=useState<string[]>([])
 const [validated,setValidated]=useState<boolean>(false)
 const [loading,setLoading]=useState<boolean>(false)
 const navigate = useNavigate()

  const fileListRef = ref(storage, `${state.userInfo!.uid}/`)
  const name=userFile.name+uuid()

  const handleSubmit=(e:any)=>{
    e.preventDefault()
    setValidated(true)
    const storageRef=ref(storage,`/${state.userInfo!.uid}/${userFile.name+uuid()}`)
    uploadBytesResumable(storageRef,userFile).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url) => {
        setUrl((prev) => [...prev, url]);
    })
    .then(()=>{
      dispatch({
        type:"resume_add",payload:userFile
      })
    })
    navigate(0)
  }) 
  }

  useEffect(()=>{
    const uploadFile=()=>{
      const imageRef=ref(storage,`/${state.userInfo!.uid}/image`)
      const uploadTask=uploadBytesResumable(imageRef, image)
      uploadTask.on('state_changed', 
    (snapshot:any) => {
      const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
        default:
          break;
      }
    }, 
    (error:any) => {
      console.log(error)
    }, 
    () => {
          getDownloadURL(imageRef)
            .then((url) => {
              setImgUrl(url);
            })})
    }
    image && uploadFile()
  },[image]) // eslint-disable-next-line
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
    const deleteRef=ref(storage,`${state.userInfo!.uid}/${name}`)
    const newFile=state.list.find(item=>item.name ===name)
    deleteObject(deleteRef).then(()=>{
      dispatch({
        type:"resume_delete",payload:newFile
      })
    })
  }
  const handleChangeImg = (e:any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setLoading(true)
    }
  };
const handleSubmitImg=(e:any)=>{
  e.preventDefault()
    setValidated(true)
    updateProfile(auth.currentUser!,{
      photoURL:imgUrl
    })
    dispatch({
      type:"uploadPhoto",payload:imgUrl
     })
}


  return(
    <Container className="mt-5">
      <div className="d-flex profile">
      <div><h2>{state.userInfo.displayName}</h2>
      <p>{state.userInfo.email}</p></div>
      <div><Avatar src={state.userInfo.photoURL} sx={{width:150,height:150}}/></div>
      </div>
      <div className="mt-3 mb-5">
        <Form>
        <Form.Control type="file" onChange={handleChangeImg}></Form.Control>
        <Button disabled={loading===false} variant="success" className="mt-3" onClick={handleSubmitImg}>Upload Image</Button>
        </Form>
      </div>
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
        {state.list.length===0 && <div className="text-danger mt-3">*No uploaded resume</div>}
    </Container>
  )
}