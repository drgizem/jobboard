import {Container,Card,Button} from "react-bootstrap"
import "../styles/Savedjobs.sass"
import React, { useContext } from "react"
import {AuthContext} from "../AuthContext"
import BlockIcon from '@mui/icons-material/Block';
import { SavedJob } from "../AuthContext";


export const Saved=()=>{
  const {state,dispatch}=useContext(AuthContext)

  const deleteJob=(id:string)=>{
    const job=state.savedJobs.filter((item)=>item.id!==id)
    dispatch({
      type:"deleteJob",payload:job
    })
  }

  return(<>
    <Container className="mt-5 container">
      <h1>My jobs</h1>
      <hr></hr>
      {state.savedJobs.length===0 && <div>There are no saved jobs</div>}
      {state.savedJobs.map((job:SavedJob,key:number)=>{
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