import React from 'react'
import "./App.css"
import Home from './pages/Home'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Detail from './pages/Detail'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/pokemon/:id' element={<Detail/>}/>
      </Routes>
    </Router>
  )
}

export default App