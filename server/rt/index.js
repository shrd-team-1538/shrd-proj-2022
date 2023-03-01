const express = require('express');

const app = express();

app.patch('/api/rt/secret', (req, res) => {
    res.status(418).end();
})

app.listen(5050);