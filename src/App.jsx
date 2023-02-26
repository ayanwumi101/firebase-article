import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Profile from './components/Profile'
import Signup from './components/Signup'


function App() {
  
  return (
    <Box>
      <Router>
        <Routes>
          <Route exact path='/' element={<Navigate replace to='/login' />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </Box>
  )
}

export default App
