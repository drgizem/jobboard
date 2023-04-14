import {Container,Card,Button} from "react-bootstrap"
import "../styles/Savedjobs.sass"
import React, { useEffect, useState } from "react"
import BlockIcon from '@mui/icons-material/Block';
import { SavedJob } from "../AuthContext";
import { setDoc,getDoc,doc, onSnapshot } from "firebase/firestore";
import {db,auth} from "../firebase"

export const Saved=()=>{
  const [saveList,setSaveList]=useState<SavedJob[]>([])
  const userRef=doc(db,"users",`${auth.currentUser!.uid}`)

  useEffect(()=>{
    const unSubscribe=onSnapshot(userRef,(doc)=>{
      const dbList=doc.data()
      const list=dbList!.savedJobs
      setSaveList(list)
    })
    return ()=>{
      unSubscribe()} // eslint-disable-next-line
  },[])

  const deleteJob=async(id:string)=>{
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const job=dbList!.savedJobs.filter((item:any)=>item.id!==id)
    setDoc(userRef,{...dbList,savedJobs:job})

  }

  return(<>
    <Container className="mt-5 container">
      <h1>My jobs</h1>
      <hr></hr>
      {saveList.length===0 && <div>There are no saved jobs</div>}
      {saveList.map((job:SavedJob,key:number)=>{
        return (
          <Card className="mb-3">
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{job.company.display_name}</Card.Subtitle>
            <Card.Text className="saved_date">Saved on {job.savedDate}</Card.Text>
            <div className="buttons">
            <Button variant="success">Apply</Button>
            <div className="icons">
            <Card.Link href="#" className="m-0"><BlockIcon onClick={()=>deleteJob(job.id)} className="text-success"/></Card.Link>
            </div>   
            </div>
          </Card.Body>
        </Card>
        )    
})}
    </Container>
    </>)
}