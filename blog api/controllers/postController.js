const Post = require("../models/post");

const createPost = async (req, res, next) => {
    try {
        const { title, content, author } = req.body;

        const post = new Post({
            title,
            content,
            author
        });

        await post.save();

        return res.status(201).json({
            message: "Post created successfully",
            post
        });
    }
    catch (error) {
        next(error);
    }
};


const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate("author");

        return res.status(200).json({
            posts
        });
    }
    catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            post
        });
    }
    catch (error) {
        next(error);
    }
};


const updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content },
            {
                new: true,
                runValidators: true
            }
        ).populate("author");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Post updated successfully",
            post
        });
    }
    catch (error) {
        next(error);
    }
};


const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};