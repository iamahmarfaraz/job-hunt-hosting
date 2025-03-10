import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setSearchedQuery } from "@/redux/jobSlice";
import useLogout from "@/hooks/useLogout";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const logoutHandler = useLogout();

  return (
    <div className="w-full absolute top-0 left-0 border-b-[1px] shadow-md z-[50] bg-no-repeat bg-gradient-to-r from-purple-200 via-violet-200 to-pink-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-16 px-4">
        {/* Left Side - Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-bold text-gray-900">
            Job
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Hunt
            </span>
          </h1>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden focus:outline-none"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Links */}
        <div
          className={`lg:flex lg:items-center lg:gap-12 ${
            menuOpen
              ? "absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-4"
              : "hidden"
          }`}
        >
          <ul className="flex flex-col lg:flex-row items-center font-medium gap-6 lg:gap-5">
            <li className="hover:text-red-600">
              <Link to={"/"}>Home</Link>
            </li>

            {(!user || user?.role !== "recruiter") && (
              <li className="hover:text-red-600">
                <Link to={"/jobs"}>Job</Link>
              </li>
            )}

            <li className="hover:text-red-600">
              <Link to={"/browse"}>Browse</Link>
            </li>
            {user && user.role === "recruiter" && (
              <>
                <li className="hover:text-red-600">
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className="hover:text-red-600">
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            )}
          </ul>

          {/* Authentication & Profile Section */}
          {!user ? (
            <div className="flex flex-col lg:flex-row gap-3 items-center">
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
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="User Profile"
                    className="object-fill"
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-80">
                <div>
                  <div className="flex items-center gap-4">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={
                          user?.profile?.profilePhoto ||
                          "https://github.com/shadcn.png"
                        }
                        alt="User Profile"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="text-gray-600 flex flex-col my-2 mx-2">
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to={"/profile"}>View Profile</Link>
                      </Button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
