/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports, net = require('net'), web6 = require('web6'),
  kisi = require('./kitchen-sink.js'),
  announceServerUrl = kisi.makeUrlAnnouncer,
  makeHelloApp = require('./hello-app.js');

EX.run = function readmeDemo(cfg) {
  cfg = Object.assign({}, kisi.cfg, cfg);
  //#u
  var web = require('web6'), makeApp = require('./hello-app.js'),
    appOpts = { greeting: 'Hello World!' },
    app = makeApp(appOpts),   // function (request, respond) { … }
    tcpServer = net.createServer(), tcpConnectionHandler;

  if (cfg.addExtras) { app = cfg.addExtras(app); }

  tcpConnectionHandler = web.socketHandler(app, { debug: true });
  tcpServer.on('connection', tcpConnectionHandler);

  tcpServer.on('listening', announceServerUrl(tcpServer));
  tcpServer.listen(cfg.port, cfg.iface);
  //#r

  if (cfg.autoCloseSec) {
    tcpServer.on('connection', function (conn) {
      setTimeout(function () { conn.end(); }, cfg.autoCloseSec * 1000);
    });
    tcpServer.once('connection', function () {
      setTimeout(function () { tcpServer.close(); }, cfg.autoCloseSec * 1000);
    });
  }
};


if (require.main === module) { EX.run(); }
