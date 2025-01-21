import React, { useState } from "react";

const ImageMagnifier = ({ src, alt, width, height }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    setPosition({
      x: left,
      y: top,
    });
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setCursorPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            top: `${cursorPosition.y}%`,
            left: `${cursorPosition.x}%`,
            transform: "translate(-50%, -50%)",
            border: "2px solid #fff",
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            opacity: 1,
            pointerEvents: "none",
            zIndex: 10,
            background: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
            backgroundSize: "700% 700%",
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
