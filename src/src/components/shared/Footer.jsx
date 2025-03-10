import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLeetcode,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import React from "react";
import { FloatingDock } from "../ui/floating-dock";
import ProfilePic from "../../assets/IMG_8175.jpg"

const Footer = () => {
  const links = [
    {
      title: "Facebook",
      icon: (
        <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.facebook.com/share/1MKcgCeLTg/?mibextid=wwXIfr",
    },

    {
      title: "Instagram",
      icon: (
        <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.instagram.com/iamahmarfaraz",
    },
    {
      title: "LeetCode",
      icon: (
        <IconBrandLeetcode className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://leetcode.com/u/ahmarfaraz9/",
    },
    {
      title: "Ahmar",
      icon: (
        <img
          src={ProfilePic}
          width={20}
          height={20}
          alt="ahmar"
          className="rounded-full
           object-fill"
        />
      ),
      href: "#",
    },
    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/iamahmarfaraz/",
    },

    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/ahmarfaraz10?s=21",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/iamahmarfaraz",
    },
  ];
  return (
    <footer className="border-t bg-gray-50 border-t-gray-200 py-8">
      <div className=" mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Job Hunt</h2>
            <p className="text-sm">© 2025 A.F Company. All rights reserved.</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="flex items-center justify-center w-full">
              <FloatingDock
                mobileClassName="translate-y-20" // only for demo, remove for production
                items={links}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
