import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white  text-subtitle p-10 mt-10 w-full dark:bg-gray-800">
      <div className=" mx-auto flex flex-col md:flex-row justify-between">
        {/* Logo & Description */}
        <div className="md:w-1/3 flex flex-col justify-start pl-8">
          <h2 className="text-2xl font-bold text-primary mb-4">CAR HUNT</h2>
          <p className="mt-2 text-sm">
            Our vision is to provide convenience <br /> and help increase your sales business.
          </p>
        </div>

        {/* Navigation Sections */}
        <div className="md:w-2/3 flex flex-wrap gap-30 mt-6 mr-30 md:mt-0 justify-end">
          {/* About */}
          <div>
            <h3 className="font-semibold text-maintext dark:text-white mb-4">About</h3>
            <ul className="mt-2 text-sm text-subtitle space-y-4">
              <li>How it works</li>
              <li>Featured</li>
              <li>Partnership</li>
              <li>Business Relation</li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-maintext dark:text-white mb-4">Community</h3>
            <ul className="mt-2 text-sm text-subtitle space-y-4">
              <li>Events</li>
              <li>Blog</li>
              <li>Podcast</li>
              <li>Invite a friend</li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-semibold text-maintext dark:text-white mb-4">Socials</h3>
            <ul className="mt-2 text-sm text-subtitle space-y-4">
              <li>Discord</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mx-auto mt-8 p-8 flex flex-col md:flex-row justify-between text-sm text-subtitle dark:text-white border-t">
        <p>©2022 CAR HUNT. All rights reserved</p>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <p className="hover:text-subtitle-light dark:text-white cursor-pointer">Privacy & Policy</p>
          <p className="hover:text-subtitle-light dark:text-white cursor-pointer">Terms & Condition</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;