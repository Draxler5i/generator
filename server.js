const app = require('./app');
const database = require('./database/database');

const port = 3002;
app.listen(port, () => console.log(`Server running on port ${port}`) );