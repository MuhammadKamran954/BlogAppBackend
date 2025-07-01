const express = require('express');
const app = express();
const db = require('./../../libs/common/src/config/db');
const router = require('./blog_list/router/router');
const userRouter = require('./signup/router/signup_router');
const fileRouter = require('./get_photo/router/router');
const notificationRouter = require('./notification/router/router');
const logger = require('./../../libs/common/src/logger/logger');
process.on('uncaughtException', (err) => {
    logger.error(JSON.stringify({
      type: "UNCAUGHT_EXCEPTION",
      message: err.message,
      stack: err.stack
    }));
    process.exit(1);
  });
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(JSON.stringify({
      type: "UNHANDLED_REJECTION",
      reason,
      stack: reason?.stack || 'No stack available'
    }));
  });
app.use(express.json());

app.use((req, res, next) => {
    const reqLog = {
        type: "REQUEST",
        method: req.method,
        url: req.originalUrl,
        body: req.body
      };
      logger.info(JSON.stringify(reqLog));
          next();
});

 app.use((req, res, next) => {
    const oldSend = res.send;
    
    res.send = function (data) {
         res.on('finish', () => {
             let responseBody = data;

             if (typeof data === 'object' && data !== null) {
                responseBody = JSON.stringify(data, null, 2);
            }

            const logMessage = {
                type: "RESPONSE",
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                body: JSON.parse(responseBody)
              };
              logger.info(JSON.stringify(logMessage));
                      });

         oldSend.apply(res, arguments);
    };

    next();
});

app.use('',notificationRouter);
app.use('',router);
app.use('',userRouter);
app.use('',fileRouter);


  

require('dotenv').config();
const port = process.env.AUTH_PORT || 3000;
const blogs = require('./blog_list/model/blog');
const users = require('./signup/model/user');
const userNotification = require('./notification/model/user_notification');

db.connect().then(() => {
    console.log('Connected to the database');
    blogs(); 
    users();
    userNotification();
}).catch((err) => {
    console.error('Database connection error:', err.stack);
});


app.use((err, req, res, next) => {
    const errorLog = {
      type: "ERROR",
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack
    };
    logger.error(JSON.stringify(errorLog));
    logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}\n${err.stack}`);
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  });
  



app.listen(port, () =>{
    console.log(`Server is running on port http://localhost:${port}`);
})
