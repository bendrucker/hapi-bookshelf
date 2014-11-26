var lab        = exports.lab = require('lab').script();
var describe   = lab.describe;
var it         = lab.it;
var beforeEach = lab.beforeEach;
var expect     = require('code').expect;
var hapi       = require('hapi');
var Model      = require('bookshelf/lib/model');

describe('hapi-bookshelf', function () {

  var server;
  beforeEach(function (done) {
    server = new hapi.Server();
    server.route({
      method: 'GET',
      path: '/notfound',
      handler: function (request, reply) {
        reply(new Model.NotFoundError('EmptyResponse'));
      }
    });
    server.route({
      method: 'POST',
      path: '/norows',
      handler: function (request, reply) {
        reply(new Error('No rows were affected in the update, did you mean to pass the {method: "insert"} option?'));
      }
    });
    done();
  });

  function register (options, callback) {
    server.pack.register({
      plugin: require('../'),
      options: options || {
        bookshelf: {
          Model: Model
        }
      }
    }, callback || function (err) {
      if (err) throw err;
    });
  }

  it('must be registered with a bookshelf options', function (done) {
    register({}, function (err) {
      expect(err.message).to.contain('Bookshelf instance must be passed');
      done();
    });
  });

  it('turns NotFoundError into a 404', function (done) {
    register();
    server.inject('/notfound', function (response) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('turns a "no rows affected" error into a 404', function (done) {
    register();
    server.inject({
      method: 'POST',
      url: '/norows'
    }, function (response) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

});
