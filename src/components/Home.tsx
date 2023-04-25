import "../styles/Home.sass"
import { Navigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useContext, useState,useEffect} from "react"
import { AuthContext } from '../AuthContext';
import {Container,Row,Form,Button,Stack, Spinner} from "react-bootstrap"
import {Job,Filter} from "../types"
import { SearchJob } from "../AuthContext";
import uuid from "react-uuid";
import { setDoc,getDoc,doc, updateDoc } from "firebase/firestore";
import {db} from "../firebase"
import { currentDate} from "../info";
import { JobCard } from "./JobCard";
import { FilterPart } from "./Filter";
import { SearchPart } from "./SearchPart";


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
const [spinner,setSpinner]=useState(false)



useEffect(()=>{
  const fetchApi= async ()=>{
    const res=await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${process.env.REACT_APP_ADMIN_ID}&app_key=${process.env.REACT_APP_API_KEY}&results_per_page=9&title_only=${job.title}&where=${job.location}${filter.posted}${filter.salary}${filter.employ}`,
      {
        method:"GET"
      });
      const data=await res.json();
      setList(data.results)
    }
    setSpinner(false)
    fetchApi()
},[filter,page])// eslint-disable-next-line

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
  setPage(1)
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
  if(state.userInfo.email !==""){
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const newSearchJobs=[...dbList!.search,searchObj]
    setDoc(userRef,{...dbList,search:newSearchJobs})
  }
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
    company:favJob!.company!.display_name,
    location:favJob!.location!.display_name,
    id:favJob!.id,
    savedDate:currentDate}
  const userRef=doc(db,"users",`${state.userInfo!.uid}`)
  const listRef=await getDoc(userRef)
  const dbList=listRef.data()
  const newList={...dbList}
  let oldJobIndex=newList.savedJobs.findIndex((job:any)=>job.id===favJob!.id)

  if(oldJobIndex === -1){
    const newSavedJobs=[...dbList!.savedJobs,saved]
    setDoc(userRef,{...dbList,savedJobs:newSavedJobs})
  } else{
    updateDoc(userRef,{...dbList})
  }
}
const deleteSavedJob=async(id:string)=>{
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const jobList=dbList!.savedJobs.filter((item:any)=>item.id!==id)
    setDoc(userRef,{...dbList,savedJobs:jobList})
}

const onApply=async(id:string)=>{
  const applied=list.find((item)=>item.id===id)
    const appliedJob={
      title:applied!.title,
      company:applied!.company.display_name,
      location:applied!.location.display_name,
      id:applied!.id,
      savedDate:currentDate}
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const newList={...dbList}
    let oldJobIndex=newList.applied.findIndex((job:any)=>job.id===applied!.id)
    if(oldJobIndex===-1){
      const newAppliedJobs=[...dbList!.applied,appliedJob]
      setDoc(userRef,{...dbList,applied:newAppliedJobs})
    } else {
      updateDoc(userRef,{...dbList})
    }  
}
const onSearch=async(id:string)=>{
  setSpinner(true)
  setSearch(true)
  const userRef=doc(db,"users",`${state.userInfo!.uid}`)
  const listRef=await getDoc(userRef)
  const dbList=listRef.data()
  const search=dbList!.search.find((item:any)=>item.id===id)
  setJob((pre)=>{
    return {title:search.title,location:search.location}
  })
  setFilter({
    posted:"",
    employ:"",
    salary:""
  })
  const searchObj = {
    title:search.title,
    location:search.location,
    id:uuid(),
    searchDate:currentDate
  }
  const newSearchJobs=[...dbList!.search,searchObj]
  setDoc(userRef,{...dbList,search:newSearchJobs})
 
}

  return (
    <Container >
     {signin && <Navigate to="/signin"/>}
    <Row className="mt-5 inputrow">
      <Stack direction="horizontal" gap={5}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>What </Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="Job title" name="title" value={job.title || ""} onChange={handleChange}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Where</Form.Label>
      <Form.Control className="me-auto" type="text" placeholder="United States" name="location" value={job.location || ""} onChange={handleChange}/>
    </Form.Group>
    <Button className="searchbtn" variant="success" onClick={()=>handleClick(job)}>
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
  {spinner ? <Spinner animation="border" variant="success"/> : <div className="no_found mt-5">*No found jobs, try again</div>}</>
   : <><Row className="mb-3">
   <FilterPart handleDetail={handleDetail} filter={filter}/>
</Row>
   <Row className="jobs">
    {list.map((job:Job,key:number)=>{
      return (
        <JobCard
          key={job.id}
          job={job}
          onSave={onSave}
          deleteJob={deleteJob}
          onApply={onApply}
          deleteSavedJob={deleteSavedJob}
          />
           )    
    })}
    </Row></>
    : list.length ===0 && <div className="scroll-container"><p className="scroll-text">Find your job, let's go!</p></div>}
     {!search && state.userInfo.email !=="" && <SearchPart handleClick={onSearch}/>}  
   {list.length !==0 && 
   (<div className="page">
   <ArrowBackIosIcon style={{visibility: page===1 ? "hidden" : "visible"}} onClick={onDecreasePage} />
   <p>{page}</p>
   <ArrowForwardIosIcon style={{visibility: list.length<9 ? "hidden" : "visible"}}  onClick={onIncreasePage} /></div>)}
  </Container>
  )
}