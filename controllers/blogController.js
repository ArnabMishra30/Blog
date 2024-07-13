const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

//GET ALL USERS
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate("user");
        if (!blogs) {
            return res.status(200).send({
                sucess: false,
                message: 'No Blogs Found'
            })
        }
        return res.status(200).send({
            sucess: true,
            blogCount: blogs.length,
            message: 'all blogs list',
            blogs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            sucess: false,
            message: 'No Blogs Found',
            error
        })
    }
}

//Create Blog
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body
        //validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                sucess: false,
                message: 'please provide all fields',
            })
        }
        const exisitingUser = await userModel.findById(user)
        //validation
        if (!exisitingUser) {
            return res.status(404).send({
                sucess: false,
                message: 'Unable to find user',
            })
        }
        const newBlog = new blogModel({ title, description, image, user })
        const session = await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({ session })
        exisitingUser.blogs.push(newBlog)
        await exisitingUser.save({ session })
        await session.commitTransaction();
        await newBlog.save()
        return res.status(201).send({
            sucess: true,
            message: 'Blog Created',
            newBlog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            sucess: false,
            message: 'Error while creating Blog',
            error
        })
    }
}

//update blog
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, image } = req.body
        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return res.status(200).send({
            sucess: true,
            message: 'blog updated',
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            sucess: false,
            message: 'Error while updating Blog',
            error
        })
    }
}

//Single Blog
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({
                sucess: false,
                message: 'blog not found with this id'
            })
        }
        return res.status(200).send({
            sucess: true,
            message: 'Fetch single Blog',
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            sucess: false,
            message: 'Error while getting single blog',
            error
        })
    }
}

//Delete Blog
exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel
            // .findOneAndDelete(req.params.id)
            .findByIdAndDelete(req.params.id)
            .populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            sucess: true,
            message: 'Blog Deleted'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            sucess: false,
            message: 'Error while deleteing single blog',
            error
        })
    }
}

//GET USER BLOG
exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs");
        if (!userBlog) {
            return res.status(404).send({
                success: false,
                message: "blogs not found with this id",
            });
        }
        return res.status(200).send({
            success: true,
            message: "user blogs",
            userBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            sucess: false,
            message: 'Error in user blog',
            error
        })
    }
}