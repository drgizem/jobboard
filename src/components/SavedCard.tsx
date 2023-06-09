import {Card,Modal,Button,Alert} from "react-bootstrap"
import { SavedJob,AppliedJob } from "../types"
import { useContext, useState,useEffect } from "react"
import { Link,Navigate } from "react-router-dom"
import BlockIcon from '@mui/icons-material/Block';
import { AuthContext } from "../AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import {db,auth} from "../firebase"


type Props={
  job:SavedJob
  deleteJob(id:string):void
  onApply(id:string):void
}

export const SavedCard=({job,deleteJob,onApply}:Props)=>{
const [error,setError]=useState<boolean>(false)
const [success,setSuccess]=useState<boolean>(false)
const [isApplied,setIsApplied]=useState<boolean>(false)
const {state}=useContext(AuthContext)
const [appliedList,setAppliedList]=useState<AppliedJob[]>([])
const [resume,setResume]=useState<boolean>(false)

useEffect(()=>{
  if(state.userInfo.email !==""){
    const userRef=doc(db,"users",`${auth.currentUser!.uid}`)
    const unSubscribe=onSnapshot(userRef,(doc)=>{
    const dbList=doc.data()
    const list=dbList!.applied
    setAppliedList(list)
    })
    return ()=>unSubscribe()
  }
},[state.userInfo])
const handleApply=()=>{
  if(state.list.length ===0){
    setResume(true)
  } else {
    setIsApplied(true)
  }
 }
const handleContinue=(id:string)=>{
  setIsApplied(false)
  onApply(job.id)
  const jobAgain=appliedList.find(item=>item.id===id)
  jobAgain ? setError(true) : setSuccess(true)

 }

  return (<>
    {resume && <Navigate to="/profile"/>}
      <Card className="mb-3">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{job.company.display_name}</Card.Subtitle>
        <Card.Text className="saved_date">Saved on {job.savedDate}</Card.Text>
        <div className="buttons">
        <Button variant="success" onClick={handleApply}>Apply</Button>
        <div className="icons">
        <Card.Link href="#" className="m-0"><BlockIcon onClick={()=>deleteJob(job.id)} className="text-success"/></Card.Link>
        </div>   
        </div>
      </Card.Body>
    </Card>
    {success && <Alert variant="success" onClose={()=>setSuccess(false)} dismissible>Applied!</Alert>}
    {error &&  <Alert variant="danger" onClose={()=>setError(false)} dismissible>You applied before!</Alert>}
    {isApplied &&
        ( <div
       className="modal show"
       style={{ display: 'block', position: 'initial' }}
     >
       <Modal.Dialog>
         <Modal.Body>
          <p>Do you want to apply with "{state.list[state.list.length-1].name ==="image" ? state.list[state.list.length-2].name : state.list[state.list.length-1].name}" you uploaded?</p>
         </Modal.Body>
         <Modal.Footer>
           <Button variant="success" onClick={()=>handleContinue(job.id)}>Continue</Button>
           <Link to="/profile"><Button variant="secondary">Change Resume</Button></Link>
         </Modal.Footer>
       </Modal.Dialog>
     </div>)}
    </>)
}