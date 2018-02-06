# FullColorLED

## wired(r, g, b, common, common_type)

r,g,b,common is pin no of obniz io.
common_type is LED common type : anode_common or cathode_common

```Javascript
var led = obniz.wired("FullColorLED", 0, 1, 2, 3, 'anode_common'); 
```

## rgb(red, green, blue)
change color.
When you chaining LED, this will change only top of leds.
```Javascript
var led = obniz.wired("FullColorLED", 0, 1, 2, 3, 'anode_common'); 
led.rgb(0xFF, 255, 0); // Yellow
```

## hsv(hue, saturation, value)
change color from hsv values.
When you chaining LED, this will change only top of leds.

hue : 0 ~ 360
saturation : 0 ~ 1
value : 0 ~ 1
```Javascript
var led = obniz.wired("FullColorLED", 0, 1, 2, 3, 'anode_common'); 
led.hsv(180, 0.5, 1);
```


## gradation(cycle_ms)

Auto gradate LED.

```Javascript
var led = obniz.wired("FullColorLED", 0, 1, 2, 3, 'anode_common'); 
led.gradation(1000); // 1000 msec loop
```

## stopgradation
Stop gradate LED.

```Javascript
var led = obniz.wired("FullColorLED", 0, 1, 2, 3, 'anode_common'); 
led.gradation(1000); // 1000 msec loop

await obniz.wait(5000);
led.stopgradation()

```
