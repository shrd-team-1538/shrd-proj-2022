const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'dist')));


if (process.env.NODE_ENV === 'production') {
    app.get("*", (req,res) => {
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), 'utf8', (err, data) => {
            if (err) return res.status(500);
            res.status(200).end(data);
        })
    })
}

app.listen(7070)