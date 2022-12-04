const express = require('express');
const app = express();

const helmet = require('helmet');

const hstsTimeInSec = 90 * 24 * 60 * 60; // 90 days
const cspDirs = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", 'trusted-cdn.com'],
};

app.use(
  helmet({
    frameguard: {action: 'deny'},
    hsts: {maxAge: hstsTimeInSec, force: true},
    contentSecurityPolicy: {directives: cspDirs},
  })
);

// app.use(helmet.hidePoweredBy());
// app.use(helmet.frameguard({action: 'deny'}));
// app.use(helmet.xssFilter()); // not necessary when Content-Security-Policy is enabled
// app.use(helmet.noSniff());
// app.use(helmet.ieNoOpen());
// app.use(helmet.hsts({maxAge: hstsTimeInSec, force: true})); // Priotize https over http
// app.use(helmet.dnsPrefetchControl()); // Turn off X-DNS-Prefetch-Control to priotize security over performance
// app.use(helmet.noCache()); // Try to disable cache on client's browser - deprecated in latest helmet

// app.use(helmet.contentSecurityPolicy({directives: cspDirs}));

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
