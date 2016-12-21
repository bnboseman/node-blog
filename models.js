const mongoose = require('mongoose');

// this module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// don't worry to much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


const BlogPostSchema = mongoose.Schema({
    id: {type: String},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {
      firstName: String,
      lastName: String
    },
    created: {type: Number, required: true}
});

BlogPostSchema.virtual('authorName').get(function() {
    console.log(this);
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

BlogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created

  }
};
const BlogPosts = mongoose.model('Blog', BlogPostSchema)

module.exports = {BlogPosts};
