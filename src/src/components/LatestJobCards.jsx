import React from "react";
import { Badge } from "./ui/badge";
import { PinContainer } from "./ui/3d-pin";
import ColourfulText from "./ui/colourful-text";
import { useNavigate } from "react-router-dom";
import "./LatestJobCards.css";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <PinContainer title="/companywebsite.com" href={`/description`}>
      <div className="flex p-2 gap-1">
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
      <div className="flex basis-full rounded-xl flex-col justify-between p-4 bg-gray-200 tracking-tight text-slate-100/50 sm:basis-1/2 w-[15rem] lg:w-[19rem] h-[17rem] ">
        <div className="">
          <h2 className="font-bold text-xl text-gray-900">
            {job?.company?.name}
          </h2>
          <p className="text-gray-700">{job?.location}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-gray-800">{job?.title}</h2>
          <p className="text-gray-600">
            <p className="text-gray-600">
              {job?.description.split(" ").slice(0, 20).join(" ") +
                (job?.description.split(" ").length > 20 ? "..." : "")}
            </p>
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Badge
            variant="outline"
            className="neu-button text-red-400 border border-gray-600 p-2 px-3 font-bold"
          >
            {job?.position} Positions
          </Badge>
          <Badge
            variant="ghost"
            className="neu-button text-purple-400 font-bold border-gray-600 p-2 px-3 "
          >
            {job?.jobType}
          </Badge>
          <Badge
            variant="ghost"
            className="neu-button text-green-400 font-bold border-gray-600 p-2 px-3 "
          >
            {job?.salary} LPA
          </Badge>
        </div>
      </div>
    </PinContainer>
  );
};

export default LatestJobCards;
