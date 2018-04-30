module.exports = {
    run
};

function run({ http, app, port }) {
    http.createServer(app).listen(port, function create_server_callback() {
        console.log('Server is on %d (http://localhost:%d)', port, port);
        console.log('Swagger-ui is on http://localhost:%d/docs', port);
    });
}
