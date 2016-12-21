const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('../models');

router.get('/', (request, response) => {
	BlogPosts
		.find()
		.exec()
		.then(posts => {
			response.json(posts.map(post => post.apiRepr()));
		})
		.catch(error => {
			console.log(error);
			response.status(500).json({error: 'Something Happened'})
		})
});

router.post('/', (request, response) => {
	const requiredFields = ['title', 'content', 'author'];
    requiredFields.forEach(field => {
		if (!(field in request.body)) {
            response.status(400).json(
				{error: `Missing "${field}" in request body`});
		}
    });

    BlogPosts
        .create({
            title: request.body.title,
            content: request.body.content,
            author: request.body.author,
			created: Date.now()
        })
        .then(blogPost => response.status(201).json(blogPost.apiRepr()))
        .catch(error => {
            console.error(error);
            response.status(500).json({error: 'Error'});
        });

});

router.delete('/:id', (request, response) => {
	BlogPosts
		.findByIdAndRemove(request.params.id)
		.exec()
		.then(() => {
		response.status(204).json({message: `Deleted post ${request.params.id}`})
		});
});

router.put('/:id', (request, response) => {
	if (!(request.params.id && request.body.id && request.params.id === request.body.id)) {
		response.status(400).json({error: 'IDs must match'});
	}

	const update = {};
	const updateFields = ['title', 'content','author'];
    updateFields.forEach(field => {
        if (field in request.body) {
            update[field] = request.body[field];
        }
	});

    BlogPosts
		.findByIdAndUpdate(request.params.id, {$set: update}, {new: true})
		.exec()
		.then( post => {
			response.status(201).json(post.apiRepr());
		})
		.catch(error => {response.status(500)});
});

module.exports = router;
