module.exports = {
    apps: [{
        name: 'Web Api',
        script: 'index.js',
        env: {
            NODE_ENV: 'development',
            NODE_PATH: '.'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
}

// pm2 start ecosystem.config.js --node-args "--use_strict"
