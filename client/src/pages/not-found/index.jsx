import React from "react";
import logo from "../../assets/logo.svg";

const Error404 = () => {
  return (
    <div className="h-screen bg-primary text-white flex flex-col items-center justify-center text-center font-sans">
      <div className="mb-4">
        <img src={logo} alt="Picky Logo" className="w-50 h-24 mx-auto" />
      </div>
      <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-6 ">
        يبدو أن الصفحة التي تحاول الوصول إليها غير متاحة. قد يكون الرابط غير
        صحيح أو أن الصفحة قد تم نقلها.{" "}
        <a href="/" className="underline font-bold">
          الرئيسية
        </a>
      </p>
      <h2 className="text-[20rem] font-extrabold">404</h2>
    </div>
  );
};

export default Error404;
