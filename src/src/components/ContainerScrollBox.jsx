import React from 'react'
import { ContainerScroll } from './ui/container-scroll-animation'
import DesignerImage from "../assets/Designer-8.jpg";
import ColourfulText from './ui/colourful-text';

const ContainerScrollBox = () => {
  return (
    <div className="flex flex-col max-h-fit bg-slate-200 overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
            Unlock endless career opportunities with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                <ColourfulText text={"JobHunt"}/>
              </span>
            </h1>
          </>
        }
      >
        <img
          src={DesignerImage}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  )
}

export default ContainerScrollBox
