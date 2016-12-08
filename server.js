const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./controllers/blog');

app.use(morgan('common'));

app.use(express.static('public'));

app.use('/blog-posts', blogRouter);
