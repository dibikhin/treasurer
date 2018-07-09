const winston = require('winston')

module.exports = init()

function init() {
    const options = {
        file: {
            level: 'debug',
            filename: '/home/roman/projects/treasurer/wep_api/logs/app.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            // format: winston.format.simple(),
            json: false,
            colorize: true,
        },
    }
    const winston_logger = winston.createLogger({
        transports: [new winston.transports.File(options.file)],
        exitOnError: false,
    })
    if (process.env.NODE_ENV !== 'production') {
        winston_logger.add(new winston.transports.Console(options.console))
    }
    // for morgan
    winston_logger.stream = {
        write: function (message) {
            winston_logger.info(message)
        },
    }
    return winston_logger
}
