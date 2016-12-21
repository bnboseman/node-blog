const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const blogRouter = require('./controllers/blog');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use('/blog-posts', blogRouter);

const {DATABASE_URL, PORT} = require('./config');

mongoose.Promise = global.Promise;
let server;
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, error => {
            if (error) {
                return reject(error);
            }
        });

        server = app.listen(PORT, () => {
            console.log(`Your app is listening on port ${PORT}`);
            resolve();
        })
        .on('error', error => {
            mongoose.disconnect();
            reject(error);
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(error => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
