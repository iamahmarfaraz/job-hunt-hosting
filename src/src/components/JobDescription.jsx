import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import "./JobDescription.css";
import copy from "copy-to-clipboard";
import {
  LucideBadgeDollarSign,
  LucideBolt,
  LucideBuilding,
  LucideCurrency,
  LucideDollarSign,
  LucideDoorOpen,
  LucideLaptop,
  LucideLetterText,
  LucideLocate,
  LucidePersonStanding,
  LucideShare,
  LucideShoppingBag,
} from "lucide-react";
import { Timeline } from "./ui/timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Footer from "./shared/Footer";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
    
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const [requireSkills, setRequireSkills] = useState([]);

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );


      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

  
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job)); // Update Redux store with job details
  
          // Ensure `isApplied` state is updated after `singleJob` is fetched
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
  
          // Update required skills
          const data = res.data.job.requirements?.map((content, index) => ({
            title: index + 1,
            content: (
              <div className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                {content}
              </div>
            ),
          }));
  
          setRequireSkills(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]); // Dependencies updated
  

  return (
    <div className="descriptionJob">
      <div>
        <Navbar></Navbar>
      </div>
      <div className="relative bg-slate-300 mt-16 lg:max-h-[520px] p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 text-gray-700">
          <h1 className="font-bold text-5xl text-gray-700">
            {singleJob?.title}
          </h1>
          <div className="text-xl text-gray-700 max-w-4xl">{singleJob?.description}</div>
          <div className="text-base flex gap-1 text-teal-600">
            <LucideLaptop /> Experience :{" "}
            <span>{singleJob?.experienceLevel} Year</span>
          </div>
          <div className="text-base flex gap-1 text-violet-500">
            <LucideBolt /> Job Type : <span>{singleJob?.jobType}</span>
          </div>
          <div className="text-base flex gap-1 text-yellow-800">
            <LucideDoorOpen /> No. Of Openings :{" "}
            <span>{singleJob?.position}</span>
          </div>
          <div className="text-base flex gap-1 text-pink-500">
            <LucideLocate /> Location : <span>{singleJob?.location}</span>
          </div>
          <div className="text-base flex gap-1 text-blue-400">
            <LucideBuilding /> Job Created By :{" "}
            <span>{singleJob?.company?.name}</span>
          </div>
          <div className="text-base flex gap-1 text-red-500">
            <LucidePersonStanding />
            <span>
              {singleJob?.applications?.length > 0
                ? singleJob?.applications?.length
                : "No"}{" "}
              Application So Far...
            </span>{" "}
          </div>
          <div className="text-base flex gap-1 text-orange-400">
            <LucideBadgeDollarSign /> Salary : <span>₹{singleJob?.salary}</span>
            LPA
          </div>

          <div className="visible lg:invisible flex gap-2">
            <img
              src={singleJob?.company?.logo}
              alt=""
              loading="lazy"
              className="object-cover rounded-full h-[40px] w-[40px]"
            />
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
            <button
              className="ml-4 flex items-center gap-2  text-yellow-700 "
              onClick={handleShare}
            >
              <LucideShare size={15} /> Share
            </button>
          </div>
        </div>
        <div className="absolute invisible lg:visible right-16 -bottom-12 min-w-[330px] min-h-[370px] max-w-[335px] max-h-[390px] bg-slate-200 rounded-lg shadow-2xl p-4 ">
          <div className="w-full h-full rounded-lg flex flex-col gap-6 items-center mt-3">
            <img
              src={singleJob?.company?.logo}
              alt=""
              loading="lazy"
              className="object-cover rounded-xl h-[200px] w-full"
            />
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
            <button
              className="mx-auto flex items-center gap-2  text-yellow-700 "
              onClick={handleShare}
            >
              <LucideShare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
      <div className="p-12">
        <div className="max-w-xl border-2 border-slate-500 shadow-md p-4 rounded-lg text-slate-700 bg-slate-200">
          <h2 className="font-bold text-3xl text-slate-700">
            What Is Expected From You
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">
                Requirements :
              </AccordionTrigger>
              {singleJob?.requirements.map((skill, index) => (
                <AccordionContent key={index} className="text-red-700">
                  {index + 1}. {skill}
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDescription;
