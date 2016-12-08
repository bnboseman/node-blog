const express = require('express');
const morgan = require('morgan');

const app = express();

const blogRouter = require('./routers/blog');

app.use(morgan('common'))l

app.use(express.static('public'));

app.use('/blog-posts', blogRouter);