
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
please let me know so I can improve this shim to accomodate them.



Usage
-----

<!--#include file="test/hello-server.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="14" -->
```javascript
var web = require('web6'), makeApp = require('./hello-app.js'),
  appOpts = { greeting: 'Hello World!' },
  app = makeApp(appOpts),   // function (request, respond) { … }
  tcpServer = net.createServer(), tcpConnectionHandler;

if (cfg.addExtras) { app = cfg.addExtras(app); }

tcpConnectionHandler = web.socketHandler(app, { debug: true });
tcpServer.on('connection', tcpConnectionHandler);

tcpServer.on('listening', announceServerUrl(tcpServer));
tcpServer.listen(cfg.port, cfg.iface);
```
<!--/include-->



<!--#toc stop="scan" -->


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
