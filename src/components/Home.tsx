import "../styles/Home.sass"
import ComputerIcon from '@mui/icons-material/Computer';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ScienceIcon from '@mui/icons-material/Science';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SchoolIcon from '@mui/icons-material/School';
import StoreIcon from '@mui/icons-material/Store';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Navigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useContext, useState,useEffect} from "react"
import { AuthContext } from '../AuthContext';
import {Container,Row,Col,Form,Button,Stack,Card} from "react-bootstrap"
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlockIcon from '@mui/icons-material/Block';
import {Job,Filter} from "../types"
import uuid from "react-uuid";

export const category=[{label:"Accounting & Finance Jobs",icon:<AttachMoneyIcon/>},{label:"Sales Jobs",icon:<AttachMoneyIcon/>},{label:"IT Jobs",icon:<ComputerIcon/>},{label:"Engineering Jobs",icon:<ComputerIcon/>},
{label:"Customer Services Jobs",icon:<PersonAddAltIcon/>},{label:"HR & Recruitment Jobs",icon:<PersonAddAltIcon/>},{label:"Trade & Construction Jobs",icon:<PersonAddAltIcon/>},
{label:"Advertising & Marketing Jobs",icon:<PersonAddAltIcon/>},{label:"Logistics & Warehouse Jobs",icon:<DirectionsBusIcon/>},{label:"Energy, Oil & Gas Jobs",icon:<BoltIcon/>},
{label:"Healthcare & Nursing Jobs",icon:<StoreIcon/>},{label:"Hospitality & Catering Jobs",icon:<StorefrontIcon/>},{label:"Teaching Jobs",icon:<SchoolIcon/>},{label:"Creative & Design Jobs",icon:<DesignServicesIcon/>},{label:"Scientific & QA Jobs",icon:<ScienceIcon/>}
,{label:"Travel Jobs",icon:<LocalAirportIcon/>},{label:"Domestic help & Cleaning Jobs",icon:<CleaningServicesIcon/>}]

export const Home=()=>{
const [list,setList]=useState<Job[]>([])
const [job,setJob]=useState<Job>({} as Job)
const [page,setPage]=useState<number>(1)
const [signin,setSignin]=useState<boolean>(false)
const [filter,setFilter]=useState<Filter>({
  salary:"",
  posted:"",
  employ:""
})
const {state,dispatch}=useContext(AuthContext)

const date = new Date();
let day = date.getDate();
let monthsStr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
let month = monthsStr[date.getMonth()];
let currentDate=`${month} ${day}`

const title_url=`https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=f56bbe74&app_key=b8dde6bfd2f9c162d16ae945cafec698&results_per_page=9&title_only=${job.title}&where=${job.location}${filter.posted}${filter.salary}${filter.employ}`
useEffect(()=>{
  const fetchApi= async ()=>{
    const res=await fetch(title_url,
      {
        method:"GET"
      });
      const data=await res.json();
      setList(data.results)
  }
  fetchApi()
},[filter,page])

const handleChange=(e:any)=>{
  const {name,value}=e.target
  setJob((preJob)=>{
    return {...preJob,[name]:value}
  })
}
const deleteJob=(id:string)=>{
  setList(list.filter((job)=>{
    return job.id !==id
  }))
}
const onIncreasePage=()=>{
  setPage(page+1)
}
const onDecreasePage=()=>{
  setPage(page-1)
}
const handleDetail=(e:any)=>{
  const {name,value}=e.target
  setFilter((pre)=>{
    return {...pre,[name]:value}
  })
}
const handleClick=()=>{
  setFilter({
    posted:"",
    employ:"",
    salary:""
  })
  dispatch({
    type:"search",payload:{title:job.title,location:job.location,id:uuid(),searchDate:currentDate}
  })
}
const onSave=(id:string)=>{
  const favJob=list.find(item=>item.id===id)
  state.userInfo ? dispatch({
    type:"save",payload:{
        title:favJob!.title,
        company:favJob!.company,
        location:favJob!.location,
        id:favJob!.id,
        savedDate:currentDate
    }
  }) : setSignin(true)
}
  return (
    <Container>
     {signin && <Navigate to="/signin"/>}
    <Row className="mt-5">
      <Stack direction="horizontal" gap={5}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>What </Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="Job title" name="title" value={job.title || ""} onChange={handleChange}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Where</Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="United States" name="location" value={job.location || ""} onChange={handleChange}/>
    </Form.Group>
    <Button variant="success" onClick={handleClick}>
      Search
    </Button>
    </Stack>
    </Row>
    <hr></hr>
    {list.length ===0 && <div className="scroll-container"><p className="scroll-text">Find your job, let's go!</p></div>}
    {list.length !==0 && (<Row className="mb-3">
      <Col>
      <Form.Select aria-label="Default select example" name="posted" onChange={handleDetail} value={filter.posted}>
    <option>Date posted</option>
    <option value="&max_days_old=5" >Last 5 days</option>
    <option value="&max_days_old=10" >Last 10 days</option>
    <option value="&max_days_old=30" >Last 30 days</option>
  </Form.Select></Col>
      <Col>
      <Form.Select aria-label="Default select example" name="salary" onChange={handleDetail} value={filter.salary}>
    <option>Salary estimate</option>
    <option value="&salary_min=30000">$30,000+</option>
    <option value="&salary_min=50000">$50,000+</option>
    <option value="&salary_min=70000">$70,000+</option>
  </Form.Select></Col>
      <Col>
      <Form.Select aria-label="Default select example" name="employ" onChange={handleDetail} value={filter.employ}>
    <option>Employment type</option>
    <option value="&full_time=1">Full-time</option>
    <option value="&part_time=1">Part-time</option>
    <option value="&contract=1">Contract</option>
  </Form.Select></Col>
  </Row>)}
    <Row className="jobs">
    {list.map((job:Job,key:number)=>{
      return (
        <Card key={job.id}>
        <Card.Body>
          <Row>
            <Col xs={1} >
            <div>{category.filter((item)=>{
           return item.label===list[0].category.label})[0].icon}</div></Col>
            <Col>
            <Card.Title>{job.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{job.company.display_name}</Card.Subtitle></Col>
          </Row>
          <Row>
          <div className="post_date">Posted on {monthsStr[Number(job.created.slice(5,7))-1]} {job.created.slice(8,10)}</div>
          <Col xs={3}>
          <Card.Text className="salary">
            From {job.salary_min}$ a year
          </Card.Text></Col>
          <Card.Text className="description">
            {job.description}
          </Card.Text>
          </Row>
          <Row className="mt-2">
            <div className="buttons">
          <Button variant="success">Apply</Button>
          <div className="icons">
          <Card.Link ><FavoriteIcon style={{color:"red"}} onClick={()=>onSave(job.id)}/></Card.Link>
          <Card.Link href="#" className="m-0" ><BlockIcon onClick={()=>deleteJob(job.id)} className="text-success"/></Card.Link>
          </div>   
          </div></Row>
        </Card.Body>
      </Card>
      )    
})}
    </Row>
   {list.length !==0 && 
   (<div className="page">
   <ArrowBackIosIcon style={{visibility: page===1 ? "hidden" : "visible"}} onClick={onDecreasePage} />
   <p>{page}</p>
   <ArrowForwardIosIcon onClick={onIncreasePage} /></div>)} 
  </Container>
  )
}