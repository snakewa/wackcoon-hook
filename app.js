var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
    console.log('get /');
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
    console.log('get /payload');
});

app.post('/payload', function (req, res) {
    console.log('#----' + req.body.head_commit.timestamp + '----#');
    console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
    // if(req.body.pusher.name === 'Splashcom' && req.body.repository.name === 'studienarbeit-beleg') {
    //   console.log('pulling code from GitHub...');
    //   exec('git -C ~/git/studienarbeit-beleg pull', execCallback);
    // } else {
    //   console.log('No Splashcom or wrong repo, no pull!');
    // }
    res.sendStatus(200);
    res.end();
});

app.listen(5029, function () {
    console.log('App listening on port 5029')
});