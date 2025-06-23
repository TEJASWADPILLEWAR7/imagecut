"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

function SocialShare() {
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Background Removal
      </h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <>
              <div className="mt-6">
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

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
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

export default SocialShare;
