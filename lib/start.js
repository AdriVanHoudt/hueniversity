// Load modules

var Fs = require('fs');
var Hoek = require('hoek');
var Server = require('./index');

// Declare internals

var internals = {};

internals.manifest = {
    connections: [
        {
            port: 8000,
            labels: ['web']
        },
        {
            port: 8001,
            labels: ['web-tls'],
            tls: {
                key: Fs.readFileSync('./lib/certs/server.key'),
                cert: Fs.readFileSync('./lib/certs/server.crt')
            }
        }
    ],
    plugins: {
        './version': { select: 'web-tls' },
        './private': { select: 'web-tls' },
        './home': { select: 'web-tls' },
        './auth': {},
        'hapi-auth-basic': {}
    }
};

internals.composeOptions = {
    relativeTo: __dirname
};

Server.init(internals.manifest, internals.composeOptions, function (err, server) {

    Hoek.assert(!err, err);
    console.log('Server started at: ' + server.info.uri);
});
