"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setImage(null);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.output) {
        setImage(data.output);
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        AI Image Generator
      </h1>

      <div className="flex w-full max-w-md space-x-2">
        <input
          type="text"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-3 bg-amber-400 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 outline-none"
        />
        <button
          onClick={generateImage}
          className={`px-4 py-3 text-white font-semibold rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-700">Generating...</p>}

      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="Generated"
            className="w-96 rounded-lg shadow-lg border border-green-300"
          />
        </div>
      )}
    </div>
  );
}
