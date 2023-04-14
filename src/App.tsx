import React from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { Signin} from "./components/Signin"
import {Home} from "./components/Home"
import { Signup } from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbarmodal } from './components/Navbar';
import { Saved } from './components/Saved';
import {Searchjob} from "./components/Search"
import { Profile } from './components/Profile';
import {RequireAuth} from "./components/Require"



function App() {

  return (
    <div className="App">
      <Navbarmodal/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/savedjobs" element={<RequireAuth><Saved/></RequireAuth>}/>
      <Route path="/recentsearch" element={<RequireAuth><Searchjob/></RequireAuth>}/>
      <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>}/>
     </Routes>
    </div>
  )
}

export default App;
