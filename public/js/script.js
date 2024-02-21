document.addEventListener('DOMContentLoaded', () => {
  loadFolders();
});


function loadFolders() {
  const folderList = document.getElementById('folderList');
  folderList.innerHTML = '';

  fetch('/files')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        data.files.forEach(folder => {
          const listItem = document.createElement('li');
          const folderLink = document.createElement('a');
          folderLink.href = `/folder.html#${folder}`;
          folderLink.textContent = folder;
          listItem.appendChild(folderLink);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = () => deleteFolder(folder);

          listItem.appendChild(deleteButton);
          folderList.appendChild(listItem);
        });
      } else {
        alert('Error loading folders');
      }
    });
}
function filterFiles(query) {
  const fileList = document.getElementById('fileList');
  const files = Array.from(fileList.getElementsByTagName('li'));

  files.forEach(file => {
    const fileName = file.textContent.toLowerCase();
    if (fileName.includes(query.toLowerCase())) {
      file.style.display = 'block';
    } else {
      file.style.display = 'none';
    }
  });
}

function createFolder() {
  const folderNameInput = document.getElementById('folderName');
  const folderName = folderNameInput.value.trim();

  if (folderName === '') {
    alert('Please enter a folder name');
    return;
  }

  fetch(`/createFolder/${folderName}`, { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Folder created successfully');
        folderNameInput.value = '';
        loadFolders();
      } else {
        alert('Error creating folder');
      }
    });
}

function deleteFolder(folder) {
  const confirmed = confirm(`Are you sure you want to delete the folder "${folder}"?`);

  if (confirmed) {
    fetch(`/deleteFolder/${folder}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Folder deleted successfully');
          loadFolders();
        } else {
          alert('Error deleting folder');
        }
      });
  }
}
