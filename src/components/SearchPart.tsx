import {useState,useEffect, useContext } from "react"
import "../styles/Search.sass"
import { Container,Card } from "react-bootstrap"
import {Search} from "../types"
import "../styles/Search.sass"
import ClearIcon from '@mui/icons-material/Clear';
import { setDoc,getDoc,doc, onSnapshot } from "firebase/firestore";
import {db} from "../firebase"
import { AuthContext } from "../AuthContext";

type Props={
  handleClick(id:string):void
}
export const SearchPart=({handleClick}:Props)=>{
    const [list,setList]=useState<Search[]>([])
    const {state}=useContext(AuthContext)
    const userRef=doc(db,"users",`${state.userInfo!.uid}`)
    useEffect(()=>{
      if(state.userInfo.email !==""){
        const unSubscribe=onSnapshot(userRef,(doc)=>{
          const dbList=doc.data()
          const list=dbList!.search
          setList(list)
        })
        return ()=>{
          unSubscribe()
      }
      }// eslint-disable-next-line
    },[])
    const deleteSearch=async(id:string)=>{
      const listRef=await getDoc(userRef)
      const dbList=listRef.data()
      const job=dbList!.search.filter((item:any)=>item.id!==id)
      setDoc(userRef,{...dbList,search:job})
    }
  return (<>
  <Container>
   <h2 className="mt-5">My Recent Searches</h2>
      <hr></hr>
   {list && list.map((job:Search,key:number)=>{
        return (<><Card className="mb-3">
          <Card.Body onClick={()=>handleClick(job.id)}  style={{display:"flex",justifyContent:"start",alignItems:"center"}}>
          <div><p>{job.title}</p>
          <Card.Subtitle>in {job.location}</Card.Subtitle></div>
          <p className="search_date mt-3 mx-5">Searched in {job.searchDate}</p>
          </Card.Body>    
          <ClearIcon className="mx-3" onClick={()=>deleteSearch(job.id)}/>   
        </Card>
        </>)
      })}
      {list.length ===0 && <p className="nosearch">* There are no searched before</p>}
      </Container>
  </>
  )
    }