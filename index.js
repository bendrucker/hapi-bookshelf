'use strict';

var Promise = require('bookshelf/dialects/base/promise').Promise;

module.exports = {
  name: require('./package.json').name,
  version: require('./package.json').version,
  register: function (plugin, options, next) {

    plugin.ext('onPreResponse', function (request, next) {
      var Hapi = plugin.hapi,
      response = request.response;

      // Filter on bluebird promises only
      if (response.variety === 'plain' && response.source instanceof Promise) {
        return response.source
          .catch(options.Bookshelf.Model.NotFoundError, function (err) {
            next(Hapi.error.notFound('Not found.'));
          });
      }

      next();
    });

    next();
  }
};