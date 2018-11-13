hapi-bookshelf [![Build Status](https://travis-ci.org/bendrucker/hapi-bookshelf.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-bookshelf) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/hapi-bookshelf.svg)](https://greenkeeper.io/)
==============

Hapi plugin for transforming [Bookshelf](http://bookshelfjs.org)'s two "not found" errors into friendly [Boom](http://github.com/hapijs/boom) error responses.

Handles:
* [`Model.NotFound` errors](https://github.com/tgriesser/bookshelf/blob/master/lib/model.js#L100)
* [Updates that don't affect any rows](https://github.com/tgriesser/bookshelf/blob/master/lib/model.js#L223)
