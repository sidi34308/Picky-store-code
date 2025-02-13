import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";

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
    onDropRejected: (rejectedFiles) => {
      setError(
        "File too large or invalid file type. Only images up to 5MB are allowed."
      );
    },
  });

  const handleUploadFeatureImage = async (file) => {
    setUploading(true);
    setError(null);
    try {
      await dispatch(addFeatureImage(file)).unwrap();
      dispatch(getFeatureImages());
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFeatureImage = async (key) => {
    try {
      await dispatch(deleteFeatureImage(key)).unwrap();
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
        {featureImageList.map((featureImgItem) => (
          <div className="relative" key={featureImgItem.key}>
            <img
              loading="lazy"
              src={featureImgItem.image}
              className="w-full h-[300px] object-cover rounded-t-lg"
              alt="Featured"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => handleDeleteFeatureImage(featureImgItem.key)}
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
