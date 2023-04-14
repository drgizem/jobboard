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


function App() {
  return (
    <div className="App">
      <Navbarmodal/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/savedjobs" element={<Saved/>}/>
      <Route path="/recentsearch" element={<Searchjob/>}/>
      <Route path="/profile" element={<Profile/>}/>
     </Routes>
    </div>
  )
}

export default App;
