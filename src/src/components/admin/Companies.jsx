import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import './Companies.css';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div className="comp-cont p-0 m-0 min-h-[100vh] h-[100%]">
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 p-0 sm:p-5">
        <div className="flex items-center justify-evenly sm:justify-between my-5 mt-10 pt-10 sm:pt-0 lg:mt-24">
          <Input
            className="w-1/2 sm:w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
