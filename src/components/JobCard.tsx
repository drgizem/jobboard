import { Card,Row,Col,Button,Form } from "react-bootstrap"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlockIcon from '@mui/icons-material/Block';
import { monthsStr } from "../info";
import { category } from "../category";
import { Job } from "../types";
import { useState } from "react";
import { setDoc,getDoc,doc } from "firebase/firestore";
import {db,auth} from "../firebase"

type Props={
job:Job,
onSave(id:string):void
deleteJob(id:string):void
}
export const JobCard=({job,onSave,deleteJob}:Props)=>{
  const [isChecked,setIsChecked]=useState<boolean>(false)

  const handleClick=()=>{
    setIsChecked(true)
    onSave(job.id)
  }
  const deleteSave=async(id:string)=>{
    const userRef=doc(db,"users",`${auth.currentUser!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const job=dbList!.savedJobs.filter((item:any)=>item.id!==id)
    setDoc(userRef,{...dbList,savedJobs:job})
    setIsChecked(false)
  }
  return (
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
              <Button variant="success">Apply</Button>
              <div className="icons">
              <Form.Check type="checkbox" >{isChecked ? <FavoriteIcon className="hearticon_clicked" onClick={()=>deleteSave(job.id)} />: <FavoriteBorderIcon className="hearticon" onClick={handleClick}/>}</Form.Check>
              <Card.Link href="#" className="m-0" ><BlockIcon onClick={()=>deleteJob(job.id)} className="text-success"/></Card.Link>
              </div>   
              </div></Row>
            </Card.Body>
          </Card>
  )
}