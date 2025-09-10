import React from "react";

const HeroSection = () => {
  return (
    <section className="relative">
      <img
        src="banner.jpg"
        alt="Hero background"
        className="w-full h-80 object-cover"
      />
      <div className="absolute inset-0 bg-opacity-75 flex items-center justify-start">
        <h1 className="text-5xl font-bold text-blue-950 max-w-[340px] m-6 ml-[140px]">
          A SOFA, A GOOD BOOK, AND YOU.
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
