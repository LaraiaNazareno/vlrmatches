const express = require('express');
const { getMatches } = require('./controller');
const app = express();

app.get('/:teamName', getMatches);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});