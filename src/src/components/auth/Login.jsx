import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToken, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import useLogout from "@/hooks/useLogout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const logoutHandler = useLogout();
  const {user} = useSelector(state=>state.auth);

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    

    const toastId = toast.loading("Loading...");
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - Date.now();

      dispatch(setToken(token));
      dispatch(setUser(res.data.user));

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      

      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.user.role === "student") {
          navigate("/jobs");
        }
        else{
          navigate("/admin/companies");
        }
      } else {
        toast.error(res.data.message || "Something went wrong");
      }

      setTimeout(() => {
        logoutHandler();
        const toastSes = toast.error("Session expired. Please log in again.");
        alert("Session expired. Please log in again.");
        navigate("/login");
        toast.dismiss(toastSes);
      }, expirationTime);
    } catch (error) {
      console.log("ERROR WHILE LOGIN API CALL :- ", error);
      toast.error(
        error?.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-screen px-0 min-h-screen flex flex-col items-center mt-16 container-auth">
      <Navbar />
      {/* Push content down to avoid overlapping with navbar */}
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 mt-24">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Log in</h1>

          {/* Email Input */}
          <div className="mb-4">
            <Label>
              Enter Your Email<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@domain.com"
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <Label>
              Enter Your Password<sup className="text-red-500">*</sup>
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

          {/* Role Selection */}
<div className="mb-4 w-full">
  <Label className="block mb-2">Select Your Role:</Label>
  <RadioGroup className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full">
    {/* Student Role */}
    <label className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
      <Input
        type="radio"
        name="role"
        value="student"
        checked={input.role === "student"}
        onChange={changeEventHandler}
        className="w-4 h-4 cursor-pointer"
      />
      <span className="text-sm sm:text-base">Student</span>
    </label>

    {/* Recruiter Role */}
    <label className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
      <Input
        type="radio"
        name="role"
        value="recruiter"
        checked={input.role === "recruiter"}
        onChange={changeEventHandler}
        className="w-4 h-4 cursor-pointer"
      />
      <span className="text-sm sm:text-base">Recruiter</span>
    </label>
  </RadioGroup>
</div>

          {/* Submit Button */}
          <div className="mb-4">
            {loading ? (
              <Button className="w-full flex justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Login
              </Button>
            )}
          </div>

          {/* Signup Link */}
          <div className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
