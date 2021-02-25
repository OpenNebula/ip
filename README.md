# guacamole-opennebula

*guacamole-opennebula* is a NodeJS replacement for *guacamole-client* (server-side Java servlet).
Guacamole is a RDP/VNC client for HTML5 browsers.

## Installation

```
npm install --save guacamole-opennebula
```

## Code Example

this example is the integration with fireedge server, what accepts connections and forwards all traffic to guacd on port `4822`

```javascript
#!/usr/bin/env node

const GuacamoleOpennebula = require('guacamole-opennebula');

const clientOptions = {
  crypt: {
    cypher: 'AES-256-CBC',
    key: 'here the secret key'
  },
  allowedUnencryptedConnectionSettings: {
    rdp: ['width', 'height', 'dpi'],
    vnc: ['width', 'height', 'dpi'],
    ssh: ['color-scheme', 'font-name', 'font-size', 'width', 'height', 'dpi'],
    telnet: ['color-scheme', 'font-name', 'font-size', 'width', 'height', 'dpi']
  },
  log: {
    level: 'ERRORS'
  }
}

const clientCallbacks = {
  processConnectionSettings: (settings, callback) => {
    if (settings.expiration && settings.expiration < Date.now()) {
      return callback(new Error('Token expired'))
    }
    return callback(null, settings)
  }
}

const guacdPort = 4822
const guacdHost = '127.0.0.1'

const guacamole = appServer => {
  if (
    appServer &&
    appServer.constructor &&
    appServer.constructor.name &&
    appServer.constructor.name === 'Server'
  ) {
    const guacamoleServer = new GuacamoleOpennebula(
      { server: appServer, path: endpointGuacamole },
      { host: guacdHost, port: guacdPort },
      clientOptions,
      clientCallbacks
    )
    guacamoleServer.on('error', (clientConnection, error) => {
      console.log(error)
    })
  }
}
```
