const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
})

app.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}`);
})