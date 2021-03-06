# obniz.js: sdk for javascript

[![npm version](https://badge.fury.io/js/obniz.svg)](https://badge.fury.io/js/obniz)
![](https://img.shields.io/npm/dt/obniz.svg) [![Build Status](https://secure.travis-ci.org/obniz/obniz.png?branch=master)](http://travis-ci.org/obniz/obniz)

[obniz](https://obniz.io/) sdk for javascript.

Control obniz from javascript. works on both browser / nodejs.

This sdk works with [obniz api](https://obniz.io/doc/about_obniz_api).


## Usage
```html
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://unpkg.com/obniz/obniz.js"></script>
</head>
<body>

<input id="text">
<button id="send">send</button>

<script>
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    // embed parts
    obniz.display.print("hello!");
    obniz.switch.onchange = function(state) {
      $('body').css({
        "background-color" : (state == "push") ? "#F00" : "#FFF"
        });
    }

    // parts library
    var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
    servo.angle(90);
    
    // peripherals
    var uart = obniz.getFreeUart();
    uart.start({tx: 5, rx: 6, baud:9600});  
    
    $('#send').click(function () {
      uart.send($("#text").val());
    });

    obniz.io7.drive("5v")
    obniz.io7.output(true)
    obniz.io8.pull("3v");
    obniz.io8.drive("open-drain");
    obniz.io8.output(false);
  }
</script>
</body>
</html>
```

## Installation

### Browser
add this line to your html
```html
  <script src="https://unpkg.com/obniz/obniz.js"></script>
```
### Nodejs
Install obniz via npm
```shell
  npm install obniz
```
and import it on js file.
```javascript
  const Obniz = require('obniz');
```

## Connect

Details on [doc/connection](./doc/connection.md) ([ja](./doc/connection-ja.md))

To use obniz, instantiate obniz with obniz id. and set onconnect callback function. It will be called when connected to obniz successfully.
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```

You are able to use everything on obniz after connect.
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.display.print("hello!");
    obniz.switch.onchange = function(state) {
      if (state === "push") {
        obniz.display.print("Button Pressed");
      }
    }
  }
```
and it's io peripherals too
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.io0.drive("5v");
    obniz.io0.output(true)
    obniz.io1.pull("3v");
    obniz.io1.drive("open-drain");
    obniz.io1.output(false);
    obniz.io2.drive("3v");
    obniz.io2.output(true);

    obniz.ad3.start(function(voltage){
      console.log("changed to "+voltage+" v")
    });

    var pwm = obniz.getFreePwm();
    pwm.start({io: 4});
    pwm.freq(1000);
    pwm.duty(50);

    var uart = obniz.getFreeUart();
    uart.start({tx: 5, rx: 6, baud:9600});  
    uart.onreceive = function(data, text) {
      console.log(data);
    }
    uart.send("Hello");
  }
```

## Parts library
parts library is embed in obniz.js.
All parts and it's details can be seen at

[obniz Parts Library](https://obniz.io/sdk/parts/)

To use connected parts, instantiate parts in onconnect callback function. And use it. Function list is on also [obniz Parts Library](https://obniz.io/sdk/parts/).

For example, LED [https://obniz.io/sdk/parts/LED](https://obniz.io/sdk/parts/LED)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var led = obniz.wired("LED", {anode:0, cathode:1});
    led.blink();
  }
```

HC-SR40(distance measure) [https://obniz.io/sdk/parts/HC-SR04](https://obniz.io/sdk/parts/HC-SR04)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
    hcsr04.unit("inch");
    hcsr04.measure(function( distance ){
      console.log("distance " + distance + " inch")
    })
  }
```

## Example: browser integrates hardware
Easy to integrate UI on html and hardware
```html
<input id="slider" type="range"  min="0" max="180" />

<script src="https://unpkg.com/obniz/obniz.js"></script>
<script>
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
  $("#slider").on('input', function() {
    servo.angle($("#slider").val())
  });
}
</script>
```

## Example: integrate web services
Easy to integrate web servies like Dropbox, Twitter.
```javascript
// save data from obniz to dropbox
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN HERE>' });
  var button = obniz.wired("Button",  {signal:0, gnd:1});
  button.onchange = function(pressed){
    if (pressed) {
  　　dbx.filesUpload({path: '/obniz.txt', contents: "[Button Pressed]\n" + new Date(), mode: 'overwrite' });
    }
  };
}
```

## Example: integrate two or more obniz
Not only web to obniz. obniz to obniz is easy too.
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("Potentiometer", 0, 1, 2);
    var servo = obnizB.wired("ServoMotor", 0, 1, 2);
    meter.onchange = function(position) {
      servo.angle(position * 180);
    }; 
  }
}
```


## Documentation
You can find the documentation on [the website](https://obniz.io/doc/).


## Lisence
See [LICENSE.txt](./LICENSE.txt)
