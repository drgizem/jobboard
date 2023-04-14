import { useContext } from "react"
import "../styles/Search.sass"
import { AuthContext } from "../AuthContext"
import { Container,Card } from "react-bootstrap"
import {Search} from "../AuthContext"
import ClearIcon from '@mui/icons-material/Clear';

export const Searchjob=()=>{
  const {state,dispatch}=useContext(AuthContext)

  const deleteSearch=(id:string)=>{
    dispatch({
      type:"deleteSearch",payload:id
    })
  }
  return(
    <Container>
      <h2>My Recent Searches</h2>
      <hr></hr>
      {state.search.length ===0 && <div>*No recent search</div>}
      {state.search && state.search.map((job:Search,key:number)=>{
        return (<><Card className="mb-3">
          <Card.Body style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p>{job.title}</p>
          <Card.Subtitle>in {job.location}</Card.Subtitle></div>
          <p className="search_date">Searched in {job.searchDate}</p>
          <ClearIcon onClick={()=>deleteSearch(job.id)}/>
          </Card.Body>       
        </Card>
        </>)
      })}
    </Container>
  )
}