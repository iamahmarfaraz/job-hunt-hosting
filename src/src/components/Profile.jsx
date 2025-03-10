import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import "./Profile.css";
import UpdateProfileDialog from "./UpdateProfileDialog";
import AppliedJobTable from "./AppliedJobTable";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Contact, Mail, Pen } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import DeleteAccountModal from "./DeleteAccountModal";
import { ChangeProfilePic } from "./ChangeProfilePic";

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [openPfp, setOpenPfp] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />
      <div className="container-profile min-h-screen mt-16 p-4">
        <div className="max-w-7xl mx-auto border border-gray-200 rounded-2xl my-5 p-6 md:p-8 bg-white shadow-lg">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 relative group cursor-default" onClick={() => setOpenPfp(true)}>
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt="profile"
                  className="object-contain"
                />
                <div
                  className="w-full h-full bg-transparent backdrop-blur-sm absolute text-center flex justify-center text-xs pt-1 text-slate-300 translate-y-24 group-hover:translate-y-14 transition-transform duration-300 cursor-default"
                  
                >
                  Edit Profile
                </div>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="font-medium text-lg md:text-xl">
                  {user?.fullname}
                </h1>
                <p className="text-gray-600">
                  {user?.profile?.bio || "No bio available"}
                </p>
              </div>
            </div>
            <div className="sm:w-auto w-full flex md:flex-row flex-col gap-3">
              <Button
                onClick={() => setOpen(true)}
                className="w-full sm:w-auto"
                variant="outline"
              >
                <Pen className="h-4 w-4" />
              </Button>
              <DeleteAccountModal />
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 my-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <span>{user?.email || "Not Available"}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 my-2">
              <Contact className="h-5 w-5 text-gray-600" />
              <span>{user?.phoneNumber || "Not Available"}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-5">
            <h1 className="font-semibold text-lg">Skills</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((item, index) => (
                  <Badge key={index} className="text-sm p-2">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">No skills listed</span>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="mt-5 flex gap-2">
            <Label className="text-md font-bold">Resume</Label>
            {isResume ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={user?.profile?.resume}
                className="text-blue-500 hover:underline break-all cursor-pointer"
              >
                {user?.profile?.resumeOriginalName || "View Resume"}
              </a>
            ) : (
              <span className="text-gray-500">No resume uploaded</span>
            )}
          </div>

          {/* Applied Jobs */}
          <h1 className="font-bold text-lg mt-8">Applied Jobs</h1>
          <AppliedJobTable />

          {/* Update Profile Dialog */}
          <UpdateProfileDialog open={open} setOpen={setOpen} />
          <ChangeProfilePic
            open={openPfp}
            setOpen={setOpenPfp}
          ></ChangeProfilePic>
        </div>
      </div>
    </div>
  );
};

export default Profile;
