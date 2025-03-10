import React from "react";
import './App.css'
import { useState } from "react";
import Navbar from "./components/shared/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";
import ProtectedCommonRoute from "./components/ProtectedCommonRoute";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import AdminJobs from "./components/admin/AdminJobs";
import Applicants from "./components/admin/Applicants";
import PostJob from "./components/admin/PostJob";
import UpdateJob from "./components/admin/UpdateJob";


const appRoute = createBrowserRouter([
  {
    path: '/',
    element:<Home></Home>
  },
  {
    path: '/login',
    element:<Login></Login>
  }, 
  {
    path: '/signup',
    element:<Signup></Signup>
  },
  {
    path: '/jobs',
    element:<ProtectedStudentRoute><Jobs></Jobs></ProtectedStudentRoute>
  },
  {
    path: '/browse',
    element:<ProtectedCommonRoute><Browse></Browse></ProtectedCommonRoute>
  },
  {
    path: '/profile',
    element:<ProtectedCommonRoute><Profile/></ProtectedCommonRoute>
  },
  {
    path: "/description/:id",
    element: <ProtectedCommonRoute><JobDescription /></ProtectedCommonRoute>
  },
  // Recruiters routes
  {
    path:"/admin/companies",
    element: <ProtectedAdminRoute><Companies/></ProtectedAdminRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedAdminRoute><CompanyCreate/></ProtectedAdminRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedAdminRoute><CompanySetup/></ProtectedAdminRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedAdminRoute><AdminJobs/></ProtectedAdminRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedAdminRoute><Applicants/></ProtectedAdminRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedAdminRoute><PostJob/></ProtectedAdminRoute> 
  },
  {
    path:"/admin/jobs/update/:id",
    element:<ProtectedAdminRoute><UpdateJob/></ProtectedAdminRoute> 
  },
])

function App() {

  return (
    <div>
      <RouterProvider router = {appRoute}/>
    </div>
  );
}

export default App;
