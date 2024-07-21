const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const fastCsv = require('fast-csv');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('CSV Data API');
});

app.get("/read-csv", (req,res)=>{
    const result = [];
    fs.createReadStream(path.join(__dirname, '../data/transactions.csv'))
    .pipe(csvParser())
    .on('data', (data)=>{
        result.push(data);
    })
    .on('end',()=>{
        res.json(result);
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
