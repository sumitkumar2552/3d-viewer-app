const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json());

app.use('/uploads', require('express').static('uploads'))

app.use('/api/auth', require('./routes/auth'));
app.use('/api/objects', require('./routes/objects'));

app.get('/', (req, res) => {
  res.json({ message: '3D Viewer API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});