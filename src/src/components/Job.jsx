import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import "./Job.css";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-5 flex flex-col flex-wrap rounded-md h-auto lg:w-[21rem] job-card border border-gray-100 bg-white shadow-md transition-transform duration-300 hover:scale-105">
    <div className="flex gap-1">
        <div>
          <span className="bg-blue-500 inline-block center w-3 h-3 rounded-full"></span>
        </div>
        <div className="circle">
          <span className="bg-purple-500 inline-block center w-3 h-3 rounded-full"></span>
        </div>
        <div className="circle">
          <span className="bg-pink-500 box inline-block center w-3 h-3 rounded-full"></span>
        </div>
      </div>
      {/* Top Section - Date & Bookmark */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      {/* Company Info - Logo & Name */}
      <div className="flex items-center gap-2 my-3">
        <Avatar className="w-12 h-12 md:w-14 md:h-14">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Job Details - Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge className="text-blue-700 font-bold p-[5px] bg-gray-200 border border-gray-300">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold p-[5px] bg-gray-200 border border-gray-300">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold p-[5px] bg-gray-200 border border-gray-300">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* Buttons - Responsive Adjustments */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-neutral-100 text-gray-50 bg-gray-400"
        >
          Details
        </Button>
        <Button className="w-full sm:w-auto px-4 py-2 rounded-xl border border-neutral-100 text-gray-100 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 group hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transition duration-200">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
