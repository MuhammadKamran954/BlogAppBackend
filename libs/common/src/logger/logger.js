const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');


const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join('logs', '%DATE%-app.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive:false,
    maxSize: '20m',
    maxFiles: '7d',
    level: 'info'
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
            try {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage && typeof parsedMessage === 'object') {
                    return `${timestamp} [${level}] - ${JSON.stringify(parsedMessage, null, 2)}`;
                }

                return `${timestamp} [${level}] - ${message}`;
            } catch (e) {
                 return `${timestamp} [${level}] - ${message}`;
            }
        })
    ),
    transports: [
        new transports.Console(),
        dailyRotateFileTransport,
        new transports.File({ filename: 'logs/error.log',level: 'error' })
    ]
});

module.exports = logger;
