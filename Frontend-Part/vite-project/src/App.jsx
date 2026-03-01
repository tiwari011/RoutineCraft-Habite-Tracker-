import { useState } from 'react'
import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Lifestyleselection from './Components/Lifestyleselection'
import Myday from './Components/Myday';
import PrivateRoute from "./Components/PrivateRoute";
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
function App() {

  return (
    <>
   
 <BrowserRouter>
     <Routes>
           {/* Default route */}
      <Route path="/" element={<Navigate to="/login"/>}/>
            {/* Public Routes */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>


      
        {/* Private Route */}
        <Route
          path="/lifestyleselection"
          element={
            <PrivateRoute>
              <Lifestyleselection />
            </PrivateRoute>

          }
        />
         {/*  THIS WAS MISSING */}
          <Route path="/myday" element={
            <PrivateRoute>
              <Myday />
            </PrivateRoute>
          } />

        {/* Fallback route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
     </Routes>
  </BrowserRouter>
  
     
    </>
  )
}

export default App
