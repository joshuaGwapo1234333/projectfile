const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.params.folder || '';
    const uploadPath = path.join(__dirname, 'uplN oads', folder);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static('public'));



app.get('/files', (req, res) => {
  const filesPath = path.join(__dirname, 'uploads');
  fs.readdir(filesPath, (err, files) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      const folders = files.filter(file => fs.statSync(path.join(filesPath, file)).isDirectory());
      res.json({ success: true, files: folders });
    }
  });
});


app.post('/createFolder/:folder', (req, res) => {
  const folderName = req.params.folder;
  const folderPath = path.join(__dirname, 'uploads', folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'Folder already exists' });
  }
});

app.delete('/deleteFolder/:folder', (req, res) => {
  const folderName = req.params.folder;
  const folderPath = path.join(__dirname, 'uploads', folderName);

  if (fs.existsSync(folderPath)) {
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) {
        res.json({ success: false, error: err.message });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.json({ success: false, error: 'Folder not found' });
  }
});



app.post('/upload/:folder', upload.single('file'), (req, res) => {
  res.json({ success: true, message: 'File uploaded successfully' });
});

app.get('/files', (req, res) => {
  const uploadPath = path.join(__dirname, 'uploads');

  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      res.json({ success: false, message: 'Error reading folder contents' });
    } else {
      // Filter out non-directory entries
      const folders = files.filter(file => fs.statSync(path.join(uploadPath, file)).isDirectory());
      res.json({ success: true, files: folders });
    }
  });
});

app.get('/files/:folder', (req, res) => {
  const folder = req.params.folder;
  const folderPath = path.join(__dirname, 'uploads', folder);

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      res.json({ success: false, message: 'Error reading folder contents' });
    } else {
      res.json({ success: true, files });
    }
  });
});

app.get('/download/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;
  const filePath = path.join(__dirname, 'uploads', folder, file);

  res.download(filePath);
});

app.delete('/delete/:folder/:file', (req, res) => {
  const folder = req.params.folder;
  const file = req.params.file;
  const filePath = path.join(__dirname, 'uploads', folder, file);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.json({ success: false, message: 'Error deleting file' });
    } else {
      res.json({ success: true, message: 'File deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
