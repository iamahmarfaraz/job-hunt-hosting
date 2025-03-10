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
import { setChangeDetector } from "@/redux/authSlice";
import { BLOG_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { PenToolIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function DialogBlog({ work, setIsDialogOpen, blogId }) {
  const [input, setInput] = useState({
    title: "",
    content: "",
    file: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading");
    if (work === "upload") {
      if (!input.title || !input.content || !input.file) {
        toast.error("All Fields are Mandatory");
        toast.dismiss(toastId);
        return;
      }
      const formData = new FormData();
      formData.append("title", input.title);
      formData.append("content", input.content);
      formData.append("file", input.file);

      try {
        const res = await axios.post(
          `${BLOG_API_END_POINT}/createBlog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      } catch (error) {
        console.log("ERROR WHILE UPLOAD BLOG API CALL :- ", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to Upload. Please try again."
        );
      }
    } else {
      const formData = new FormData();
      if (input.title) formData.append("title", input.title);
      if (input.content) formData.append("content", input.content);
      if (input.file) formData.append("file", input.file);
      formData.append("blogId", blogId);

      try {
        const res = await axios.put(
          `${BLOG_API_END_POINT}/updateBlog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      } catch (error) {
        console.log("ERROR WHILE UPDATE BLOG API CALL :- ", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to Update. Please try again."
        );
      }
    }
    toast.dismiss(toastId);
    setIsOpen(false);
    setIsDialogOpen(false);
    dispatch(setChangeDetector());
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        setIsDialogOpen(state); // ✅ Track if Dialog is open
      }}
    >
      <DialogTrigger asChild>
        {work === "upload" ? (
          <Button variant="outline">Upload Your Blog</Button>
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400">
            <PenToolIcon size={24}></PenToolIcon>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {work === "upload" ? (
            <DialogTitle>New Blog</DialogTitle>
          ) : (
            <DialogTitle>Edit Blog</DialogTitle>
          )}

          {work === "upload" ? (
            <DialogDescription>
              Upload your profile here. Click save when you're done.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Make changes to your Blog here. Click save when you're done.
            </DialogDescription>
          )}
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={submitHandler}>
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              className="flex-1"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="username" className="">
              Content
            </Label>
            <textarea
              id="content"
              type="text"
              name="content"
              value={input.content}
              onChange={changeEventHandler}
              maxLength={700}
              className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            <p className="text-sm text-muted-foreground -mt-3">
              Content Should be under 700 words
            </p>
          </div>
          {/* File Upload */}
          <div className="flex flex-col sm:w-1/2">
            <Label>Profile Picture</Label>
            <Input
              accept="image/*"
              onChange={changeFileHandler}
              type="file"
              className="cursor-pointer"
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" onClick={(e) => submitHandler(e)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
