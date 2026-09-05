const Comment = require("../models/comment");

const createComment = async (req, res, next) => {
    try {
        const { text, author, post } = req.body;

        const comment = new Comment({
            text,
            author,
            post
        });

        await comment.save();

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });
    }
    catch (error) {
        next(error);
    }
};


const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find()
            .populate("author")
            .populate("post");

        return res.status(200).json({
            comments
        });
    }
    catch (error) {
        next(error);
    }
};


const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId
        }).populate("author");

        return res.status(200).json({
            comments
        });
    }
    catch (error) {
        next(error);
    }
};


module.exports = {
    createComment,
    getAllComments,
    getPostComments
};