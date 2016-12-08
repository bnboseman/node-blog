const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

router.get('/', (request, response) => {
	response.json(BlogPosts.get());
});

router.post('/', (request, response) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in request.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
		}
	}

	const post = BlogPost.create(request.body.title, request.body.content, request.body.author, request.body.date);
	response.status(201).json(post);

});

router.delete('/:id', (request, response) => {
	BlogPosts.delete(request.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    response.status(204).end();
});

router.put('/:id', (request, response) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];

		if (!(field in request.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return response.status(400).send(message);
		}
	}

    if (request.params.id !== request.body.id) {
        const message = (
            `Request path id (${request.params.id}) and request body id `
                `(${request.body.id}) must match`);
        console.error(message);
        return response.status(400).send(message);
    }

    BlogPosts.update({
    	title:  request.body.title,
		content: request.body.content,
		author: request.body.author,
        publishDate: request.body.date
	});

});

module.exports = router;
