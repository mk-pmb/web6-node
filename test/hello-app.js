/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = function appFactory(opts) {
  opts = (opts || false);
  var greeting = (opts.greeting || 'Hello.') + '\n';

  function helloApp(req, res) {
    var path = req.url.pathname, headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
    };
    console.log('hello request:', req.method, path);

    // Resources that accept any method:
    switch (path) {
    case '/debug.txt':
      req.body = String(req.body);
      return res(200, headers, JSON.stringify(req, null, 2) + '\n');
    }

    if (req.method !== 'GET') {
      return res(405, headers, 'Method not allowed. Try GET instead.\n');
    }

    // Resources that accept only GET:
    switch (path) {
    case '/':
      return res(200, headers, greeting);
    }
    return res(404, headers, "I don't have that file.\n");
  }

  return helloApp;
};
