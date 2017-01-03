/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var kisi = module.exports, cfg,
  through2 = require('through2'),
  sockAddrStr = require('sockaddrstr');

cfg = { iface: 'localhost', port: (+process.env.PORT || 8080),
  autoCloseSec: (+process.env.HTTP_AUTOCLOSE_SEC || 0),
  };

String(process.env.DEMO_FLAGS || '').replace(/\w+/g,
  function (flag) { cfg[flag] = true; });

kisi.cfg = cfg;

kisi.makeUrlAnnouncer = function (srv) {
  return function () {
    console.log('Now listening on http://%s/', sockAddrStr(srv));
  };
};
