let server = new Express();
let port = process.env.PORT || 3000;

server.use('/assets', Express.static);
server.use(Express.static(path.join(__dirname, '../..', 'dist/css')));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.get('/api/questions', (req, res) => {
  let {questions} = require('./mock_api');
  res.send(questions);
});


server.get('/api/users/:id', (req, res) => {
  let {getUser} = require('./mock_api');
  res.send(getUser(req.params.id));
});


server.get('/api/questions/:id', (req, res) => {
  let {getQuestion} = require('./mock_api');
  let question = getQuestion(req.params.id);
  if (question) {
    res.send(question);
  } else {
    res.status(404).send({reason: 'question not found'});
  }
});

sever.get('*', (req, res, next) => {
  require('./middlewares/universalRenderer').default(req, res, next);
})


server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went wrong...');
});

console.log(`Server is listening to port ${port}`);
server.listen(port);
