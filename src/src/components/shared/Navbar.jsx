import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import { Link } from 'react-router-dom'
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        {/* left part */}
        <div onClick={() => navigate("/")} className="cursor-default">
          <h1 className="text-2xl font-bold text-richblack-700">
            Job
            <span className="  bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 ">
              Hunt
            </span>
          </h1>
        </div>

        {/* Right Part */}
        <div className="flex items-center gap-12">
          {/* Links */}
          <ul className="flex font-medium items-center gap-5">
            <li className="hover:text-red-600">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="hover:text-red-600">
              <Link to={"/jobs"}>Job</Link>
            </li>
            <li className="hover:text-red-600">
              <Link to={"/browse"}>Browse</Link>
            </li>
          </ul>

          {!user ? (
            <div className="flex gap-3 items-center">
              <Link to="/login">
                <button className="px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="relative px-4 py-2 rounded-xl border border-neutral-100 text-gray-100 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 group hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transition duration-200">
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            <div>
              {/* Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-80">
                  <div>
                    <div className="flex items-center gap-4">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Ahmar Faraz</h4>
                        <p className="text-sm text-gray-500">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-600 flex flex-col my-2 mx-2">
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">View Profile</Button>
                      </div>
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button onClick={logoutHandler} variant="link">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
