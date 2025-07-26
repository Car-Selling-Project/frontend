import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-white dark:text-black rounded-lg w-full h-[50vh] lg:h-[50vh] bg-[url('/Ads.jpg')] bg-cover bg-center px-6 lg:px-16 flex items-start justify-start">
      {/* Text Content */}
      <div className="absolute top-10 left-10 max-w-lg">
        <h1 className="text-2xl lg:text-5xl font-bold  leading-tight">
          The Best Platform for Car Rental
        </h1>
        <p className=" mt-4 mr-2 text-lg">
          Ease of doing a car rental safely and reliably. 
        </p>
        <p className="text-lg">
          Of course at a low price.
        </p>
      </div>

      {/* Car Image */}
      <div className="absolute bottom-10 right-0 w-1/2 lg:w-9/20 scale-150">
        <img 
          src="/car 1.png" 
          alt="Car Rental" 
          className="w-full max-w-md lg:max-w-lg object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;