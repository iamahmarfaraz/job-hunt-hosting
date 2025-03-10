import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./shared/Navbar";
import "./Browse.css";
import { getAllBlogs } from "@/hooks/useGetAllBlogs";
import { BrowseCards } from "./BrowseCards";
import ColourfulText from "./ui/colourful-text";
import { DialogBlog } from "./shared/BlogUploadAndUpdate";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BLOG_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Browse = () => {
  // State to store all blogs
  const [blogs, setBlogs] = useState([]);
  // State to store the current page number
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 7; // Show 7 blogs per page
  const [topContributors, setTopContributors] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
//   const [changeDetector,setChangeDetector] = useState(false);
  const {changeDetector} = useSelector(state => state.auth)

  const writingTips = [
    "📌 Write compelling headlines!",
    "🖼️ Use images and bullet points for clarity.",
    "📖 Keep paragraphs short and readable.",
    "🎭 Use storytelling to engage readers.",
    "🎣 Start with a strong hook in the introduction.",
    "📑 Make your blog scannable with subheadings.",
    "✅ Include a clear call-to-action at the end.",
    "🔍 Use real examples to make your points stronger.",
    "🔎 Optimize for SEO (use keywords naturally).",
    "✍️ Proofread & edit before publishing!",
  ];

  // Fetch blogs and top contributors once on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getAllBlogs();
        // Sort blogs in descending order (latest first)
        const sortedBlogs = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
        setCurrentPage(1); // Reset to page 1 after fetching
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
    dispatch(setLoading(false));

    const getTopContributors = async () => {
      try {
        const res = await axios.get(`${BLOG_API_END_POINT}/top-contributors`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setTopContributors(res.data.topContributors);
        }
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      }
    };
    getTopContributors();
  }, [changeDetector]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Get the current page blogs via a memoized slice of the blogs array
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    return blogs.slice(startIndex, startIndex + blogsPerPage);
  }, [blogs, currentPage]);

  // Generate a sliding window of page numbers
  const pageNumbers = useMemo(() => {
    let startPage = Math.max(currentPage - 1, 1); // Ensure at least page 1 is visible
    let endPage = Math.min(startPage + 2, totalPages); // Show at most 3 pages
    if (endPage - startPage < 2 && startPage > 1) {
      startPage = Math.max(endPage - 2, 1); // Adjust for edge cases
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Navigation Functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="h-16 bg-red-300 shadow-2xl">
        <Navbar />
      </div>
      {/* Main Container */}
      <div className="container-browse min-h-[93vh] p-4">
        <div>
          <div className="text-4xl font-bold flex justify-center pt-8 pb-2">
            <ColourfulText text={"Short Blogs"} />
          </div>
          {/* Use flex-col on mobile and flex-row on medium and up */}
          <div className="flex flex-col md:flex-row gap-4 w-full mx-auto">
            {/* Left Sidebar: Adjust responsive width */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4">
              <DialogBlog work={"upload"} />
              <div className="w-full mt-4 p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-lg font-bold mb-3">🏆 Top Contributors</h3>
                {topContributors.length > 0 ? (
                  topContributors.map((user, index) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 border-b last:border-b-0"
                    >
                      <span className="font-bold text-xl text-gray-700">
                        #{index + 1}
                      </span>
                      <img
                        src={user.avatar}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="User Avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.postCount} Blogs · {user.totalLikes} Likes
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No contributors yet.</p>
                )}
              </div>
            </div>
            {/* Center Column */}
            <div className="flex-1 lg:ml-14">
              {loading ? (
                <p className="flex items-center justify-center">Loading...</p>
              ) : (
                <BrowseCards cards={paginatedBlogs} />
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {currentPage > 2 && (
                    <>
                      <Button
                        onClick={() => setCurrentPage(1)}
                        className={`rounded-full w-8 h-8 flex items-center justify-center ${
                          currentPage === 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        1
                      </Button>
                      {currentPage > 3 && <span className="px-2">...</span>}
                    </>
                  )}
                  {pageNumbers.map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-full w-8 h-8 flex items-center justify-center ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`rounded-full w-8 h-8 flex items-center justify-center ${
                          currentPage === totalPages
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Right Sidebar */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 lg:mr-4 h-fit bg-blue-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-blue-600 text-center mb-3">
                📖 Blog Writing Tips
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {writingTips.map((tip, index) => (
                  <li key={index} className="text-sm">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
