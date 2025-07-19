import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'
import Donors from './components/Donors/Donors';
import Category from './components/Category/Category';
import PageNotFound from './components/PageNotFound/PageNotFound';
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<div>Welcome to Admin Dashboard</div>} />
          <Route path="donors" element={<Donors />} />
          {/* <Route path="donations" element={<Donations />} /> */}
          <Route path="category" element={<Category />} />
      </Route>
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </>
  )
}

export default App
