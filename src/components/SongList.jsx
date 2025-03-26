const fetchSongs = async () => {
  try {
    const response = await fetch("https://sachusicplayer.onrender.com/api/songs");
    const data = await response.json();
    setSongs(data);
  } catch (error) {
    console.error("❌ Error fetching songs:", error);
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();

  if (!password) {
    alert("⚠️ Please enter admin password!");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("password", password);

  if (audioFile) formData.append("audioFile", audioFile);
  if (coverImage) formData.append("coverImage", coverImage);

  try {
    const response = await fetch(
      `https://sachusicplayer.onrender.com/api/songs/${editingSong._id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const result = await response.json();
    if (response.ok) {
      alert("✅ Song updated successfully!");
      fetchSongs();
      setEditingSong(null);
      setPassword("");
    } else {
      alert(result.error || "❌ Failed to update song!");
    }
  } catch (error) {
    console.error("❌ Update failed:", error);
  }
};

const handleDelete = async (songId) => {
  const confirmPassword = prompt("🔐 Enter Admin Password to Delete:");

  if (!confirmPassword) {
    alert("⚠️ Password is required to delete!");
    return;
  }

  try {
    const response = await fetch(
      `https://sachusicplayer.onrender.com/api/songs/${songId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: confirmPassword }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      alert("✅ Song deleted successfully!");
      fetchSongs();
    } else {
      alert(result.error || "❌ Failed to delete song!");
    }
  } catch (error) {
    console.error("❌ Deletion failed:", error);
  }
};
