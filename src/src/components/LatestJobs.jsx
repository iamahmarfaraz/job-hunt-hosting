import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  useGetAllJobs();
  const {allJobs} = useSelector(store=>store.job);
  
  return (
    
    <div className="w-full flex flex-col p-5 pt-10 gap-5 mx-auto">
        
      <h1 className="text-4xl font-bold text-gray-600">
        <span className="  bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 ">
          Latest & Top{" "}
        </span>{" "}
        Job Openings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        {allJobs.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job,index) => <LatestJobCards key={index} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
