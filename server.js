const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
// logging out env vars
// console.log(process.env);

const app = require('./app');


// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});        