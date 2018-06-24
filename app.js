var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var execSync = require('child_process').execSync;
var localtunnel = require('localtunnel');

var port = process.env.PORT || 5000;
var tunnelSubdomain = process.env.TUNNEL_SUBDOMAIN;

var deployHardReset = process.env.DEPLOY_HARD_RESET || false;
var deployNpmInstall = process.env.DEPLOY_NPM_INSTALL || false;
var deployOnStart = process.env.DEPLOY_ON_START|| false;

app.listen(port, function () {
    console.log(`listening on port ${port}`)
});

var tunnel = false;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//navigating to root should give user info about this hook
app.get('/', function (req, res) {
    if(tunnel){
        res.send(`deploy service ready at ${tunnel.url}`);
    }else{
        res.send(`deploy service ready`);
    }
	res.end();
});


app.get('/deploy/:project*?', function (req, res) {
    let project = req.params.project ;
    if(project){
        project = `PROJECT_ROOT_${project}`.toUpperCase()
        project = process.env[project]
    }else{
        project = process.env.PROJECT_ROOT;
    }    
    deploy(project);
	res.send('deployment triggered');
	res.end();
});

app.post('/deploy/:project*?', function (req, res) {
    let payload , pusher, repo_name;
    if(req.body.payload){
        //github
        payload = JSON.parse(req.body.payload);
        pusher = payload.sender.login ;
    }else{
        //gitlab
        payload = JSON.parse(req.body);
        pusher = payload.user_name;
    }
    repo_name = payload.repository.name;
	console.log( pusher + ' just pushed to ' + repo_name);
    console.log('deploying...');
    let project = req.params.project ;
    if(project){
        project = `PROJECT_ROOT_${project}`.toUpperCase()
        project = process.env[project]
    }else{
        project = process.env.PROJECT_ROOT;
    } 
    deploy(project);
	res.sendStatus(200);
    res.end();
});

function setupLocalTunnel() {
    console.log(`try local tunnel on ${tunnelSubdomain}..`);
    localtunnel(port, { subdomain: tunnelSubdomain }, function (err, tun) {
        if (err){
            console.error('local tunnel error: ' + err);  
        } else{
            console.log(`local tunnel on ${tun.url}..`);
            tunnel = tun;
            tun.on('close', function() {
                tunnel = false
            });
        }
    });
}


function deploy(projectRoot) {

    // reset any changes that have been made locally
    if(deployHardReset){        
        console.log('resetting...');
        execSync(`git -C ${projectRoot} reset --hard`, execCallback);

        // and ditch any files that have been added locally too
        console.log('cleaning...');
        execSync(`git -C ${projectRoot} clean -df`, execCallback);
    }


	// now pull down the latest
	console.log('pulling...');
	execSync(`git -C ${projectRoot} pull -f`, execCallback);

    if(deployNpmInstall){
        // and npm install with --production
        console.log('npm installing...');
        execSync(`npm -C ${projectRoot} install --production`, execCallback);
    }
}

function execCallback(err, stdout, stderr) {
	if (stdout) console.log(stdout);
	if (stderr) console.error(stderr);
}

if(deployOnStart){
    console.log('Deploy on start..');
    deploy();
}

setupLocalTunnel();
