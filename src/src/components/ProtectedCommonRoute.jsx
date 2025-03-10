import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProtectedCommonRoute = ({children}) => {

    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if(!user){
        navigate("/login");
        toast.error("Login to access Page")
        return;
      }
    }, [])
    

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedCommonRoute
