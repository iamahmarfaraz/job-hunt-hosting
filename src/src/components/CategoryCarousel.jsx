"use client";

import Carousel from "@/components/ui/carousel";
import React from "react";
import "./CategoryCarousel.css";
import { BackgroundLines } from "./ui/background-lines";

const CategoryCarousel = () => {
  const slideData = [
    {
      title: "Data Science",
      button: "Explore Jobs",
      src: "https://i.ibb.co/j8zqJGt/Designer-4.jpg",
    },
    {
      title: "Frontend Developer",
      button: "Explore Jobs",
      src: "https://i.ibb.co/tXnNXyG/Designer-2.jpg",
    },
    {
      title: "Backend Developer",
      button: "Explore Jobs",
      src: "https://i.ibb.co/0qw3gS8/Designer-3.jpg",
    },

    {
      title: "Graphic Designer",
      button: "Explore Jobs",
      src: "https://i.ibb.co/Nxg01px/Designer-5.jpg",
    },
    {
      title: "FullStack Developer",
      button: "Explore Jobs",
      src: "https://i.ibb.co/SNcQpFL/Designer-6.jpg",
    },
  ];

  return (
    <div className="bg-purple-200 relative mb-10 md:mb-0 overflow-hidden w-full h-full">
      <BackgroundLines className="bg-purple-200 h-full flex gap-5  justify-center w-full flex-col px-4">
        <div>
          <span className=" text-gray-700 text-5xl ml-3 font-bold">
            Top Pick
          </span>
        </div>
        {/* bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-500 via-red-500 to-blue-500 */}
        <Carousel slides={slideData} />
      </BackgroundLines>
    </div>
  );
};

export default CategoryCarousel;
