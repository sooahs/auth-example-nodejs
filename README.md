# Merus Auth Example for Node.js

This is an example application illustrating how to use OAuth with the
Merus API.

The example app uses [Passport](https://github.com/jaredhanson/passport)
for OAuth.

## Getting Started

Create an app:

    curl -u user@example.com \
         -d "name=Example Application" \
         -d "redirect_uri=http://localhost:5000/auth/merus/callback" \
         https://api.meruscase.com/v1/apps

Install dependencies:

    npm install

Set your environment:

    export MERUS_CLIENT_ID=123
    export MERUS_SECRET_KEY=abcdef12-3456-7890-abcd-ef1234567890
    export MERUS_BASE_URL=https://api.meruscase.com
    export SECRET_KEYS=abc123,def456

Start the server:

    npm start
