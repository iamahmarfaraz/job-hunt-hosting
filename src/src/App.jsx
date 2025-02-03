import React from "react";
import './App.css'
import { useState } from "react";
import Navbar from "./components/shared/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";

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
    element:<Jobs></Jobs>
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
