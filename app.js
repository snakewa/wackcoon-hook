var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});

app.get('/stua', function (req, res) {
    res.sendStatus(200);
	console.log('get /stua');
});

app.post('/stua/beleg', function (req, res) {
	console.log('#----' + req.body.head_commit.timestamp + '----#');
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
  if(req.body.pusher.name === 'Splashcom' && req.body.repository.name === 'studienarbeit-beleg') {
    console.log('pulling code from GitHub...');
    exec('git -C ~/git/studienarbeit-beleg pull', execCallback);
  } else {
    console.log('No Splashcom or wrong repo, no pull!');
  }
  res.sendStatus(200);
  res.end();
});

app.post('/stua/project', function (req, res) {
	console.log('#----' + req.body.head_commit.timestamp + '----#');
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
  if(req.body.pusher.name === 'Splashcom' && req.body.repository.name === 'studienarbeit-project') {
    console.log('pulling code from GitHub...');
    exec('git -C /media/usb1/git/studienarbeit-project pull', execCallback);
  } else {
    console.log('No Splashcom or wrong repo, no pull!');
  }
	res.sendStatus(200);
	res.end();
});

app.post('/diplom/beleg', function (req, res) {
	console.log('#----' + req.body.head_commit.timestamp + '----#');
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
  if(req.body.pusher.name === 'Splashcom' && req.body.repository.name === 'diplomarbeit-beleg') {
    console.log('pulling code from GitHub...');
    exec('git -C /media/usb1/git/diplomarbeit-beleg pull', execCallback);
    exec("ssh -p 3724 lilly@192.168.0.102 '~/scripts/da_provider.sh'", execCallback);
  } else {
    console.log('No Splashcom or wrong repo, no pull!');
  }
	res.sendStatus(200);
	res.end();
});

app.listen(5029, function () {
	console.log('App listening on port 5029')
});

function execCallback (err, stdout, stderr) {
	if (err) console.log(err);
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
}
