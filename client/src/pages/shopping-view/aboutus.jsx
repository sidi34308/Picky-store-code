import React from "react";

const AboutUs = () => {
  return (
    <div className="p-6 md:p-12 lg:p-16 bg-gray-100 min-h-screen flex flex-col items-center text-right">
      <div className="max-w-2xl bg-white rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">من نحن</h1>
        <p className="text-gray-600 mb-4">
          مرحبًا بكم في{" "}
          <span className="font-semibold text-primary">متجر بيكي</span>! نحن
          ملتزمون بتقديم أفضل تجربة تسوق ممكنة لكم.
        </p>
        <p className="text-gray-600 mb-4">
          تتمثل مهمتنا في تقديم منتجات عالية الجودة بأسعار معقولة، مع التركيز
          على رضا العملاء.
        </p>
        <p className="text-gray-600">
          شكرًا لاختياركم{" "}
          <span className="font-semibold text-primary">متجر بيكي</span>. نأمل أن
          تستمتعوا بتجربة التسوق معنا!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
