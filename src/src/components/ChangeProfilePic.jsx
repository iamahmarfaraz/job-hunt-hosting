import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export function ChangeProfilePic({ open, setOpen }) {
  const { loading } = useSelector((state) => state.auth);
  const [file, setFile] = useState("");
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }
    try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/profile/updatepfp`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        if (res.data.success) {
            dispatch(setUser(res.data.user));
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    } finally{
      dispatch(setLoading(false));
    }
    setOpen(false);
    
}

  const changeFileHandler = (e)=>{
    const fileUpload = e.target.files?.[0];
    setFile(fileUpload);
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div  className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Profile Picture</Label>
              <Input
                accept="image/*"
                onChange={changeFileHandler}
                type="file"
                name="file"
                className="cursor-pointer col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
              </Button>
            ) : (
              <Button type="submit" onClick={submitHandler} on className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
