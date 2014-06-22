var bodyParser = require("body-parser")
  , express = require("express")
  , nconf = require('nconf')
  , restler = require('restler')
;

// Load configuration
nconf.argv()
    .env()
    .file({ file: 'config.json' });

nconf.defaults({
    'BITPAY_API_KEY': '',
    'PORT': 3000
});

function sendToBitpay(req, res, next) {
    var invoice = req.body;
    console.log(invoice);

    restler.postJson('https://bitpay.com/api/invoice',
		     invoice,
		     {
			 username: nconf.get('BITPAY_API_KEY'),
			 password: ''
		     }
		    ).on('complete', function(data, response) {
			if (response.statusCode == 200) {
			    res.header('Location', data.url );
			    res.send(302);
			}
		    });
}

var app = express();
app.use(bodyParser.urlencoded());

app.route('/')
  .post(sendToBitpay);

// Launch server
var server = app.listen(nconf.get('PORT'), function() {
    console.log('Listening on port %d', server.address().port);
});
