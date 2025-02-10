'use client'

import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";

const ImageProcessing = () => {
  const [image, setImage] = useState<File|null>(null);
  const [caption, setCaption] = useState("");
  const [advertisement, setAdvertisement] = useState("");
  const [loading, setLoading] = useState(false);
  const userid = sessionStorage.getItem("user_id") || "";
  const api = sessionStorage.getItem("api") || "";
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    setCaption("");
    setAdvertisement("");
  };

  const generateCaption = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }
    
    setLoading(true);

    const router = useRouter();
    if (!userid || !api) {
      router.push("/");
      return;
    } 
    const formData = new FormData();
    formData.append("file", image);
    formData.append("user_id", userid);
    formData.append("api", api); 
    try {
      const response = await fetch("http://localhost:8000/image/caption", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setCaption(data.caption || "Failed to generate caption. Login using correct API");
    } catch (error) {
      console.error("Error generating caption:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdvertisement = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/image/advertisement", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id: userid, apikey: api}),
      });

      const data = await response.json();
      setAdvertisement(data.advertisement || "Failed to generate advertisement. Login using correct API");
    } catch (error) {
      console.error("Error generating advertisement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex flex-col items-center py-10 px-4 overflow-hidden">
    <div className="background"></div>
      <h1 className="img_title">Image Tools</h1>

      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 block w-full"
        />

        {image && (
          <p className="text-gray-600 mb-4">
            <strong>Selected File:</strong> {image.name}
          </p>
        )}

        <button
          onClick={generateCaption}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Generating Caption..." : "Generate Caption"}
        </button>

        {caption && (
          <details className="mt-4 bg-gray-200 p-4 rounded text-slate-950">
            <summary className="cursor-pointer font-semibold">Show Caption</summary>
            <div className="mt-2">
              <strong>Caption:</strong> {caption}
            </div>
          </details>
        )}
        <hr className="my-6" />
        
        <button
          onClick={generateAdvertisement}
          className="w-full bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
          disabled={loading}
        >
          {loading ? "Generating Advertisement..." : "Generate Advertisement"}
        </button>

        {advertisement && (
          <div className="mt-4 bg-gray-100 text-slate-900 p-4 rounded border-2 border-black">
            <strong>Advertisement:</strong> {advertisement}
          </div>
        )}
      </div>
      <style jsx>{`
        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgb(255,118,206);
          background: linear-gradient(45deg, rgba(255,118,206,1) 25%, rgba(165,122,223,1) 75%);          
          filter: blur(10px);
          z-index: -1;
        }
      `}</style>
    </div>
    </>
  );
};

export default ImageProcessing;
