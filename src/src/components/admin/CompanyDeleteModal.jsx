import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setCompanies } from "@/redux/companySlice";

const CompanyDeleteModal = ({ open, setOpen,compId }) => {
     const {loading} = useSelector((state) => state.auth);
     const dispatch = useDispatch();
     const navigate = useNavigate();

    const deleteHandler = async() => {
        dispatch(setLoading(true));
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/company/${compId}`,{
                withCredentials:true
            });

            if(res.data.success){
                toast.success(res.data.message);
                setOpen(false);
                dispatch(setCompanies(res?.data?.companies));
                // navigate("/admin/companies");
            }
        } catch (error) {
            console.log("DELETE COMPANY API ERROR :- ",error);
            toast.error(error.response.data.message);
        }finally{
            dispatch(setLoading(false));
        }
    }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="bg-red-700 border-red-900">
          <DialogHeader>
            <DialogTitle className="text-slate-300">Update Profile</DialogTitle>
            <DialogDescription className="text-slate-300">
              Do you really want to delete this company? Deleting may erase all
              the jobs and applications associated to it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 items-center">
            {loading ? (
              <Button className="w-fit bg-red-500 border-gray-400 hover:bg-red-600">
                {" "}
                <Loader2 className=" h-4 w-4 animate-spin" /> Please wait{" "}
              </Button>
            ) : (
              <Button type="submit" className="w-fit bg-red-500 border-gray-400 hover:bg-red-600" onClick={deleteHandler}>
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)} className="w-fit bg-slate-200 border-slate-200">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDeleteModal;
