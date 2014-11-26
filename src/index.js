'use strict';

var hoek = require('hoek');
var boom = require('boom');

exports.register = function (plugin, options, next) {
  options = hoek.applyToDefaults({
    noRow: 'No rows were affected in the update, did you mean to pass the {method: "insert"} option?'
  }, options);
  var bookshelf = options.bookshelf;
  hoek.assert(bookshelf, 'Bookshelf instance must be passed as "bookshelf"');
  plugin.ext('onPreResponse', function (request, reply) {
    if (request.response instanceof bookshelf.Model.NotFoundError) {
      return reply(boom.notFound());
    }
    else if (request.response.isBoom && request.response.message === options.noRow) {
      return reply(boom.notFound());
    }
    else {
      return reply();
    }
  });
  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};
