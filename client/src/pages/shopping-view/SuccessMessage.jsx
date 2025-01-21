import React from "react";

const SuccessMessage = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bg-white top-1/2 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center max-w-md p-6 rounded-2xl shadow-lg">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✔️</div>
        <h2 className="text-xl font-semibold mb-2">شكرًا لك!</h2>
        <p className="text-gray-600">
          لقد استلمنا طلبك وسنقوم بالتواصل معك في أقرب وقت.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
