import {Container,Row} from "react-bootstrap"
import "../styles/Savedjobs.sass"
import React, { useContext, useEffect, useState } from "react"
import {GizemCard } from "./SavedCard";
import { SavedJob} from "../types";
import { setDoc,getDoc,doc, onSnapshot,updateDoc } from "firebase/firestore";
import {db} from "../firebase"
import { AuthContext } from "../AuthContext";
import { currentDate} from "../info";


export const Saved=()=>{
  const [saveList,setSaveList]=useState<SavedJob[]>([])
  const {state}=useContext(AuthContext)

  useEffect(()=>{
    if(state.userInfo.email !==""){
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const unSubscribe=onSnapshot(userRef,(doc)=>{
      const dbList=doc.data()
      const list=dbList!.savedJobs
      setSaveList(list)
    })
  }},[state.userInfo])
  
  const deleteJob=async(id:string)=>{
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const job=dbList!.savedJobs.filter((item:any)=>item.id!==id)
    setDoc(userRef,{...dbList,savedJobs:job})
  }

 const onApply=async(id:string)=>{
  const applied=saveList.find((item)=>item.id===id)
    const appliedJob={
      title:applied!.title,
      company:applied!.company,
      location:applied!.location,
      id:applied!.id,
      savedDate:currentDate}
     
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    const listRef=await getDoc(userRef)
    const dbList=listRef.data()
    const newList={...dbList}
    let oldJobIndex=newList.applied.findIndex((job:any)=>job.id===applied!.id)
    if(oldJobIndex===-1){
      const newAppliedJobs=[...dbList!.applied,appliedJob]
      console.log(newAppliedJobs)
      updateDoc(userRef,{...dbList,applied:newAppliedJobs})
    } else {
      updateDoc(userRef,{...dbList})
    }  
 }
  return(<>
    <Container className="mt-5 container" >
      <h1>My jobs</h1>
      <hr></hr>
      {saveList.length===0 && <div>There are no saved jobs</div>}
      <Row className="jobs">
    {saveList.map((job:SavedJob)=>{
      return( <>
        <GizemCard
          job={job}
          deleteJob={deleteJob}
          onApply={onApply}
          />
       </> )    
    })}
    </Row>
    </Container>
    </>)
}