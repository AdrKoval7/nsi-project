const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const referencesMetadata = [
    { code: 'NSI_021', name: 'Классификатор цветов кузова', type: 'Защищенный', date_start: '2021-05-31', date_end: '3000-01-01' },
    { code: 'NSI_026', name: 'Перечень видов подвески', type: 'Защищенный', date_start: '2021-05-31', date_end: '3000-01-01' },
    { code: 'NSI_027', name: 'Перечень положений рулевого колеса', type: 'Защищенный', date_start: '2021-05-31', date_end: '3000-01-01' },
    { code: 'NSI_054', name: 'Тип кузова', type: 'Пользовательский', date_start: '2021-05-31', date_end: '3000-01-01' },
    { code: 'NSI_047', name: 'Расположение двигателя', type: 'Технологический', date_start: '2021-05-31', date_end: '3000-01-01' }
];

router.get('/references', async (req, res) => {
    const { code, name, type, page = 1, limit = 4 } = req.query;
    let results = [...referencesMetadata];

    if (code) {
        results = results.filter(r => r.code.toLowerCase().includes(code.toLowerCase()));
    }
    if (name) {
        results = results.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (type) {
        results = results.filter(r => r.type === type);
    }

    const total = results.length;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = results.slice(startIndex, endIndex);

    res.json({ items: paginatedItems, total });
});

router.get('/references/meta/:code', async (req, res) => {
    const { code } = req.params;
    const metadata = referencesMetadata.find(r => r.code === code);
    if (metadata) {
        return res.json(metadata);
    } else {
        return res.status(404).json({ message: 'Метаданные для справочника не найдены' });
    }
});

router.get('/references/:code', async (req, res) => {
    try {
        const collectionName = req.params.code;
        const collection = mongoose.connection.db.collection(collectionName);

        const { page = 1, limit = 4 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = {};
        for (const key in req.query) {
            if (key.startsWith('q_') && req.query[key]) {
                const fieldName = key.substring(2);
                const searchValue = req.query[key];
                if (fieldName === 'code') {
                    const numericValue = parseInt(searchValue);
                    if (!isNaN(numericValue)) {
                        filter[fieldName] = numericValue;
                    }
                } else {
                    filter[fieldName] = { $regex: searchValue, $options: 'i' };
                }
            }
        }

        const [items, total] = await Promise.all([
            collection.find(filter).skip(skip).limit(parseInt(limit)).toArray(),
            collection.countDocuments(filter)
        ]);

        return res.json({ items, total });

    } catch (error) {
        console.error(`ОШИБКА НА СЕРВЕРЕ для ${req.params.code}:`, error);
        return res.status(500).json({ message: 'Ошибка на сервере', error: error.message });
    }
});

module.exports = router;
