import { useState } from "react";

const UploadSongForm = ({ onSongUpload }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !artist || !audioFile || !coverImage) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audioFile", audioFile);
    formData.append("coverImage", coverImage);

    try {
      const response = await fetch("http://localhost:5000/api/songs/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const result = await response.json();
      alert("Upload successful!");
      onSongUpload(result);
      setTitle("");
      setArtist("");
      setAudioFile(null);
      setCoverImage(null);
    } catch (error) {
      alert("Upload failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Song</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song Title"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={(e) => setAudioFile(e.target.files[0])}
          accept="audio/*"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={(e) => setCoverImage(e.target.files[0])}
          accept="image/*"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Upload Song
        </button>
      </form>
    </div>
  );
};

export default UploadSongForm;
