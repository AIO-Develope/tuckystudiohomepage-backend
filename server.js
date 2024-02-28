const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2087;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(uploadsDir, 'temp');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
