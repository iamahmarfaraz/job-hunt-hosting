"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Delete,
  DeleteIcon,
  HeartIcon,
  LucideDelete,
  PenToolIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BLOG_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { DialogBlog } from "./shared/BlogUploadAndUpdate";
import { setChangeDetector } from "@/redux/authSlice";

export function BrowseCards({ cards}) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {loading} = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    if (active && Array.isArray(active.liked_by) && user) {
      setIsLiked(active.liked_by.includes(user._id));
    }
  }, [active, user]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    if (!isDialogOpen) {  // Only close if the dialog is NOT open
      setActive(null);
    }
  });

  const likeHandler = async () => {
    if (!isLiked) {
      try {
        const res = await axios.post(
          `${BLOG_API_END_POINT}/likeBlog`,
          { blogId: active._id },
          { withCredentials: true }
        );


        if (res.data.success) {
          // Update `active.liked_by`
          setActive((prev) => ({
            ...prev,
            liked_by: [...prev.liked_by, user._id], // Add user ID
          }));
          // Toggle the like state
          setIsLiked(!isLiked);
          dispatch(setChangeDetector());
          toast.success("Post Liked");
        }
      } catch (error) {
        console.log("ERROR IN LIKE API :- ", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } else {
      try {
        const res = await axios.post(
          `${BLOG_API_END_POINT}/unlikeBlog`,
          { blogId: active._id },
          { withCredentials: true }
        );



        if (res.data.success) {
          setActive((prev) => ({
            ...prev,
            liked_by: prev.liked_by.filter((id) => id !== user._id), // Remove user ID
          }));
          //  Toggle the like state after API call
          setIsLiked(!isLiked);
          dispatch(setChangeDetector());
          toast.success("Post Unliked");
        }
      } catch (error) {
        console.log("ERROR IN UNLIKE API :- ",error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  };

  const deleteHandler = async() => {
    try {
        const res = await axios.delete(
            `${BLOG_API_END_POINT}/deleteBlog?blogId=${active._id}`, //Send blogId as a query param
            { withCredentials: true } // Ensures authentication cookies are sent
        );
        if (res.data.success) {
            toast.success("Blog Deleted");
            setActive(null);
            dispatch(setChangeDetector());
        }
    } catch (error) {
        console.log("ERROR IN DELETE BLOG API :- ",error);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-x-hidden overflow-y-scroll"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.image}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.author.fullname}
                    </motion.p>
                  </div>

                  <motion.div
                    layoutId={`button-${active.title}-${id}`}
                    target="_blank"
                    className="px-4 py-3 font-bold"
                  >
                    <div className="flex w-fit items-center gap-4">
                      {user._id === active.author._id && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-400" onClick={deleteHandler}>
                          <DeleteIcon
                            size={24}
                            className="text-black"
                          ></DeleteIcon>
                        </div>
                      )}
                      {user._id === active.author._id && (
                        <DialogBlog  work={"update"} blogId={active._id} setIsDialogOpen={setIsDialogOpen}/>
                      )}
                      <div className="flex flex-col items-center">
                        {isLiked ? (
                          <HeartIcon
                            size={24}
                            fill="red"
                            onClick={likeHandler}
                          />
                        ) : (
                          <HeartIcon size={24} onClick={likeHandler} />
                        )}

                        <span>{active.liked_by.length}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${index}`}
            key={`card-${card.title}-${index}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${index}`}>
                <img
                  width={100}
                  height={100}
                  src={card.image}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.author.fullname}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.author.fullname}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-200 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              See Post
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
