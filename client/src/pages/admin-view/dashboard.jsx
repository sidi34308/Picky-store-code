import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice/index";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Ensure fallback to localhost

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleUploadFeatureImage(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      setError(
        "File too large or invalid file type. Only images up to 5MB are allowed."
      );
    },
  });

  const handleUploadFeatureImage = async (file) => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      console.log("FormData entries:", [...formData.entries()]); // Debugging: Check if file is appended

      await dispatch(addFeatureImage(formData)).unwrap();
      dispatch(getFeatureImages());
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFeatureImage = async (id) => {
    try {
      await dispatch(deleteFeatureImage(id)).unwrap();
      dispatch(getFeatureImages());
    } catch (err) {
      setError("Failed to delete image. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Home Page Banners</h2>
      <p className="text-sm text-gray-500 mb-4">
        Recommended banner dimensions: 1920x769 pixels.
      </p>

      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 text-center"
      >
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
        <p>Only images up to 5MB are allowed.</p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {uploading && <p>Uploading...</p>}
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.map((featureImgItem) => (
          <div className="relative" key={featureImgItem?._id || Math.random()}>
            <img
              loading="lazy"
              src={`${featureImgItem.image}`} // Prepend BASE_URL to the image path
              className="w-full h-[300px] object-cover rounded-lg"
              alt="Featured"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
