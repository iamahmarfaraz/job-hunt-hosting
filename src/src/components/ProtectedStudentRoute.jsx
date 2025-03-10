import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProtectedStudentRoute = ({children}) => {

    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if(user && user.role === 'recruiter'){
        navigate("/");
        toast.error("Page Only Student")
        return;
      }
    }, [])
    

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedStudentRoute