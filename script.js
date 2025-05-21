const form = document.getElementById("downloadForm");
const message = document.getElementById("message");

// Optional: show a progress bar
let progressBar = document.createElement("progress");
progressBar.id = "progressBar";
progressBar.max = 100;
progressBar.value = 0;
progressBar.style.width = "100%";
progressBar.style.display = "none";
message.parentNode.insertBefore(progressBar, message.nextSibling);

let intervalId;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("url").value;
  const type = document.getElementById("type").value;
  const quality = document.getElementById("quality").value;

  message.innerText = "Preparing download...";
  progressBar.style.display = "block";
  progressBar.value = 0;

  intervalId = setInterval(pollProgress, 1000);

  try {
    const response = await fetch("https://youtubedown-backend.onrender.com/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type, quality }),
    });

    clearInterval(intervalId);
    progressBar.style.display = "none";

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to download.");
    }

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = type === "audio" ? "audio.mp3" : "video.mp4";
    a.click();
    URL.revokeObjectURL(downloadUrl);
    message.innerText = "Download started!";
  } catch (err) {
    clearInterval(intervalId);
    progressBar.style.display = "none";
    message.innerText = `Error: ${err.message}`;
  }
});

async function pollProgress() {
  try {
    const response = await fetch("https://youtubedown-backend.onrender.com/progress");
    if (response.ok) {
      const data = await response.json();
      if (data.progress !== undefined) {
        message.innerText = `Downloading: ${data.progress}% (${(data.downloaded / 1024 / 1024).toFixed(2)} MB of ${(data.total / 1024 / 1024).toFixed(2)} MB) - ETA: ${data.eta}s`;
        progressBar.value = data.progress;
      }
    }
  } catch (err) {
    console.error("Error fetching progress:", err);
  }
}
