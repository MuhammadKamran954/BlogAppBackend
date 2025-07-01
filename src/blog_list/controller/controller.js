const {
    blogListService,
    uploadBlogService,
    blogListLoginUserService,
    editBlogService,
    deleteBlogService,
    activeBlogService,
    approveBlogService,
    getBlogByIdServices } = require('./../service/service');
const { verifyTokenAndGetPayload } = require('./../../../../libs/common/src/jwt/token_helper');


async function blogListController(req, res) {
    const response = await blogListService();
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    }
    else {
        return res.status(400).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    }
}


async function uploadBlogController(req, res) {
    const blog = req.body;
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;

    const userId = tokenResult.decoded.id;
    const image = req.file ? req.file.filename : null;

    const response = await uploadBlogService(blog, userId, image);
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message,
            data: response.data,
            image: response.image
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    }
}


async function blogListLoginUserController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;

    const userId = tokenResult.decoded.id;
    const response = await blogListLoginUserService(userId);
    if (response && response.success) {
        return res.status(200).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}

async function editBlogController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;
    const userId = tokenResult.decoded.id;
    const blogId = req.query.id;
    const blog = req.body;
    const image = req.file ? req.file.filename : null;
    const response = await editBlogService(userId, blogId, blog, image);
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }

}


async function deleteBlogController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;
    const userId = tokenResult.decoded.id;
    const blogId = req.query.id;
    const response = await deleteBlogService(userId, blogId);
    if (response && response.success) {
        return res.status(200).json({
            success: response.success,
            message: response.message
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}

async function activeBlogController(req,res) {
        const tokenResult = verifyTokenAndGetPayload(req, res);
        if (!tokenResult.success) return;
        const userId = tokenResult.decoded.id;
        const blogId = req.query.id;
        const response = await activeBlogService(userId, blogId);
        if (response && response.success) {
            return res.status(200).json({
                success: response.success,
                message: response.message
            })
        } else {
            return res.status(400).json({
                success: response.success,
                message: response.message
            })
        }
}

async function approveBlogController(req,res) {
    const tokenResult = verifyTokenAndGetPayload(req,res);
    if(!tokenResult.success) return;
    const userId =tokenResult.decoded.id;
    const blogId = req.query.id;
    const response = await approveBlogService(userId,blogId);
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message,
            data: response.data
         })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}
async function getBlogByIdController(req,res) {
    const tokenResult = verifyTokenAndGetPayload(req,res);
    if(!tokenResult.success) return;

    const userId = tokenResult.decoded.id;
const blogId = req.query.id;
const response = await getBlogByIdServices(userId,blogId);
if(response.success){
    return res.status(200).json({
        success:response.success,
        message:response.message,
        data:response.data
    })
}else{
    return res.status(400).json({
        success:response.status,
        message:response.message
    })
}
}

module.exports = {
    blogListController,
    uploadBlogController,
    blogListLoginUserController,
    editBlogController,
    deleteBlogController,
    activeBlogController,
    approveBlogController,
    getBlogByIdController
};