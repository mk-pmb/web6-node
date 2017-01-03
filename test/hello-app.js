/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


function filterKeys(obj, keys) {
  var r = Object.create(null);
  if (!Array.isArray(keys)) { keys = String(keys).match(/\S+/g); }
  keys.forEach(function (k) { r[k] = obj[k]; });
  return r;
}


module.exports = function appFactory(opts) {
  opts = (opts || false);
  var greeting = (opts.greeting || 'Hello.') + '\n';

  function app(req, res) {
    var headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
    };
    switch (req.method) {
    case 'GET':
      switch (req.url.path) {
      case '/':
        return res(200, headers, greeting);
      }
      break;
    }
    switch (req.url.path) {
    case '/debug.txt':
      req.body = String(req.body);
      return res(200, headers, JSON.stringify(req, null, 2) + '\n');
    }
    return res(404, headers, 'File Not Found');
  }

  return app;
};

