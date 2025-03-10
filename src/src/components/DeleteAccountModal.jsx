import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import { setSearchedQuery } from "@/redux/jobSlice";
import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = () => {
    const dispatch = useDispatch();
    const logout = useLogout();
    const navigate = useNavigate();
  const submitHandler = async (e) => {
    const toastId = toast.loading("Deleting Your Account...");
    let flag = false;
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/delete-account`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        dispatch(setSearchedQuery(""));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        flag = true;
        navigate("/");
      }
    } catch (error) {
        console.error("Logout Error:", error);
        
    } finally {
        toast.dismiss(toastId);
        if(flag){
            toast.success("Account Deleted Successfully");
        }
        else{
            toast.error("Failed to logout. Please try again.");
        }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-red-400 border-red-700">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-red-500 border-red-900">
        <DialogHeader>
          <DialogTitle className="text-slate-300">
            Would you like to delete account?
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            This account may contain crucial data. Deleting your account is
            permanent and will remove all the contain associated with it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={(e) => submitHandler(e)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
