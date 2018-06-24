# wackcoon-hook

To receive a git repo push event webhooks to trigger a deployment. Exposes the listener server via local tunnel.

# usage

`
PORT=9991 PROJECT_ROOT=/home/user/project1 PROJECT_ROOT_PROJ2=/home/user/project2 TUNNEL_SUBDOMAIN
=XXXX-XXXX-XXXX npm start
`