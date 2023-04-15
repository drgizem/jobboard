import "../styles/Home.sass"
import { Navigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useContext, useState,useEffect} from "react"
import { AuthContext } from '../AuthContext';
import {Container,Row,Form,Button,Stack} from "react-bootstrap"
import {Job,Filter} from "../types"
import { SearchJob } from "../AuthContext";
import uuid from "react-uuid";
import { setDoc,getDoc,doc, updateDoc } from "firebase/firestore";
import {db,auth} from "../firebase"
import { currentDate} from "../info";
import { JobCard } from "./JobCard";
import { FilterPart } from "./Filter";

export const Home=()=>{
const [list,setList]=useState<Job[]>([])
const {state,dispatch}=useContext(AuthContext)
const [job,setJob]=useState<SearchJob>({} as SearchJob)
const [page,setPage]=useState<number>(1)
const [signin,setSignin]=useState<boolean>(false)
const [filter,setFilter]=useState<Filter>({
  salary:"",
  posted:"",
  employ:""
})
const [search,setSearch]=useState<boolean>(false)

useEffect(()=>{
  const fetchApi= async ()=>{
    const res=await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=f56bbe74&app_key=b8dde6bfd2f9c162d16ae945cafec698&results_per_page=9&title_only=${job.title}&where=${job.location}${filter.posted}${filter.salary}${filter.employ}`,
      {
        method:"GET"
      });
      const data=await res.json();
      setList(data.results)
  }
  fetchApi()// eslint-disable-next-line
},[filter,page])

const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
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
const handleDetail=(e:React.ChangeEvent<HTMLSelectElement>)=>{
  const {name,value}=e.target
  setFilter((pre)=>{
    return {...pre,[name]:value}
  })
}
const handleClick=async(job:SearchJob)=>{
  setFilter({
    posted:"",
    employ:"",
    salary:""
  })
  const searchObj = {
    title:job.title,
    location:job.location,
    id:uuid(),
    searchDate:currentDate
  }
  const userRef=doc(db,"users",`${auth.currentUser!.uid}`)
  const listRef=await getDoc(userRef)
  const dbList=listRef.data()
  const newSearchJobs=[...dbList!.search,searchObj]
  setDoc(userRef,{...dbList,search:newSearchJobs})

  setSearch(true)
  dispatch({
      type:"search",payload:job
    })
}

const onSave=async(id:string)=>{
  state.userInfo.email ==="" && setSignin(true)
  const favJob=list.find(item=>item.id===id)
  const saved={
    title:favJob!.title,
    company:favJob!.company.display_name,
    location:favJob!.location.display_name,
    id:favJob!.id,
    savedDate:currentDate}
  const userRef=doc(db,"users",`${auth.currentUser!.uid}`)
  const listRef=await getDoc(userRef)
  const dbList=listRef.data()
  const newList={...dbList!}
  let oldJobIndex=newList.savedJobs.findIndex((job:any)=>job.id===favJob!.id)

  if(oldJobIndex === -1){
    const newSavedJobs=[...dbList!.savedJobs,saved]
    setDoc(userRef,{...dbList,savedJobs:newSavedJobs})
  } else{
    updateDoc(userRef,{...dbList})
  }
  
}
console.log(state.job)
console.log(list)
  return (
    <Container >
     {signin && <Navigate to="/signin"/>}
    <Row className="mt-5">
      <Stack direction="horizontal" gap={5}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>What </Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="Job title" name="title" value={job.title || state.job.title} onChange={handleChange}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Where</Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="United States" name="location" value={job.location || state.job.location} onChange={handleChange}/>
    </Form.Group>
    <Button variant="success" onClick={()=>handleClick(job)}>
      Search
    </Button>
    </Stack>
    </Row>
    <hr></hr>
    {search ? 
        list.length===0 ? 
        <>
    <Row className="mb-3">
      <FilterPart handleDetail={handleDetail} filter={filter}/>
  </Row>
  <div className="no_found mt-5">*No found jobs, try again</div> </>
   : <><Row className="mb-3">
   <FilterPart handleDetail={handleDetail} filter={filter}/>
</Row>
   <Row className="jobs">
    {list.map((job:Job,key:number)=>{
      return (<>
        <JobCard
          key={job.id}
          job={job}
          onSave={onSave}
          deleteJob={deleteJob}
          />
          </> )    
    })}
    </Row></>
    : list.length ===0 && <div className="scroll-container"><p className="scroll-text">Find your job, let's go!</p></div>}
   {list.length !==0 && 
   (<div className="page">
   <ArrowBackIosIcon style={{visibility: page===1 ? "hidden" : "visible"}} onClick={onDecreasePage} />
   <p>{page}</p>
   {list.length>page*9 && <ArrowForwardIosIcon onClick={onIncreasePage} />}</div>)} 
  </Container>
  )
}