const db = require('../../../../libs/common/src/config/db');

async function blogListService() {
    try {
        const result = await db.query('SELECT * FROM blogs WHERE is_active = $1 AND is_verified = $2 ORDER BY created_at DESC', [true, true]);
        const blogs = result.rows || result[0] || result;


        if (blogs && blogs.length > 0) {
            return {
                success: true,
                message: 'Blogs retrieved successfully',
                data: blogs
            };
        } else {
            return {
                success: false,
                message: 'No blogs found',
                data: []
            };
        }
    } catch (error) {
        console.Error(`error finding blog:${error.message}`)
        return {
            success: false,
            message: 'Something went wrong',
            data: []
        };
    }
}


async function uploadBlogService(blogs, userId, image) {
    try {
        const user = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if (user.rows.length == 0) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        const { title, content } = blogs;
        const fullName = user.rows[0].first_name + ' ' + user.rows[0].last_name;
        const query = `INSERT INTO blogs (title, content, image, author,user_id, is_active) VALUES ($1, $2, $3, $4,$5, $6) RETURNING id`;
        const values = [title, content, image, fullName, userId, true];
        const ourBlog = await db.query(query, values);
        const blogId = ourBlog.rows[0].id;
        const userNotificationQuery = `INSERT INTO user_notifications (title, content, user_id, blog_id, recipient_type) VALUES ($1, $2, $3, $4, $5)`;
        const userNotificationValues = [`Your blog ${title} was successfully uploaded!`,
            content,
            userId,
            blogId, 'author'];
        await db.query(userNotificationQuery, userNotificationValues);
        const adminNotificationQuery = `INSERT INTO user_notifications (title, content, user_id, blog_id, recipient_type) VALUES ($1, $2, $3, $4, $5)`;
        const adminNotificationValues = [`A new blog titled ${title} has been uploaded by ${fullName}.`,
        `Check out the new blog titled ${title}.`,
            userId,
            blogId, 'admin'];
        await db.query(adminNotificationQuery, adminNotificationValues);
        return {
            success: true,
            message: 'Blog uploaded successfully',
            data: blogs,
            image: image
        };
    } catch (error) {
        console.error(`error finding uploading blog service:${error.message}`)
        return {
            success: false,
            message: `Something went wrong`
        };
    }
}

async function blogListLoginUserService(userId) {
    try {
        const blogList = await db.query(
            'SELECT * FROM blogs WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return {
            success: true,
            message: 'Blogs retrieved successfully',
            data: {
                total: blogList.rowCount,
                blogs: blogList.rows  
            }
        };
    } catch (error) {
        console.error(`Error in serving the blogs list: ${error.message}`);
        return {
            success: false,
            message: 'Something went wrong'
        };
    }
}


async function editBlogService(userId, blogId, blog, image) {

    console.log(`here is the blogId: ${blogId} and userId: ${userId}  and image: ${image}`);
    const user = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    if (user.rows.length == 0) {
        return {
            success: false,
            message: 'User not found'
        };
    }
    const ourBlog = await db.query(`SELECT * FROM blogs WHERE id = $1`, [blogId]);
    if (ourBlog.rows.length == 0) {
        return {
            success: false,
            message: 'Blog not found'
        };
    }
    if (userId != ourBlog.rows[0].user_id) {
        return {
            success: false,
            message: 'You are not authorized to edit this blog'
        };
    }
    try {
        const currentBlog = ourBlog.rows[0];

        const updatedTitle = blog.title?.trim() || currentBlog.title;
        const updatedContent = blog.content?.trim() || currentBlog.content;
        const updatedImage = image ?? currentBlog.image;
        await db.query(`UPDATE blogs SET title  = $1, content = $2, image = $3 WHERE id = $4`, [updatedTitle, updatedContent, updatedImage, blogId]);

        const userNotificationQuery = `INSERT INTO user_notifications (title, content, user_id, blog_id, recipient_type) VALUES ($1, $2, $3, $4, $5)`;
        const userNotificationValues = [`Your blog ${updatedTitle} was successfully edited!`,
            updatedContent,
            userId,
            blogId, 'author'];
        await db.query(userNotificationQuery, userNotificationValues);
        const adminNotificationQuery = `INSERT INTO user_notifications (title, content, user_id, blog_id, recipient_type) VALUES ($1, $2, $3, $4, $5)`;
        const adminNotificationValues = [`A new blog titled ${updatedTitle} has been edited by ${currentBlog.author}.`,
        `Check out the new blog titled ${updatedTitle}.`,
            userId,
            blogId, 'admin'];
        await db.query(adminNotificationQuery, adminNotificationValues);
        return {
            success: true,
            message: 'Blog edited successfully',
            data: {
                id: blogId,
                title: updatedTitle,
                content: updatedContent,
                image: updatedImage
            }
        };
    } catch (error) {
        console.error(`error editing active blog service:${error.message}`)
        return {
            success: false,
            message: `Something went wrong`
        };
    }
}

async function deleteBlogService(userId, blogId) {
    const user = await db.query(` SELECT * FROM users WHERE id = $1`, [userId]);
    if (user.rows.length == 0) {
        return {
            success: false,
            message: 'User not found'
        };
    }
    if (isNaN(blogId)) {
        return {
            success: false,
            message: 'Blog id is Invalid'
        };
    }
    const ourBlog = await db.query(`SELECT * FROM blogs WHERE id = $1`, [blogId]);
    if (ourBlog.rows.length == 0) {
        return {
            success: false,
            message: 'Blog not found'
        };
    }
    if (userId != ourBlog.rows[0].user_id) {
        return {
            success: false,
            message: 'You are not authorized to delete this blog'
        };
    }
    try {
        await db.query(`DELETE FROM blogs WHERE id = $1`, [blogId]);
        return {
            success: true,
            message: 'Blog deleted successfully'
        };
    } catch (error) {
        console.error(`error finding deleting blog service:${error.message}`)
        return {
            success: false,
            message: `something went wrong`
        };
    }

}

async function activeBlogService(userId, blogId) {
    const user = await db.query(` SELECT * FROM users WHERE id = $1`, [userId]);
    if (user.rows.length == 0) {
        return {
            success: false,
            message: 'User not found'
        };
    }
    if (isNaN(blogId)) {
        return {
            success: false,
            message: 'Blog id is Invalid'
        };
    }
    const ourBlog = await db.query(`SELECT * FROM blogs WHERE id = $1`, [blogId]);
    if (ourBlog.rows.length == 0) {
        return {
            success: false,
            message: 'Blog not found'
        };
    }
    if (userId != ourBlog.rows[0].user_id) {
        return {
            success: false,
            message: 'You are not authorized for this action'
        };
    }
    try {
        await db.query(`UPDATE blogs SET is_active = NOT is_active WHERE id = $1`, [blogId]);
        return {
            success: true,
            message: 'Blog status updated successfully'
        };
    } catch (error) {
        console.error(`error finding active blog service:${error.message}`)
        return {
            success: false,
            message: `something went wrong`
        };
    }

}

async function approveBlogService(userId, blogId) {
    try {
        if (isNaN(blogId)) {
            return {
                success: false,
                message: 'Blog ID is invalid'
            };
        }

        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        if (user.role !== 'admin') {
            return {
                success: false,
                message: 'You are not authorized to approve this blog'
            };
        }

        const blogResult = await db.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
        const blog = blogResult.rows[0];

        if (!blog) {
            return {
                success: false,
                message: 'Blog not found'
            };
        }

        await db.query('UPDATE blogs SET is_verified = $1 WHERE id = $2', [true, blogId]);

        return {
            success: true,
            message: 'Blog approved successfully'
        };

    } catch (error) {
        console.error(`error approve active blog service:${error.message}`)
        return {
            success: false,
            message: `Something went wrong`
        };
    }
}

async function getBlogByIdServices(userId, blogId) {
    try {
        const blogResult = await db.query(`SELECT * FROM blogs WHERE id = $1`, [blogId]);

        if (blogResult.rows.length === 0) {
            return {
                success: false,
                message: 'Blog not found',
            };
        }

        const blog = blogResult.rows[0];

        const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);

        if (userResult.rows.length === 0) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        const user = userResult.rows[0];

        const isAdmin = user.role === 'admin';
        const isOwner = blog.user_id === userId;

        if (!isAdmin && !isOwner) {
            return {
                success: false,
                message: 'Not authorized to access this blog',
            };
        }

        return {
            success: true,
            message: 'Blog fetched successfully',
            data: { blog },
        };

    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        return {
            success: false,
            message: `something went wrong`,
        };
    }
}






module.exports = {
    blogListService,
    uploadBlogService,
    blogListLoginUserService,
    editBlogService,
    deleteBlogService,
    activeBlogService,
    approveBlogService,
    getBlogByIdServices
};