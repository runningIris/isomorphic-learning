let server = new Express();
let port = process.env.PORT || 3000;

server.use('/assets', Express.static)
