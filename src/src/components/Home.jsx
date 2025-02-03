
import React from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import './Home.css'
import ContainerScrollBox from './ContainerScrollBox'
import Footer from './shared/Footer'


const Home = () => {
  return (
    <div>
      <div className="  bg-no-repeat bg-gradient-to-r from-purple-50 via-violet-50 to-pink-50 ">
      <Navbar ></Navbar>
      </div>
      <HeroSection></HeroSection>
      <CategoryCarousel></CategoryCarousel>
      <ContainerScrollBox/>
      <div className='wht-grd bg-gray-50'>
      <LatestJobs></LatestJobs>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
