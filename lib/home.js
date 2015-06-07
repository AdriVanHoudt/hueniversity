// Load modules

var Path = require('path');

// Declare internals

var internals = {
    rootPath: Path.resolve(__dirname, '../'),
    viewsPath: Path.resolve(__dirname, '../views')
};


exports.register = function (server, options, next) {

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: '../views/partials',
        relativeTo: __dirname
    });

    server.select('web-tls').route([{
        method: 'GET',
        path: '/home',
        config: {
            description: 'Returns the home page',
            handler: {
                view: {
                    template: 'home',
                    context: {
                        path: Path.relative(internals.rootPath, Path.resolve(internals.viewsPath, 'home.html'))
                    }
                }
            }
        }
    }, {
        method: 'POST',
        path: '/login',
        config: {
            description: 'Allows the user to login',
            handler: {
                view: {
                    template: 'login'
                }
            }
        }
    }]);

    return next();
};

exports.register.attributes = {
    name: 'Home'
};
