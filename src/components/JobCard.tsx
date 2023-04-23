import { Card,Row,Col,Button,Form,Modal,Alert } from "react-bootstrap"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlockIcon from '@mui/icons-material/Block';
import { monthsStr } from "../info";
import { category } from "../category";
import { Job, AppliedJob, IsSaved } from "../types";
import { useContext, useEffect, useState } from "react";
import { doc,onSnapshot} from "firebase/firestore";
import {db} from "../firebase"
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

type Props={
job:Job,
onSave(id:string):void
deleteJob(id:string):void
onApply(id:string):void
deleteSavedJob(id:string):void
list:Job[]
}
export const JobCard=({job,onSave,deleteJob,onApply,deleteSavedJob,list}:Props)=>{
  const [isApplied,setIsApplied]=useState<boolean>(false)
  const [show,setShow]=useState<boolean>(true)
  const {state}=useContext(AuthContext)
  const [resume,setResume]=useState<boolean>(false)
  const [signin,setSignin]=useState<boolean>(false)
  const [appliedList,setAppliedList]=useState<AppliedJob[]>([])
  const [error,setError]=useState<boolean>(false)
  const [success,setSuccess]=useState<boolean>(false)
  const [save,setSave]=useState<IsSaved>({
  id:"",
  isSaved:false
  })
 
  useEffect(()=>{
    if(state.userInfo.email !==""){
      const userRef=doc(db,"users",`${state.userInfo!.uid}`)
      const unSubscribe=onSnapshot(userRef,(doc)=>{
      const dbList=doc.data()
      const list=dbList!.applied
      setAppliedList(list)
      })
      return ()=>unSubscribe()
    }
  },[state.userInfo])
  
  const handleClick=(job:Job)=>{
    setSave({...job,isSaved:true})
    onSave(job.id)
  }
  const deleteSave=(job:Job)=>{
    setSave({...job,isSaved:false})
    deleteSavedJob(job.id) 
  }
  const handleApply=()=>{
    if(state.userInfo.email !==""){
      if(state.list.length ===0){
        setResume(true)
      } else {
        setIsApplied(true)
      }
    } else {
      setSignin(true)
    } 
  }
  const handleContinue=async(id:string)=>{
    setIsApplied(false)
    onApply(job.id)
    const jobAgain=appliedList.find(item=>item.id===id)
    jobAgain ? setError(true) : setSuccess(true)
  }

  return (<>
   {resume && <Navigate to="/profile"/>}
   {signin && <Navigate to="/signin"/>}
          <Card>
            <Card.Body>
              <Row>
                <Col xs={1} >
                <div>{category.filter((item)=>{
               return item.label===job.category.label})[0].icon}</div></Col>
                <Col>
                <Card.Title>{job.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{job.company.display_name}</Card.Subtitle></Col>
              </Row>
              <Row>
              <div className="post_date">Posted on {monthsStr[Number(job.created.slice(5,7))-1]} {job.created.slice(8,10)}</div>
              <Col xs={3}>
              {job.salary_min && <Card.Text className="salary">
                From {job.salary_min}$ a year
              </Card.Text>}</Col>
              <Card.Text className="description">
                {job.description}
              </Card.Text>
              </Row>
              <Row className="mt-2">
                <div className="buttons">
              <Button variant="success" onClick={handleApply}>Apply</Button>
              <div className="icons">
              <Form.Check type="checkbox" >{save.isSaved ? <FavoriteIcon className="hearticon_clicked" onClick={()=>deleteSave(job)} />: <FavoriteBorderIcon className="hearticon" onClick={()=>handleClick(job)}/>}</Form.Check>
              <Card.Link href="#" className="m-0" ><BlockIcon onClick={()=>deleteJob(job.id)} className="text-success"/></Card.Link>
              </div>   
              </div></Row>
            </Card.Body>
          </Card>
          {success && <Alert variant="success" onClose={()=>setShow(false)} dismissible>Applied!</Alert>}
          {error && <Alert variant="danger" onClose={()=>setShow(false)} dismissible>You applied before!</Alert>}
          {isApplied &&
            ( <div
           className="modal show"
           style={{ display: 'block', position: 'initial' }}
         >
           <Modal.Dialog>
             <Modal.Body>
              <p>Do you want to apply with "{state.list[state.list.length-1].name ==="image" ? state.list[state.list.length-2].name :state.list[state.list.length-2].name}" you uploaded?</p>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="success" onClick={()=>handleContinue(job.id)}>Continue</Button>
               <Link to="/profile"><Button variant="secondary">Change Resume</Button></Link>
             </Modal.Footer>
           </Modal.Dialog>
         </div>)}
  </>)
}