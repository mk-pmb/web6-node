/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var net = require('net'), sockAddrStr = require('sockaddrstr'), cfg = {
  iface: 'localhost',
  port: (+process.env.PORT || 8080),
  autoCloseSec: (+process.env.HTTP_AUTOCLOSE_SEC || 0),
};

String(process.env.DEMO_FLAGS || '').replace(/\w+/g,
  function (flag) { cfg[flag] = true; });


function announceServerUrl(srv) {
  return function () {
    console.log('Now listening on http://%s/', sockAddrStr(srv));
  };
}

(function readmeDemo() {
  //#u
  var web = require('web6'), makeApp = require('./hello-app.js'),
    appOpts = { greeting: 'Hello World!' },
    app = makeApp(appOpts),   // function (request, respond) { … }
    tcpServer = net.createServer(),
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
}());





















// scroll
