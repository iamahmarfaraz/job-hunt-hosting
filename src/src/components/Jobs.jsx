import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterSidebar from './FilterSidebar';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Job from './Job';

const Jobs = () => {
    const { allJobs = [], searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        if (!allJobs || allJobs.length === 0) {
            setFilterJobs([]);
            return;
        }

        // Define salary filter options locally
        const salaryRanges = [
            "0-40k",
            "42k-100k",
            "100k-500k",
            "500k-1M",
            "1M+"
        ];

        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const jobSalary = job.salary * 100000;
                const isSalaryRange = salaryRanges.includes(searchedQuery);
                let isSalaryMatch = false;

                if (isSalaryRange) {
                    const [min, max] = searchedQuery
                        .replace("k", "000")
                        .replace("M", "000000")
                        .split("-")
                        .map(Number);

                    if (!isNaN(min) && !isNaN(max)) {
                        isSalaryMatch = jobSalary >= min && jobSalary <= max;
                    } else if (!isNaN(min) && isNaN(max)) {
                        isSalaryMatch = jobSalary >= min; // Handle "1M+" case
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
        <div>
            <div className='w-full bg-purple-200'>
                <Navbar />
            </div>

            <div className='max-w-7xl '>
                <div className='flex justify-between gap-5'>
                    <div className='w-20%'>
                        <FilterSidebar />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] mt-5 overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
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
