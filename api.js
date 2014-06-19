var restify = require('restify')
  , nconf = require('nconf')
;

// Load configuration
nconf.argv()
    .env()
    .file({ file: 'config.json' });

nconf.defaults({
    'PORT': 3000
});

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(nconf.get('PORT'), function() {
  console.log('%s listening at %s', server.name, server.url);
});
