import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-20 px-4 md:px-10"
      style={{ direction: "rtl" }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        تم إرسال طلبك بنجاح!
      </h1>
      <p className="text-base md:text-lg mb-6 text-center">
        شكراً لتسوقك معنا. سنتواصل معك قريباً لتأكيد الطلب وتوصيله.
      </p>
      <img src="/src/assets/done.png" className="m-10 w-10 sm:w-10 " />
      <button
        onClick={() => navigate("/")}
        className="bg-primary text-white hover:bg-primary/80 rounded-md py-2 px-4"
      >
        العودة إلى الصفحة الرئيسية
      </button>
    </div>
  );
};

export default SuccessPage;
