var Lab           = require('lab'),
    describe      = Lab.experiment,
    it            = Lab.test,
    expect        = Lab.expect,
    before        = Lab.before,
    after         = Lab.after;

var Hapi          = require('hapi'),
    Promise       = require('bookshelf/dialects/base/promise').Promise,
    hapiBookshelf = require('./');

var Bookshelf = {
  Model: require('bookshelf/dialects/base/model').ModelBase
};

describe('Hapi Promise', function () {

  var server;

  before(function (done) {
    server = new Hapi.Server(8100);
    server.pack.register(hapiBookshelf, {
      Bookshelf: Bookshelf
    }, function () {});
    server.start(done);
  });

  after(function (done) {
    server.stop(done);
  });

  it('does not affect normal requests', function (done) {
    server.route({
      method: 'GET',
      path: '/default',
      handler: function (request, reply) {
        reply('Normal response');
      }
    });

    server.inject('/default', function (response) {
      expect(response.result).to.equal('Normal response');
      done();
    });
  });

  it('Bookshelf.Model.NotFoundError => Hapi.error.notFound', function (done) {
    server.route({
      method: 'GET',
      path: '/notfound',
      handler: function (request, reply) {
        reply(Promise.reject(new Bookshelf.Model.NotFoundError()));
      }
    });

    server.inject('/notfound', function (response) {
      expect(response.result).to.have.property('message', 'Not found.');
      done();
    });
  });
});