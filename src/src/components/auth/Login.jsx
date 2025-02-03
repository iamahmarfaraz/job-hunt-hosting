import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import "./auth.css";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToken, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

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
    console.log("LOGIN FORM INPUT FROM FRONTEND :- ", input);

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

      // Token handling and storage
      const token = res.data.token;
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - Date.now()

      // Dispatch token and user information to Redux
      dispatch(setToken(token));
      dispatch(setUser(res.data.user));

      // Save user data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      console.log("LOGIN API RESPONSE :- ", res);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/jobs");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
      // Set a timeout to log the user out automatically when the token expires
      setTimeout(() => {
        
        dispatch(logout(navigate));
        const toastSes = toast.error("Session expired. Please log in again.")
        alert("Session expired. Please log in again.");
        
        navigate("/login");
        toast.dismiss(toastSes);
      }, expirationTime);
    } catch (error) {
      console.log("ERROR WHILE LOGIN API CALL :- ", error);

      // Handle error and show toast
      toast.error(
        error?.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      // Dismiss the loading toast in all cases
      toast.dismiss(toastId);

      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container min-w-full min-h-[100vh]">
      <Navbar></Navbar>

      <div className="flex items-center max-w-7xl justify-center mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-300 rounded-md p-4 my-10 form-container flex flex-col gap-4"
        >
          <h1 className="font-bold text-xl mb-5">Log in </h1>

          <div>
            <Label>
              Enter Your Email<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="FullName@abc.com"
            />
          </div>

          <div>
            <Label>
              Enter Your Password<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="*********"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup
              defaultValue="comfortable"
              className="flex items-center gap-[4.2rem] my-2 mx-2"
            >
              <div className="flex items-center -space-x-3 ">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>

              <div className="flex items-center -space-x-3">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full -mb-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button type="submit" className="w-full -mb-2">
              Login
            </Button>
          )}
          <span className="text-gray-700 ml-1 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Sign up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
