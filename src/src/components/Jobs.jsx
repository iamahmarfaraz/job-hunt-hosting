import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterSidebar from './FilterSidebar';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Job from './Job';
import './Jobs.css';

const Jobs = () => {
    const { allJobs = [], searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        
        if (!allJobs || allJobs.length === 0) {
            setFilterJobs([]);
            return;
        }

        // Monthly Salary Ranges
        const salaryRanges = [
            "0-40k",
            "42k-100k",
            "100k-500k",
            "500k-1M",
            "1M+"
        ];

        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const jobMonthlySalary = (job.salary * 100000) / 12; // Convert LPA to Monthly Salary
                const isSalaryRange = salaryRanges.includes(searchedQuery);
                let isSalaryMatch = false;

                if (isSalaryRange) {
                    const [minStr, maxStr] = searchedQuery.split("-");
                    const min = parseInt(minStr.replace("k", "000").replace("M", "000000"), 10);
                    const max = maxStr ? parseInt(maxStr.replace("k", "000").replace("M", "000000"), 10) : null;

                    console.log(`Job: ${job.title}, Salary: ₹${job.salary}LPA, Monthly: ₹${jobMonthlySalary}, Range: ${min} - ${max}`);

                    if (!isNaN(min) && !isNaN(max)) {
                        isSalaryMatch = jobMonthlySalary >= min && jobMonthlySalary <= max;
                    } else if (!isNaN(min) && max === null) {
                        isSalaryMatch = jobMonthlySalary >= min; // Handle "1M+" case
                    }
                }

                return (
                    job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    isSalaryMatch
                );
            });

            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='w-full'>
            <div>
                <Navbar />
            </div>
            
            <div className='w-full container-jobs mt-[67px] h-[100vh] overflow-x-hidden'>
                <div className='flex gap-5'>
                    <div className='w-20% border-t-[1px] border-r-[1px] border-b-[1px] shadow-2xl min-h-screen rounded-lg'>
                        <FilterSidebar />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span className='flex items-center justify-center w-full'>Job not found</span> : (
                            <div className='flex-1 h-[100vh] overflow-y-auto pb-5 mt-10 lg:mt-0 overflow-x-hidden'>
                                <div className='grid mt-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 px-10 '>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Jobs;
