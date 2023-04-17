import { useState ,useEffect} from "react"
import "../styles/Applied.sass"
import { Container,Card } from "react-bootstrap"
import {AppliedJob } from "../types"
import { setDoc,getDoc,doc,onSnapshot } from "firebase/firestore";
import {db,auth} from "../firebase"

export const Applied=()=>{
  const [appliedList,setAppliedList]=useState<AppliedJob[]>([])

  const userRef=doc(db,"users",`${auth.currentUser!.uid}`)
  useEffect(()=>{
    const unSubscribe=onSnapshot(userRef,(doc)=>{
      const dbList=doc.data()
      const list=dbList!.applied
      setAppliedList(list)
    })
    return ()=>{
      unSubscribe()
    }
  },[])
  return(
    <Container>
      <h2 className="mt-5">Applied Jobs</h2>
      <hr></hr>
      {appliedList.map((job:AppliedJob)=>{
        return (
        <Card className="mb-3">
        <Card.Body>
          <Card.Title>{job.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
          <Card.Text className="location">in {job.location}</Card.Text>
          <Card.Text>Applied on {job.savedDate}</Card.Text>
        </Card.Body>
        </Card>)
      })}
      
    </Container>

  )
}