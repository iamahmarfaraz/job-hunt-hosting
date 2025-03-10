import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import "./auth.css";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

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
    const toastId = toast.loading("Loading...");
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("ERROR WHILE SIGNUP API CALL :- ", error);
      toast.error(
        error?.response?.data?.message || "Failed to signup. Please try again."
      );
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className=" min-w-full min-h-screen flex flex-col">
      <div className="w-full h-16 bg-slate-300 shadow-2xl">
        <Navbar />
      </div>

      {/* Centered Form */}
      <div className="flex items-start pt-10 px-4 md:px-0 justify-center  container-auth mx-auto w-full min-h-screen">
        <form
          onSubmit={submitHandler}
          className="w-full md:w-2/3 lg:w-1/2 border border-gray-300 rounded-md p-6 my-10 bg-white shadow-lg flex flex-col gap-4"
        >
          <h1 className="font-bold text-xl mb-5 text-center">Sign Up</h1>

          <div>
            <Label>
              Full Name <sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Full Name"
              className="w-full"
            />
          </div>

          <div>
            <Label>
              Email <sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="xyz@abc.com"
              className="w-full"
            />
          </div>

          <div>
            <Label>
              Phone Number <sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="8609812654"
              className="w-full"
            />
          </div>

          <div>
            <Label>
              Password <sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="*********"
              className="w-full"
            />
          </div>

          {/* Role Selection & File Upload */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Role Selection */}
            <div className="flex flex-col sm:w-1/2">
              <Label>Role</Label>
              <RadioGroup className="flex items-center gap-4 mt-1">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Label>Student</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Label>Recruiter</Label>
                </div>
              </RadioGroup>
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
          </div>

          {/* Signup Button */}
          {loading ? (
            <Button className="w-full mt-4 -mb-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-4 -mb-2">
              Signup
            </Button>
          )}

          {/* Login Redirect */}
          <span className="text-gray-700 text-sm text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
