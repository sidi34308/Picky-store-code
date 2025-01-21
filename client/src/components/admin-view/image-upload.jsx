// import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useEffect, useRef } from "react";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { Skeleton } from "../ui/skeleton";

// function ProductImageUpload({
//   imageFile,
//   setImageFile,
//   imageLoadingState,
//   uploadedImageUrls,
//   setUploadedImageUrl,
//   setImageLoadingState,
//   isEditMode,
//   isCustomStyling = false,
// }) {
//   const inputRef = useRef(null);

//   console.log(isEditMode, "isEditMode");

//   function handleImageFileChange(event) {
//     console.log(event.target.files, "event.target.files");
//     const selectedFile = event.target.files?.[0];
//     console.log(selectedFile);

//     if (selectedFile) setImageFile(selectedFile);
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const droppedFile = event.dataTransfer.files?.[0];
//     if (droppedFile) setImageFile(droppedFile);
//   }

//   function handleRemoveImage() {
//     setImageFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   async function uploadImageToCloudinary() {
//     setImageLoadingState(true);
//     const data = new FormData();
//     data.append("my_file", imageFile);
//     const response = await axios.post(
//       "http://localhost:5000/api/admin/products/upload-image",
//       data
//     );
//     console.log(response, "response");

//     if (response?.data?.success) {
//       setUploadedImageUrl(response.data.result.url);
//       setImageLoadingState(false);
//     }
//   }

//   useEffect(() => {
//     if (imageFile !== null) uploadImageToCloudinary();
//   }, [imageFile]);

//   return (
//     <div
//       className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
//     >
//       <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
//       <div
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`${
//           isEditMode ? "opacity-60" : ""
//         } border-2 border-dashed rounded-lg p-4`}
//       >
//         <Input
//           id="image-upload"
//           type="file"
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
//         {!imageFile ? (
//           <Label
//             htmlFor="image-upload"
//             className={`${
//               isEditMode ? "cursor-not-allowed" : ""
//             } flex flex-col items-center justify-center h-32 cursor-pointer`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Drag & drop or click to upload image</span>
//           </Label>
//         ) : imageLoadingState ? (
//           <Skeleton className="h-10 bg-gray-100" />
//         ) : (
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FileIcon className="w-8 text-primary mr-2 h-8" />
//             </div>
//             <p className="text-sm font-medium">{imageFile.name}</p>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-muted-foreground hover:text-foreground"
//               onClick={handleRemoveImage}
//             >
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Remove File</span>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductImageUpload;import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// filepath: /c:/Users/hp/Documents/GitHub/mern-ecommerce-2024/client/src/components/admin-view/image-upload.jsx
// filepath: /c:/Users/hp/Documents/GitHub/mern-ecommerce-2024/client/src/components/admin-view/image-upload.jsx
import { FileIcon, UploadCloudIcon, XIcon, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [thumbnailIndex, setThumbnailIndex] = useState(0); // Default to the first image as the thumbnail
  const [imagePreviews, setImagePreviews] = useState([]);

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]); // Add previews
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImageFiles((prevFiles) => [...prevFiles, ...droppedFiles]); // Append dropped files
    const previews = droppedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]); // Add previews
  }

  function handleRemoveImage(index) {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];
    newImageFiles.splice(index, 1);
    newImagePreviews.splice(index, 1);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);

    // Adjust thumbnailIndex if the thumbnail is removed
    if (index === thumbnailIndex) {
      setThumbnailIndex(0); // Reset to the first image
    } else if (index < thumbnailIndex) {
      setThumbnailIndex((prevIndex) => prevIndex - 1);
    }
  }

  function handleSetThumbnail(index) {
    if (index === thumbnailIndex) return; // Already the thumbnail, no action needed.

    // Reorder `imageFiles` to move the selected file to the start
    const newImageFiles = [...imageFiles];
    const [selectedFile] = newImageFiles.splice(index, 1);
    newImageFiles.unshift(selectedFile); // Add the selected file at the start
    setImageFiles(newImageFiles);

    // Reorder `imagePreviews` to move the corresponding preview to the start
    const newImagePreviews = [...imagePreviews];
    const [selectedPreview] = newImagePreviews.splice(index, 1);
    newImagePreviews.unshift(selectedPreview); // Add the selected preview at the start
    setImagePreviews(newImagePreviews);

    // Update the thumbnail index to the first item
    setThumbnailIndex(0);
  }

  async function uploadImagesToServer() {
    setImageLoadingState(true);
    const data = new FormData();
    imageFiles.forEach((file) => data.append("files", file)); // Use 'files' as the field name
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );

    if (response?.data?.success) {
      setUploadedImageUrls(response.data.urls);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFiles.length > 0) uploadImagesToServer();
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple
        />
        <Label
          htmlFor="image-upload"
          className={`${
            isEditMode ? "cursor-not-allowed" : ""
          } flex flex-col items-center justify-center h-32 cursor-pointer mb-4`}
        >
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span>Drag & drop or click to upload images</span>
        </Label>
        {imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div>
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 mb-3 ${
                  index === thumbnailIndex
                    ? "border-yellow-500"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={imagePreviews[index]}
                    alt={`Preview ${index}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {file.name.length > 15
                        ? `${file.name.substring(0, 15)}...`
                        : file.name}
                    </p>
                    {index === thumbnailIndex && (
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 justify-start">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => handleSetThumbnail(index)}
                    disabled={index === thumbnailIndex}
                  >
                    {index === thumbnailIndex
                      ? "Thumbnail"
                      : "Set as Thumbnail"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
