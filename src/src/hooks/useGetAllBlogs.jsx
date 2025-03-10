import { BLOG_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";

export const getAllBlogs = async () => {  
    try {
        const res = await axios.get(`${BLOG_API_END_POINT}/allBlog`, { withCredentials: true });

        if (!res.data.success) {
            throw new Error(res.data.message);
            
        } 
        return res.data.blogs; 
    } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch blogs.");
        return []; //
    }     
};
