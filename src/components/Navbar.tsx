import { Container, Navbar ,Dropdown} from "react-bootstrap"
import clover from "../clover.png"
import {Link} from "react-router-dom"
import "../styles/Navbar.sass"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import Person2Icon from '@mui/icons-material/Person2';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {auth} from "../firebase"
import { signOut } from "firebase/auth"


export const Navbarmodal=()=>{
  const {state,dispatch}=useContext(AuthContext)

  const onSignOut=()=>{
    signOut(auth)
    .then(()=>{
      dispatch({
        type:"logout"
      })
    })
    localStorage.setItem("user","")
  }

  return(
    <Navbar expand="lg" bg="dark" variant="dark" className='navbar'>
      <Container>
        <Navbar.Brand><Link to="/"><img className="icon" src={clover} alt=""/></Link></Navbar.Brand>
        {state.userInfo.email==="" ? <Link to='/signin' className="signin">Sign in</Link>
            : (
              <Dropdown drop="start">
                <Dropdown.Toggle className="bg-dark" style={{border:"none"}} id="dropdown-basic">
                 <Person2Icon/>
               </Dropdown.Toggle>
                <Dropdown.Menu >
                <Dropdown.Item className="dropdown_text">{state.userInfo.email}</Dropdown.Item>
                 <Link to="/profile" className="dropdown_saved"><AssignmentIndIcon className="text-secondary"/>Profile</Link><br></br>
                 <Link to="/recentsearch" className="dropdown_saved"><SearchIcon/>Recent Searches</Link><br></br>
                 <Link to="/savedjobs" className="dropdown_saved"><FavoriteIcon className="text-success"/> Saved jobs</Link>
                 <Dropdown.Item href="/" className="dropdown_text" onClick={onSignOut}>Sign out</Dropdown.Item>
               </Dropdown.Menu>
             </Dropdown>)  }
      </Container>
    </Navbar>
  )
}