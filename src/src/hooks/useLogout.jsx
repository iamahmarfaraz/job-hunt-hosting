import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "@/redux/authSlice";
import { setSearchedQuery } from "@/redux/jobSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        dispatch(setSearchedQuery(""));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return logoutHandler; // Return the function
};

export default useLogout;
