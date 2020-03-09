###  npm
```shell
npm install ip
```

### git

```shell
git clone https://github.com/jloboescalona2/ip.git
```
  
## Usage
Get your ip address, compare ip addresses, validate ip addresses, etc.

```js
var ip = require('ip');

ip.toBuffer('127.0.0.1') // Buffer([127, 0, 0, 1])
ip.toString(new Buffer([127, 0, 0, 1])) // 127.0.0.1
ip.fromPrefixLen(24) // 255.255.255.0
ip.mask('192.168.1.134', '255.255.255.0') // 192.168.1.0
ip.cidr('192.168.1.134/26') // 192.168.1.128
ip.not('255.255.255.0') // 0.0.0.255
ip.or('192.168.1.134', '0.0.0.255') // 192.168.1.255

// range checking
ip.cidrSubnet('192.168.1.134/26').contains('192.168.1.190') // true


// ipv4 long conversion
ip.toLong('127.0.0.1'); // 2130706433
ip.fromLong(2130706433); // '127.0.0.1'
```
