module.exports = {
    run
};

function run({ http, app, port }) {
    http.createServer(app).listen(port, function create_server_callback() {
        console.log('Server http://localhost:%d', port);
        console.log('Swagger UI http://localhost:%d/docs', port);
    });
}
