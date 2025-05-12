document.getElementById("downloadForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const url = document.getElementById("url").value.trim();
    const type = document.getElementById("type").value;
    const quality = document.getElementById("quality").value;
  
    fetch("https://youtubedown-backend.onrender.com/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, type, quality })
    })
    .then(res => res.blob())
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "youtube_download.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      document.getElementById("message").innerText = "✅ Download started!";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("message").innerText = "❌ Failed to download.";
    });
  });
  
