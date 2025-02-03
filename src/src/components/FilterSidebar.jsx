import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import "./FilterSidebar.css";

// Large dataset for various job roles & skills
const largeJobDataset = [
  // 🌟 Software Development & Engineering
  {
    role: "Frontend Developer",
    skills: [
      "React",
      "Vue",
      "Angular",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    role: "Backend Developer",
    skills: [
      "Node.js",
      "Express",
      "Django",
      "Spring Boot",
      "MongoDB",
      "SQL",
      "PostgreSQL",
      "Redis",
    ],
  },
  {
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "Django", "MongoDB", "GraphQL", "Docker"],
  },
  {
    role: "Mobile Developer",
    skills: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Dart",
      "Objective-C",
    ],
  },
  {
    role: "Game Developer",
    skills: ["Unity", "C#", "Unreal Engine", "Blender", "Godot", "CryEngine"],
  },
  {
    role: "Embedded Systems Engineer",
    skills: [
      "C",
      "C++",
      "RTOS",
      "Embedded C",
      "IoT",
      "Arduino",
      "Raspberry Pi",
    ],
  },
  {
    role: "Blockchain Developer",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "Hyperledger", "Rust"],
  },
  {
    role: "Desktop Application Developer",
    skills: ["Electron.js", "Qt", "C#", "WPF", "JavaFX"],
  },

  // 🤖 Artificial Intelligence & Data Science
  {
    role: "AI Engineer",
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Deep Learning",
      "Computer Vision",
      "NLP",
    ],
  },
  {
    role: "Data Scientist",
    skills: [
      "Python",
      "R",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "SQL",
      "Hadoop",
    ],
  },
  {
    role: "Data Analyst",
    skills: ["Excel", "SQL", "Tableau", "Power BI", "R", "Statistics"],
  },
  {
    role: "Big Data Engineer",
    skills: [
      "Hadoop",
      "Apache Spark",
      "Kafka",
      "Scala",
      "Cloud Data Pipelines",
    ],
  },

  // 🌐 Cloud Computing & DevOps
  {
    role: "Cloud Engineer",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Terraform",
      "Kubernetes",
      "Docker",
    ],
  },
  {
    role: "DevOps Engineer",
    skills: [
      "CI/CD",
      "Jenkins",
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "Ansible",
    ],
  },
  {
    role: "Site Reliability Engineer",
    skills: [
      "SRE",
      "Prometheus",
      "Grafana",
      "Terraform",
      "Incident Management",
    ],
  },

  // 🔐 Cybersecurity & Ethical Hacking
  {
    role: "Cybersecurity Analyst",
    skills: ["Penetration Testing", "SIEM", "Firewalls", "Network Security"],
  },
  {
    role: "Ethical Hacker",
    skills: ["Kali Linux", "Metasploit", "Wireshark", "Bug Bounty", "OWASP"],
  },
  {
    role: "SOC Analyst",
    skills: ["Splunk", "ELK Stack", "SIEM", "Threat Hunting"],
  },

  // 📊 Finance, Business & Management
  {
    role: "Financial Analyst",
    skills: [
      "Excel",
      "Financial Modeling",
      "Risk Management",
      "Investment Analysis",
    ],
  },
  {
    role: "Business Analyst",
    skills: ["SQL", "Power BI", "Data Visualization", "Process Optimization"],
  },
  {
    role: "Product Manager",
    skills: ["Agile", "Scrum", "Roadmaps", "Wireframing", "Customer Research"],
  },
  {
    role: "HR Specialist",
    skills: ["Recruitment", "Talent Management", "HRMS", "Payroll"],
  },
  {
    role: "Investment Banker",
    skills: ["Valuation", "Private Equity", "Mergers & Acquisitions"],
  },
  {
    role: "Accountant",
    skills: ["Bookkeeping", "Tax Filing", "Payroll", "SAP", "QuickBooks"],
  },
  {
    role: "Actuary",
    skills: [
      "Risk Analysis",
      "Probability",
      "Statistics",
      "Insurance Calculations",
    ],
  },

  // 🏥 Healthcare & Medical Technology
  {
    role: "Bioinformatics Specialist",
    skills: ["Genomics", "Machine Learning", "Python", "Biostatistics"],
  },
  {
    role: "Medical Data Analyst",
    skills: ["EHR Systems", "Data Science", "Clinical Trials", "R", "SAS"],
  },

  // 🎨 UI/UX Design & Creative Fields
  {
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping"],
  },
  {
    role: "Graphic Designer",
    skills: ["Photoshop", "Illustrator", "InDesign", "Typography"],
  },
  {
    role: "Motion Graphics Designer",
    skills: ["After Effects", "Cinema 4D", "Blender", "Maya"],
  },

  // 🏥 Healthcare & Medical
  {
    role: "Doctor",
    skills: ["Diagnosis", "Surgery", "Patient Care", "Prescriptions"],
  },
  {
    role: "Nurse",
    skills: ["Patient Care", "Medication", "Emergency Response", "IV Therapy"],
  },
  {
    role: "Pharmacist",
    skills: ["Medicine Dispensing", "Drug Interaction", "Prescriptions"],
  },
  {
    role: "Medical Laboratory Technician",
    skills: ["Pathology", "Microbiology", "Testing Samples"],
  },

  // 📢 Marketing & SEO
  {
    role: "Digital Marketing Specialist",
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing"],
  },
  {
    role: "SEO Specialist",
    skills: [
      "Keyword Research",
      "On-Page SEO",
      "Backlinking",
      "Google Analytics",
    ],
  },
  {
    role: "Social Media Manager",
    skills: ["Instagram Marketing", "Twitter Ads", "LinkedIn Strategy"],
  },
  {
    role: "Content Writer",
    skills: ["Copywriting", "Blogging", "SEO Writing", "Social Media Writing"],
  },
  {
    role: "Graphic Designer",
    skills: ["Photoshop", "Illustrator", "InDesign", "Typography"],
  },
  {
    role: "Public Relations Specialist",
    skills: ["Media Relations", "Crisis Management", "Press Releases"],
  },

  // 📚 Education & Research
  {
    role: "Teacher",
    skills: [
      "Lesson Planning",
      "Classroom Management",
      "Curriculum Development",
    ],
  },
  {
    role: "Professor",
    skills: ["Academic Research", "Teaching", "Publishing Papers"],
  },
  {
    role: "Librarian",
    skills: ["Cataloging", "Book Preservation", "Information Management"],
  },

  // 🚀 Emerging Technologies & Research
  {
    role: "Quantum Computing Researcher",
    skills: ["Qiskit", "Quantum Circuits", "IBM Q Experience"],
  },
  {
    role: "Autonomous Systems Engineer",
    skills: ["ROS", "SLAM", "Computer Vision", "Reinforcement Learning"],
  },

  // ⚙️ Miscellaneous Tech Jobs
  {
    role: "Hardware Engineer",
    skills: ["VHDL", "FPGA", "Microcontrollers", "PCB Design"],
  },
  {
    role: "Technical Support Engineer",
    skills: ["IT Support", "Troubleshooting", "Networking", "Customer Service"],
  },

  // 🏗️ Engineering & Manufacturing
  {
    role: "Mechanical Engineer",
    skills: ["AutoCAD", "SolidWorks", "CFD", "FEA"],
  },
  {
    role: "Civil Engineer",
    skills: ["STAAD.Pro", "Revit", "Structural Analysis", "Surveying"],
  },
  {
    role: "Electrical Engineer",
    skills: ["Circuit Design", "Embedded Systems", "Power Systems"],
  },

  // 🏛️ Government & Public Services
  {
    role: "Police Officer",
    skills: ["Law Enforcement", "Public Safety", "Emergency Response"],
  },
  {
    role: "Firefighter",
    skills: ["Fire Safety", "Rescue Operations", "First Aid"],
  },
  {
    role: "Diplomat",
    skills: ["International Relations", "Negotiation", "Public Policy"],
  },

  // 🎭 Arts, Entertainment & Sports
  {
    role: "Musician",
    skills: ["Instrument Proficiency", "Music Theory", "Performance"],
  },
  {
    role: "Actor",
    skills: ["Acting Techniques", "Voice Modulation", "Improvisation"],
  },
  {
    role: "Athlete",
    skills: ["Physical Training", "Endurance", "Competition"],
  },

  // 🎮 Game Development & Virtual Reality
  { role: "VR Developer", skills: ["Unity", "C#", "ARKit", "Oculus SDK"] },
  { role: "3D Modeler", skills: ["Blender", "Maya", "ZBrush", "Cinema 4D"] },

  // 🏬 Retail & Hospitality
  {
    role: "Retail Manager",
    skills: ["Customer Service", "Inventory Management", "Sales"],
  },
  {
    role: "Hotel Manager",
    skills: ["Hospitality", "Guest Relations", "Operations Management"],
  },
  { role: "Chef", skills: ["Cooking", "Recipe Development", "Food Safety"] },

  // ✈️ Travel & Tourism
  {
    role: "Tour Guide",
    skills: ["History Knowledge", "Communication", "Public Speaking"],
  },
  {
    role: "Flight Attendant",
    skills: ["Customer Service", "Emergency Procedures", "Safety Training"],
  },

  // 🚚 Logistics & Supply Chain
  {
    role: "Supply Chain Manager",
    skills: ["Logistics", "Procurement", "Inventory Management"],
  },
  {
    role: "Truck Driver",
    skills: ["Navigation", "Vehicle Maintenance", "Safety Regulations"],
  },

  // 🏡 Real Estate & Construction
  {
    role: "Real Estate Agent",
    skills: ["Property Sales", "Client Relations", "Market Analysis"],
  },
  { role: "Construction Worker", skills: ["Masonry", "Carpentry", "Plumbing"] },

  // 💼 Administrative & Customer Support
  {
    role: "Receptionist",
    skills: ["Customer Service", "Scheduling", "Office Management"],
  },
  {
    role: "Call Center Representative",
    skills: ["Communication", "Problem Solving", "Typing Speed"],
  },

  // 🏦 Banking & Insurance
  {
    role: "Investment Banker",
    skills: ["Financial Analysis", "Valuation", "Mergers & Acquisitions"],
  },
  {
    role: "Insurance Analyst",
    skills: ["Actuarial Science", "Risk Assessment", "Underwriting"],
  },

  // 🚀 Space & Aerospace
  {
    role: "Aerospace Engineer",
    skills: ["Aerodynamics", "Rocket Propulsion", "CAD Design"],
  },
  {
    role: "Astronomer",
    skills: ["Astrophysics", "Telescope Operations", "Celestial Mechanics"],
  },
];

// Default static filter if the user is not logged in
const defaultFilterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42k-100k", "100k-500k", "500k-1M", "1M+"],
  },
];

const FilterCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedValue, setSelectedValue] = useState("");
  const [filterData, setFilterData] = useState(defaultFilterData);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Fetch top 5 cities of the user's country
  const fetchTopCities = async (country) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en`
      );

      const cities = response.data.localityInfo.administrative
        .map((city) => city.name)
        .slice(0, 5);
      console.log("CITIES :- ", cities);

      if (cities.length > 0) {
        setFilterData((prev) =>
          prev.map((item) =>
            item.filterType === "Location" ? { ...item, array: cities } : item
          )
        );
      }
    } catch (error) {
      console.error("Error fetching top cities:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Get user's country using geolocation
  const getUserCountry = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const country = response.data.address.country;

            if (country) fetchTopCities(country);
          } catch (error) {
            console.error("Error fetching country:", error);
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
      setLoadingLocation(false);
    }
  };

  // Generate dynamic filters based on user skills
  const generateDynamicFilters = (userSkills) => {
    const topMatchedJobs = largeJobDataset
      .map((job) => ({
        role: job.role,
        matchCount: job.skills.filter((skill) => userSkills.includes(skill))
          .length,
      }))
      .filter((job) => job.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 5)
      .map((job) => job.role);

    return filterData.map((item) =>
      item.filterType === "Industry"
        ? {
            ...item,
            array:
              topMatchedJobs.length > 0
                ? topMatchedJobs
                : defaultFilterData[1].array,
          }
        : item
    );
  };

  // Update filterData when user logs in
  useEffect(() => {
    if (user && user.profile.skills) {
      setFilterData(generateDynamicFilters(user.profile.skills));
    } else {
      setFilterData(defaultFilterData);
    }
  }, [user]);

  // Fetch user location on mount
  useEffect(() => {
    getUserCountry();
  }, []);

  // Update searched query when filter changes
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-slate-100 p-7 rounded-md border-r-[1px] border-t-[1px] border-b-2 shadow-2xl h-[100vh]">
      <h1 className="font-bold text-lg text-slate-800">Filter Jobs</h1>
      <hr className="mt-2 mb-2 border-t-2 border-slate-300 rounded-sm" />

      <RadioGroup
        value={selectedValue}
        onValueChange={(value) => {
          setSelectedValue(value);
          console.log("Value Changed:", value);
          console.log("selectedValue :- ", selectedValue);
        }}
      >
        {filterData.map((data, index) => (
          <div key={index} className="flex flex-col">
            <h1 className="font-bold text-lg text-slate-600">{data.filterType}</h1>
            {loadingLocation && data.filterType === "Location" ? (
              <div className="flex items-center p-4 space-x-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[110px] bg-gray-300" />
                  <Skeleton className="h-4 w-[80px] bg-gray-300" />
                </div>
              </div>
            ) : (
              data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-2 my-2 "
                  >
                    <RadioGroupItem
                      value={item}
                      id={itemId}
                      className="fltrIpt"
                    />
                    <Label
                      htmlFor={itemId}
                      className={
                        selectedValue === item
                          ? "bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500  text-white bg-clip-text text-transparent bg-no-repeat"
                          : "text-center text-blue-400 "
                      }
                    >
                      {item}
                    </Label>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
