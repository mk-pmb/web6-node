
<!--#echo json="package.json" key="name" underline="=" -->
web6
====
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Shim the &quot;web&quot; framework&#39;s `socketHandler` function for node.js
v6.x
<!--/#echo -->

In theory, you can just add the digit `6` to your `require('web')` and it
should work. If you know of any tests for "web" interface compatibility,
[please let me know](https://github.com/creationix/node-web/issues/9)
so I can improve this shim to accomodate them.

* [web framework repo](https://github.com/creationix/node-web)
* [web framework on npm](https://www.npmjs.com/package/web)



Usage
-----

from [test/hello-server.js](test/hello-server.js):

<!--#include file="test/hello-server.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="19" -->
```javascript
var web = require('web6'), makeApp = require('./hello-app.js'),
  app, appOpts = { greeting: 'Hello World!' },
  tcpServer = net.createServer(), tcpConnectionHandler;

if (cfg.announceExtras) {
  appOpts.greeting += ('\n\nWere you looking for one of these extras?\n' +
    cfg.announceExtras);
}

app = makeApp(appOpts);   // function (request, respond) { … }
if (cfg.addExtras) { app = cfg.addExtras(app); }

tcpConnectionHandler = web.socketHandler(app, { debug: true });
tcpServer.on('connection', tcpConnectionHandler);

tcpServer.on('listening', announceServerUrl(tcpServer));
tcpServer.listen(cfg.port, cfg.iface);
```
<!--/include-->


More examples:
* [test/countdown-server.js](test/countdown-server.js)


<!--#toc stop="scan" -->


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
