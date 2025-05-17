document.getElementById("downloadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;
  
  const message = document.getElementById("message");
  message.innerText = "Downloading...";

  try {
    const response = await fetch("https://youtubedown-backend.onrender.com/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to download.");
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "video.mp4";
    a.click();
    URL.revokeObjectURL(downloadUrl);
    message.innerText = "Download started!";
  } catch (err) {
    message.innerText = `Error: ${err.message}`;
  }
});
