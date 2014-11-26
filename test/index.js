var lab       = exports.lab = require('Lab').script();
var describe  = lab.describe;
var it        = lab.it;
var before    = lab.before;
var after     = lab.after;
var expect    = require('code').expect;
var hapi      = require('hapi');
var Model     = require('bookshelf/lib/model');

describe('hapi-bookshelf', function () {

  var server = new hapi.Server();
  server.route({
    method: 'GET',
    path: '/notfound',
    handler: function (request, reply) {
      reply(Model.NotFoundError('EmptyResponse'));
    }
  });
  server.route({
    method: 'POST',
    path: '/norows',
    handler: function (request, reply) {
      reply(new Error('No rows were affected in the update, did you mean to pass the {method: "insert"} option?'));
    }
  });

  it('turns NotFoundError into a 404', function (done) {
    server.inject('/notfound', function (response) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('turns a "no rows affected" error into a 404', function (done) {
    server.inject({
      method: 'POST',
      url: '/norows'
    }, function (response) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

});
