node-staticServer
=================
> a nodejs ping tool
##Getting Started
```shell
npm install ping-net
```
###Functions
#####ping(options, callback,true)
```options``` is an object or object Array, which may contain several properties:
* address (address to ping; defaults to ```localhost```)
* port (defaults to ```80```)
* timeout (in ms; defaults to 5s)
* attempts (how many times to measure time; defaults to 10)

```callback``` should be a function with arguments in node convention - ```function(data)```.
Returned data is an object which looks like this:
```javascript
{
  address: '46.28.246.123',
  port: 80,
  attempts: 10,
  avg: 19.7848844,
  max: 35.306233,
  min: 16.526067,
  results:
   [
    { seq: 0, time: 35.306233 },
    { seq: 1, time: 16.585919 },
    ...
    { seq: 9, time: 17.625968 }
   ]
}
```
optional```true or false``` Sorts the items of data. true is  ascending (up) and false is descending (down).
###Usage
```javascript
var ping = require('ping-net');
ping.ping({ address: '127.0.0.1', port:8080}, function(err, data) {
    console.log(data);
});
ping.ping([
          { address: '127.0.0.1', port:8080},
          { address: '192.168.2.1', port:8080}
          ], function(err, data) {
    console.log(data);
});
```
 


