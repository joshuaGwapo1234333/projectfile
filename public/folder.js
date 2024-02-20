document.addEventListener("DOMContentLoaded", () => {
  const folderName = getFolderNameFromURL();
  document.getElementById("folderTitle").innerText = `Folder: ${folderName}`;
  loadFiles(folderName);
});
document.getElementById("searchInput").addEventListener("input", () => {
  filterFiles(document.getElementById("searchInput").value);
});

function loadFiles(folder) {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  fetch(`/files/${folder}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.files.forEach((file) => {
          const listItem = document.createElement("li");
          listItem.classList.add("file-item"); // Add a class for styling
          listItem.innerHTML = `
              <span class="file-name">${file}</span>
              <div class="button-container">
              <button onclick="viewFile('${folder}', '${file}')">view</button>
                <button onclick="downloadFile('${folder}', '${file}')">Download</button>
                <button onclick="deleteFile('${folder}', '${file}')">Delete</button>
              </div>
            `;
          fileList.appendChild(listItem);
        });
      } else {
        alert("Error loading files");
      }
    });
}
function filterFiles(query) {
  const fileList = document.getElementById("fileList");
  const files = Array.from(fileList.getElementsByTagName("li"));

  files.forEach((file) => {
    const fileName = file.textContent.toLowerCase();
    if (fileName.includes(query.toLowerCase())) {
      file.style.display = "block";
    } else {
      file.style.display = "none";
    }
  });
}

function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const folder = getFolderNameFromURL();
  const formData = new FormData();

  formData.append("file", fileInput.files[0]);

  fetch(`/upload/${folder}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("File uploaded successfully");
        loadFiles(folder);
      } else {
        alert("Error uploading file");
      }
    });
}

function viewFile(folder, file) {
  fetch(`/uploads/${folder}/${file}`)
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Display file content in a new window
      const newWindow = window.open("", "_blank");
      newWindow.document.write(`<pre>${data}</pre>`);
    })
    .catch((error) => console.error("Error:", error));
}

function downloadFile(folder, file) {
  window.location.href = `/download/${folder}/${file}`;
}

function deleteFile(folder, file) {
  if (confirm("Are you sure you want to delete this file?")) {
    fetch(`/delete/${folder}/${file}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("File deleted successfully");
          loadFiles(folder);
        } else {
          alert("Error deleting file");
        }
      });
  }
}

function getFolderNameFromURL() {
  // Assuming the URL is in the format: http://example.com/folder.html#folderName
  return window.location.hash.substring(1);
}
