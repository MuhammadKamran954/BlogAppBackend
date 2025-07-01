const checkApiKey = require('./../../../../libs/common/src/jwt/jwt_strategy');
const express = require('express');
const router = express.Router();
const {
    blogListController,
    uploadBlogController,
    blogListLoginUserController,
    editBlogController,
    deleteBlogController,
    activeBlogController,
    approveBlogController,
    getBlogByIdController } = require('./../controller/controller');
const upload = require('./../../../../libs/common/src/multer/multer');

router.get('/blogs', checkApiKey, blogListController);
router.post('/upload_blogs', upload.single('image'), uploadBlogController);
router.get('/login_user_blog_list', blogListLoginUserController);
router.patch('/edit_blog', upload.single('image'), editBlogController);
router.delete('/delete_blog', deleteBlogController);
router.post('/activate_blog', activeBlogController);
router.post('/approve_blog', approveBlogController);
router.get('/get_blog_by_id',getBlogByIdController);


module.exports = router;
