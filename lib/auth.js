// Load modules

var Users = require('./users.json');

// Declare internals

var internals = {};


internals.validateFunc = function (username, password, callback) {

    var user = Users[username];
    if (!user || user.password !== password) {
        return callback(null, false);
    }

    user.username = username;

    return callback(null, true, user);
};


exports.register = function (server, options, next) {

    // Code inside the callback function of server.dependency will only be
    // executed after hapi-auth-basic have been registered.  It's triggered by
    // server.start, and runs before actual starting of the server.  It's done because
    // the call to server.auth.strategy upon registration would fail and make the
    // server crash if the basic scheme is not previously registered by hapi-auth-basic.
    server.dependency('hapi-auth-basic', function (server, next){

        server.auth.strategy('basic', 'basic', { validateFunc: internals.validateFunc });

        // only apply to http connection
        server.select('web').route({
            method: '*',
            path: '/{p*}',
            handler: function (request, reply) {

                // redirect all http trafic to https
                // port should be really in config
                return reply().redirect('https://' + request.info.hostname + ':8001' + request.url.path).permanent();
            },
            config: {
                description: 'Http catch route. Will redirect every http call to https'
            }
        });

        return next();
    });

    return next();
};


exports.register.attributes = {
    name: 'Auth'
};
