"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialShare = keyof typeof socialFormats;

function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialShare>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

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

      if (!response.ok) throw new Error("Failed to upload image");

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
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl text-white">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
        Social Media Image Creator
      </h1>

      <div className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload an Image</h2>
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-white/80">
              Choose an image file
            </span>
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="file-input file-input-bordered file-input-primary w-full"
          />
        </div>

        {isUploading && (
          <div className="mb-6">
            <progress className="progress progress-primary w-full" />
          </div>
        )}

        {uploadedImage && (
          <>
            <h2 className="text-xl font-medium mb-3 mt-8">Select Format</h2>
            <select
              className="select select-bordered w-full mb-6"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as SocialShare)}
            >
              {Object.keys(socialFormats).map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>

            <div className="relative mt-6 mb-8 rounded-xl overflow-hidden shadow-md">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <div className="flex justify-center items-center bg-black rounded-lg p-4">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <span className="loading loading-spinner loading-lg text-white"></span>
                  </div>
                )}
                <CldImage
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  sizes="100vw"
                  alt="transformed image"
                  crop="fill"
                  gravity="auto"
                  ref={imageRef}
                  onLoad={() => setIsTransforming(false)}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="btn btn-primary px-6 py-2 rounded-xl"
              >
                Download for {selectedFormat}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SocialShare;
