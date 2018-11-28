module.exports = {
    create_and_listen
}

function create_and_listen({ http, app, port }) {
    return http.createServer(app).listen(port, function create_server_callback() {
        console.log('Server http://localhost:%d', port)
        console.log('Swagger UI http://localhost:%d/docs', port)
    })
}
