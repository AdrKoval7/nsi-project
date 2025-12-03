require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Успешное подключение к MongoDB...'))
    .catch(err => console.error('Не удалось подключиться к MongoDB:', err));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Бэкенд-сервер запущен на порту ${PORT}`);
});
