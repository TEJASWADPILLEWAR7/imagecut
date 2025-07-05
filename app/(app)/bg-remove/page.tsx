"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

function BGRemove() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setIsTransforming(true);
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIsTransforming(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#1e1b32] to-[#0c1023] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Background Removal
        </h1>

        <div className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">
            Upload an Image
          </h2>

          <label className="block mb-2 text-sm text-gray-300">
            Choose an image file
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="file-input file-input-bordered file-input-primary w-full bg-white text-black"
          />

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {isTransforming && (
            <div className="mt-4 text-center text-sm text-gray-300">
              Upload Image
              <div className="mt-2">
                <progress className="progress progress-secondary w-56"></progress>
              </div>
            </div>
          )}

          {uploadedImage && (
            <>
              <div className="mt-6 rounded-lg overflow-hidden border border-white/20">
                <CldImage
                  width={imageDimensions.width || 800}
                  height={imageDimensions.height || 600}
                  src={uploadedImage}
                  sizes="100vw"
                  removeBackground
                  alt="transformed image"
                  crop="fill"
                  gravity="auto"
                  ref={imageRef}
                  onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    setIsTransforming(false);
                    const img = e.currentTarget;
                    setImageDimensions({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                    });
                  }}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BGRemove;
