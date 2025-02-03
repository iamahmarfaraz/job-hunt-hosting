"use client";
 
import { motion } from "framer-motion";

import React from 'react'
import { AuroraBackground } from './ui/aurora-background'
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import ColourfulText from "./ui/colourful-text";

const HeroSection = () => {
  return (
    <div>
      <AuroraBackground>
      
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center   px-4"
      >
        <span className=" px-4 py-2 rounded-full text-red-400 font-medium border border-gray-400 dark:text-white text-center">
          No. 1 Job Hunt Website
        </span>
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Search, Apply & <br /> Get Your <ColourfulText text="Dream Job"/>
        </div>
        <div className="flex items-center text-center w-8/12 text-gray-700 font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
        Your journey to professional success begins here! At JobHunt, we empower you to discover exciting job opportunities, connect with leading companies, and achieve your career aspirations faster than ever before.
        </div>
        <div className="flex w-[40%] shadow-lg border bg-transparent border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
            <input type="text" placeholder="Find Your Dream Jobs"
            className="outline-none border-none w-full bg-transparent" />
            <Button className="rounded-r-full bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 "><Search className="h-6 w-6 text-center"></Search></Button>
        </div>
      </motion.div>
    </AuroraBackground>
    </div>
  )
}

export default HeroSection
