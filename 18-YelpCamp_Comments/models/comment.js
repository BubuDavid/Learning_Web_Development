var mongoose = require('mongoose');

// Schema of the comments:
var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});


module.exports = mongoose.model("Comment", commentSchema)