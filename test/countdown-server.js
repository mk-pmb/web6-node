/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports, through2 = require('through2'),
  helloServer = require('./hello-server.js');


EX.run = function countDownServer() {
  helloServer.run({
    addExtras: EX.middleware({ path: '/countdown.txt' }),
    announceExtras: 'Count-down @ /countdown.txt',
  });
};


EX.ctText = { 'Content-Type': 'text/plain; charset=UTF-8' };


EX.middleware = function (cfg) {
  return function installCountdown(origApp) {
    var ctdPath = cfg.path;

    function appWithCountdown(req, rsp) {
      var isCtd = ((req.method === 'GET') && (req.url.pathname === ctdPath));
      console.log('countdown request?', isCtd);
      if (isCtd) {
        return rsp(200, EX.ctText, EX.makeCountDownStream(10));
      }
      return origApp(req, rsp);
    }

    return appWithCountdown;
  };
};


EX.makeCountDownStream = function (countFrom, intervalSec) {
  var number = (+countFrom || 1), intvMsec = (+intervalSec || 1) * 1000,
    stream = through2();
  console.log('Starting countdown from', number);

  ['error', 'end', 'close'].forEach(function (event) {
    stream.on(event, function (detail) {
      console.log('countdown stream %s @ %s:', event, number, detail);
      stream = null;
    });
  });

  setImmediate(function count() {
    if (!stream) { return; }
    console.log('countdown:', number);
    if (number > 0) {
      if (!stream.write(number + '…\n')) {
        console.log('stream shall stop.');
      }
      number -= 1;
      setTimeout(count, intvMsec);
    } else {
      stream.end('0!\n');
      number = NaN;
    }
  });

  return stream;
};


if (require.main === module) { EX.run(); }
