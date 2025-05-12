const BACKEND_URL = 'https://youtubedown-backend.onrender.com'; // 🔁 Replace with your actual Render backend URL

document.getElementById("downloadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const url = document.getElementById("url").value.trim();
  const type = document.getElementById("type").value;
  const quality = document.getElementById("quality").value;

  if (!url) {
    document.getElementById("message").innerText = "❌ Please enter a valid YouTube URL.";
    return;
  }

  document.getElementById("message").innerText = "⏳ Downloading, please wait...";

  fetch(`${BACKEND_URL}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url, type, quality })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Server error: " + res.statusText);
    }
    return res.blob();
  })
  .then(blob => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "youtube_download." + (type === "audio" ? "mp3" : "mp4");
    document.body.appendChild(a);
    a.click();
    a.remove();

    document.getElementById("message").innerText = "✅ Download started!";
  })
  .catch(err => {
    console.error("❌ Download failed:", err);
    document.getElementById("message").innerText = "❌ Failed to download. Check the URL or try again.";
  });
});
