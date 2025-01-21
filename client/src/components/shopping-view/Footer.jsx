import React from "react";
import instagram from "../../assets/icons/instagram.svg"; // Adjust the path as necessary
import facebook from "../../assets/icons/facebook.svg"; // Adjust the path as necessary
import tiktok from "../../assets/icons/tiktok.svg"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer style={{ direction: "rtl" }} className="p-4">
      <div className="container py-10 mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center">
        {/* Quick Links Section */}
        <div className="flex flex-col items-start space-y-2 mt-4 lg:mt-0">
          <p className="text-gray-600">للتواصل والشكاوي والاقتراحات</p>
          <a href="/home" className="text-primary/70 hover:underline">
            الرئيسية
          </a>
          <a href="/children" className="text-primary/70 hover:underline">
            أطفال
          </a>
          <a href="/women" className="text-primary/70 hover:underline">
            نساء
          </a>
          <a href="/men" className="text-primary/70 hover:underline">
            رجال
          </a>
          <a href="/about" className="text-primary/70 hover:underline">
            من نحن
          </a>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-start space-y-2 mt-4 lg:mt-0">
          <p className="text-gray-600">للتواصل والشكاوي والاقتراحات</p>
          <a
            href="mailto:info@picky.qa"
            className="text-primary/70 font-medium hover:underline"
          >
            info@picky.qa
          </a>
        </div>

        {/* Social Media Section */}
        <div className="flex gap-2 mt-4 lg:mt-0">
          <a
            href="https://www.instagram.com/picky" // Replace with actual Instagram link
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-100 bg-accent p-2 rounded-xl"
          >
            <img src={instagram} alt="إنستغرام" className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/picky" // Replace with actual Facebook link
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-100 bg-accent p-2 rounded-xl"
          >
            <img src={facebook} alt="فيسبوك" className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@picky" // Replace with actual TikTok link
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-100 bg-accent p-2 rounded-xl"
          >
            <img src={tiktok} alt="تيك توك" className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-1">
        <p className="text-gray-500 text-sm"> 2025© بيكي</p>
      </div>
    </footer>
  );
};

export default Footer;
