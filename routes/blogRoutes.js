const express = require('express')
const { getAllBlogsController, createBlogController, getBlogByIdController, deleteBlogController, updateBlogController, userBlogController } = require('../controllers/blogController')

//router object
const router = express.Router()

//GET || all bloggs
router.get('/all-blog', getAllBlogsController)

//POST || create bloggs
router.post('/create-blog', createBlogController)

//UPDATE || update blogs
router.put('/update-blog/:id', updateBlogController)

//GET || single blog details bloggs
router.get('/get-blog/:id', getBlogByIdController)

//DELETE || delete bloggs
router.delete('/delete-blog/:id', deleteBlogController)

//GET || user blog
router.get('/user-blog/:id',userBlogController)

module.exports = router