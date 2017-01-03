/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function dirtyProp(o, k) { return o['_' + k]; }

var EX = module.exports, parseUrl = require('url').parse,
  httpLib = require('http'),
  httpConnectionListener = dirtyProp(httpLib, 'connectionListener'),
  createHttpServer = httpLib.createServer;


function WebRequest() { return; }
WebRequest.proto = new WebRequest();

function isFunc(x) { return (typeof x === 'function'); }

function copyKeys(dest, src, keys, opts) {
  if (!keys.forEach) { keys = String(keys).match(/\S+/g); }
  opts = (opts || false);
  keys.forEach(function (k) {
    dest[(opts.destPfx || '') + k] = src[(opts.srcPfx || '') + k];
  });
  return dest;
}


EX.makeRespondFunc = function (httpResp, opts) {
  if (!httpResp) { throw new Error('httpResp is required'); }
  opts = (opts || false);
  return function webResp(code, headers, body) {
    if (!httpResp) {
      throw new Error('Can send at most one response per request');
    }
    body = (body || '');
    var streaming = isFunc(body.pipe), cLen = 'Content-Length';
    if ((headers && typeof headers) !== 'object') {
      throw new TypeError('headers must be given as an object');
    }
    if (!streaming) {
      body = Buffer.from(body);
      if ((headers[cLen] === undefined) && (opts.autoContentLength !== false)) {
        headers[cLen] = body.length;
      }
    }
    httpResp.writeHead(+code, headers);
    if (streaming) {
      httpResp.on('close', body.end.bind(body));
      body.pipe(httpResp);
    } else {
      httpResp.end(body);
    }
    httpResp = false;
  };
};


EX.makeHttpRequestHandlerFromApp = function (app, opts) {
  opts = (opts || false);
  var hnd = function httpRequestHandler(httpReq, httpResp) {
    var webReq = Object.create(WebRequest.proto),
      webResp = EX.makeRespondFunc(httpResp, opts),
      connHdr = String(httpReq.headers.connection || '').toLowerCase();
    webReq.url = parseUrl(httpReq.url);
    copyKeys(webReq, httpReq, ['method', 'body', 'headers', 'rawHeaders']);
    copyKeys(webReq, httpReq, ['Major', 'Minor'],
      { srcPfx: 'httpVersion', destPfx: 'version' });
    webReq.upgrade = (connHdr === 'upgrade');
    webReq.shouldKeepAlive = (connHdr === 'keep-alive');
    return hnd.app(webReq, webResp);
  };
  hnd.app = app;
  return hnd;
};


EX.makeSocketHandlerFromApp = function (app) {
  var s = createHttpServer(), l = httpConnectionListener,
    h = function socketHandler(c) { return l.call(s, c); };
  s.on('request', EX.makeHttpRequestHandlerFromApp(app));
  h.httpServer = s;
  return h;
};


EX.socketHandler = EX.makeSocketHandlerFromApp;


























