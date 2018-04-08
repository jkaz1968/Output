// Thomas Edison MV.js

/*:
* @plugindesc Creates a customizable lighting system for RPG Maker MV.
* @author Soulpour777 - soulxregalia.wordpress.com

@help

Thomas Edison MV Plugin
Current Version Build: 1.0
Date Created: 9 / 9 / 2016
Date Finished (V1): 9 / 10 / 2016
Author: Soulpour777

HELP FILE SECTION (Simplified)

===================================================
PROPER INSTALLATION
===================================================

Place the needed images in the img / thomasedisonmv folder.
Next, place the plugin on the js / plugins folder.

===================================================
SETTING UP A LIGHT
===================================================
To create a light event, it needs a certain comment.
There are two types of light that you can use, the
classic LIGHT and the CUSTOM light.

First, let's talk about the classic Light. The
classic light is something you can only have
a limited control to what it looks like. To
create it, on your event, make a comment
command and place this template:

LIGHT switch_id tone flicker scale

if you want to make a custom light, make
a comment command and place this template:

CUSTOM switch_id image ax ay tone flicker scale blend opacity

where:

SWITCH ID
The switch id that should be currently turned to ON before the light
actually appears.

TONE
tone is the tone of the image. The tone contains
four contents inside, which takes the red, green,
blue and gray colors.

A tone is written with this manner [r,g,b,gray].
Please make sure that you don't have spaces when
writing them. The tone comment code is space
sensitive. example: [122,255,123,100]

FLICKER
flicker is set either true or false as values.
When set to true, the light would flicker and
would have changes to the visibility and on
it's behavior.

SCALE
There is a difference between the scale values
when you use the classical LIGHT or the CUSTOM light.
When you're using the classical light, the values
should either be of the following:

A - normal scale. Not zoomed.
B - zoomed twice. The light is bigger.
C - zoomed four times.
D - zoomed six times.
E - zoomed eight times.

while if you're using the custom light, the scale
value should be a number. If you don't want to
scale the light image, you just write 1.

IMAGE
if you're using the CUSTOM light, this parameter is needed.
this is the name of the image you're going to use as the
light source.

ax and ay
if you're using the CUSTOM light, these parameter is
needed. The ax and ay means they are the added x and 
added y. The image is actually added right in place
with the x and y of the event, but depending on the
image you're using, the location of the light may
vary especially if you're scaling it. The values
in these parameters should be a number.

BLEND
if you're using the custom light, this parameter is
needed. The blend parameter can only be any of the
following:

NORMAL - sets the blend mode to normal.
ADD - sets the blend mode to Add.
SUBTRACT - sets the blend mode to Subtract.
SCREEN - sets the blend mode to Screen.

OPACITY
if you're using the custom light, this parameter is
needed. The opacity parameter holds how visible your
light is in the screen. The opacity parameter should
be in numbers.

===================================================
EXAMPLES
===================================================

Example of a classical LIGHT:

LIGHT 1 [-255,255,255,100] true B

^ This would create a bluish flickering scaled twice light
when switch 1 is turned on.

Example of a CUSTOM light:

CUSTOM 1 Light 60 100 [-255,255,255,100] true 1 ADD 150

^ this would create a bluish flickering unscaled light in additive blend
mode with the opacity of 150 when Switch 1 is turned on.

===================================================
SUPPORT
===================================================

For any support, message me at my official blog:
soulxregalia.wordpress.com

If you like my works, please consider supporting me
on my Patreon campaign:

https://www.patreon.com/Soulpour777?ty=h

===================================================
GITHUB Download
===================================================
If you've downloaded this from my github (if this plugin ever
gets lost in some way and you found a copy on github),
make sure that your light image is 130 x 155 in
size. Make sure that it is a png file.

===================================================
TERMS OF USE (SIMPLIFIED)
===================================================
For the complete terms of use, please go here:
https://soulxregalia.wordpress.com/terms-of-use/

All plugins found in this website are FREE to use for Commercial, 
Non-Commercial and IGMC purposes. I will not ask for any royalties or 
special liberties to any plugins used and giving a free copy of 
your game for any commercial use is optional. 
All I ask is that you give Soulpour777 a credit for any plugins you 
are using from this site.


*
* @param -- DEFAULT SCALES--
*
* @param Scale A
* @desc The default scale value of Scale Setting A.
* @default 1
*
* @param Scale B
* @desc The default scale value of Scale Setting B.
* @default 2
*
* @param Scale C
* @desc The default scale value of Scale Setting C.
* @default 4
*
* @param Scale D
* @desc The default scale value of Scale Setting D.
* @default 6
*
* @param Scale E
* @desc The default scale value of Scale Setting E.
* @default 8
*
* @param -- CLASSICAL LIGHT--
*
* @param Classical Light Opacity
* @desc The default opacity of the classical light.
* @default 130
*
* @param Classical Light Flicker Rate
* @desc The default flicker rate of the classical light.
* @default 20
*
* @param -- SCALE ADJUSTMENT--
*
* @param Scale A XCoord
* @desc The default x coordinate of the light when setting A is selected.
* @default 60
*
* @param Scale A YCoord
* @desc The default y coordinate of the light when setting A is selected.
* @default 100
*
* @param Scale B XCoord
* @desc The default x coordinate of the light when setting B is selected.
* @default 120
*
* @param Scale B YCoord
* @desc The default y coordinate of the light when setting B is selected.
* @default 140
*
* @param Scale C XCoord
* @desc The default x coordinate of the light when setting C is selected.
* @default 250
*
* @param Scale C YCoord
* @desc The default y coordinate of the light when setting C is selected.
* @default 290
*
* @param Scale D XCoord
* @desc The default x coordinate of the light when setting D is selected.
* @default 380
*
* @param Scale D YCoord
* @desc The default y coordinate of the light when setting D is selected.
* @default 400
*
* @param Scale E XCoord
* @desc The default x coordinate of the light when setting E is selected.
* @default 500
*
* @param Scale E YCoord
* @desc The default y coordinate of the light when setting E is selected.
* @default 460
*
*/

'use strict';

var Imported = Imported || {};
Imported.Soul_ThomasEdisonMV = Imported.Soul_ThomasEdisonMV || {};

var Soulpour777 = Soulpour777 || {};
Soulpour777.ThomasEdison = Soulpour777.ThomasEdison || {};

Soulpour777.ThomasEdison.parameters = PluginManager.parameters('SOUL_ThomasEdisonMV');

if (Imported.Soul_ThomasEdisonMV) {
	ImageManager.loadEdison = function(filename, hue) {
	    return this.loadBitmap('img/thomasedisonmv/', filename, hue, true);
	};
}

Soulpour777.ThomasEdison.scaleA = Number(Soulpour777.ThomasEdison.parameters['Scale A']);
Soulpour777.ThomasEdison.scaleB = Number(Soulpour777.ThomasEdison.parameters['Scale B']);
Soulpour777.ThomasEdison.scaleC = Number(Soulpour777.ThomasEdison.parameters['Scale C']);
Soulpour777.ThomasEdison.scaleD = Number(Soulpour777.ThomasEdison.parameters['Scale D']);

Soulpour777.ThomasEdison.scaleAX = Number(Soulpour777.ThomasEdison.parameters['Scale A XCoord']);
Soulpour777.ThomasEdison.scaleAY = Number(Soulpour777.ThomasEdison.parameters['Scale A YCoord']);

Soulpour777.ThomasEdison.scaleBX = Number(Soulpour777.ThomasEdison.parameters['Scale B XCoord']);
Soulpour777.ThomasEdison.scaleBY = Number(Soulpour777.ThomasEdison.parameters['Scale B YCoord']);

Soulpour777.ThomasEdison.scaleCX = Number(Soulpour777.ThomasEdison.parameters['Scale C XCoord']);
Soulpour777.ThomasEdison.scaleCY = Number(Soulpour777.ThomasEdison.parameters['Scale C YCoord']);

Soulpour777.ThomasEdison.scaleDX = Number(Soulpour777.ThomasEdison.parameters['Scale D XCoord']);
Soulpour777.ThomasEdison.scaleDY = Number(Soulpour777.ThomasEdison.parameters['Scale D YCoord']);

Soulpour777.ThomasEdison.scaleEX = Number(Soulpour777.ThomasEdison.parameters['Scale E XCoord']);
Soulpour777.ThomasEdison.scaleEY = Number(Soulpour777.ThomasEdison.parameters['Scale E YCoord']);

Soulpour777.ThomasEdison.cLightOpacity = Number(Soulpour777.ThomasEdison.parameters['Classical Light Opacity']);
Soulpour777.ThomasEdison.cLightFlickerRate = Number(Soulpour777.ThomasEdison.parameters['Classical Light Flicker Rate']);

class EdisonLightMVCustom {
	constructor(eventId, type, switch_id, image, ax, ay, tone, flicker, scale, blend, opacity) {
		this.switch_id = Number(switch_id);
		this.eventId = eventId;
		this.image = String(image);
		this.type = String(type);
		this.tone = eval(tone);
		this.flicker = eval(flicker);
		this.scale = Number(scale);
		this.blend = String(blend);
		this.opacity = Number(opacity);
		this.ax = Number(ax);
		this.ay = Number(ay);
		this.lightImage = new Sprite();
		this.lightImage.bitmap = ImageManager.loadEdison(this.image);
		this.lightImage.visible = true;		
	}

	updateLight() {
		this.lightImage.setColorTone(this.tone);
		this.lightImage.x = $gameMap._events[this.eventId].screenX() - this.ax;
		this.lightImage.y = $gameMap._events[this.eventId].screenY() - this.ay;
		this.lightImage.scale.x = this.scale;
		this.lightImage.scale.y = this.scale;
		
		if($gameSwitches.value(this.switch_id)) {
			if (this.flicker) {
				this.lightImage.opacity = this.opacity + Math.randomInt(20);
			} else {
				this.lightImage.opacity = this.opacity;
			}
		} else {
			this.lightImage.opacity = 0;
		}

		switch(this.blend) {
			case 'NORMAL':
				this.lightImage.blendMode = 0;
				break;
			case 'ADD':
				this.lightImage.blendMode = 1;
				break;
			case 'MULTIPLY':
				this.lightImage.blendMode = 2;
				break;
			case 'SCREEN':
				this.lightImage.blendMode = 3;
				break;
			default:
				this.lightImage.blendMode = 0;
				break;
		}
	}

}

class EdisonLightMV {
	constructor(eventId, type, switch_id, tone, flicker, scale) {
		this.switch_id = Number(switch_id);
		this.eventId = Number(eventId);
		this.type = String(type);
		this.tone = eval(tone);
		this.flicker = eval(flicker);
		this.scale = String(scale);
		this.lightImage = new Sprite();
		this.lightImage.bitmap = ImageManager.loadEdison('Light');
		this.lightImage.visible = true;
	}

	updateLight() {

		switch(this.type) {
			// LIGHT
			case 'LIGHT':
				if ($gameSwitches.value(this.switch_id)) {
					if (this.flicker)  {
						this.lightImage.opacity = Soulpour777.ThomasEdison.cLightOpacity + Math.randomInt(Soulpour777.ThomasEdison.cLightFlickerRate);
					} else {
						this.lightImage.opacity = Soulpour777.ThomasEdison.cLightOpacity;
					}
				} else {
					this.lightImage.opacity = 0;
				}
				this.lightImage.setColorTone(this.tone); 
				
				switch(this.scale) {
					case 'A':
						var ax = Soulpour777.ThomasEdison.scaleAX;
						var ay = Soulpour777.ThomasEdison.scaleAY;
						this.lightImage.x = $gameMap._events[this.eventId].screenX() - ax;
						this.lightImage.y = $gameMap._events[this.eventId].screenY() - ay;					
						this.lightImage.scale.x = Soulpour777.ThomasEdison.scaleA;
						this.lightImage.scale.y = Soulpour777.ThomasEdison.scaleA;
						break;
					case 'B':
						var ax = Soulpour777.ThomasEdison.scaleBX;
						var ay = Soulpour777.ThomasEdison.scaleBY;					
						this.lightImage.x = $gameMap._events[this.eventId].screenX() - ax;
						this.lightImage.y = $gameMap._events[this.eventId].screenY() - ay;
						this.lightImage.scale.x = Soulpour777.ThomasEdison.scaleB;
						this.lightImage.scale.y = Soulpour777.ThomasEdison.scaleB;
						break;
					case 'C':
						var ax = Soulpour777.ThomasEdison.scaleCX;
						var ay = Soulpour777.ThomasEdison.scaleCY;					
						this.lightImage.x = $gameMap._events[this.eventId].screenX() - ax;
						this.lightImage.y = $gameMap._events[this.eventId].screenY() - ay;
						this.lightImage.scale.x = Soulpour777.ThomasEdison.scaleC;
						this.lightImage.scale.y = Soulpour777.ThomasEdison.scaleC;
						break;
					case 'D':
						var ax = Soulpour777.ThomasEdison.scaleDX;
						var ay = Soulpour777.ThomasEdison.scaleDY;					
						this.lightImage.x = $gameMap._events[this.eventId].screenX() - ax;
						this.lightImage.y = $gameMap._events[this.eventId].screenY() - ay;
						this.lightImage.scale.x = Soulpour777.ThomasEdison.scaleD;
						this.lightImage.scale.y = Soulpour777.ThomasEdison.scaleD;
						break;
					case 'E':
						var ax = Soulpour777.ThomasEdison.scaleEX;
						var ay = Soulpour777.ThomasEdison.scaleEY;					
						this.lightImage.x = $gameMap._events[this.eventId].screenX() - ax;
						this.lightImage.y = $gameMap._events[this.eventId].screenY() - ay;
						this.lightImage.scale.x = Soulpour777.ThomasEdison.scaleE;
						this.lightImage.scale.y = Soulpour777.ThomasEdison.scaleE;
						break;
				}
				this.lightImage.blendMode = 1;
				break;														
		}
	}

}

class Soul_ThomasEdisonMVCore {
	constructor() {
		this.lightEffects = [];
	}


	initializeLights() {
		for (var i = 1; i < $dataMap.events.length; i++) {
			var event = $gameMap._events[i];
			if(event && event.page()) {
				var pageList = event.page().list;
				for (let i = 0; i < pageList.length; i++) {
					if (pageList[i].code === 108) {
						var pagecontent = [];
						var content = pageList[i].parameters[0].split(' ');
						var type = content[0];

						switch (type) {
							case 'LIGHT':
								var switch_id = Number(content[1]);
								var tone = eval(content[2]);
								var flicker = eval(content[3]);
								var scale = String(content[4]);							
								var lightEffect = new EdisonLightMV(event._eventId, type, switch_id, tone, flicker, scale);
								break;
							case 'CUSTOM':
								var switch_id = Number(content[1]);
								var image = String(content[2]);
								var ax = Number(content[3]);
								var ay = Number(content[4]);
								var tone = eval(content[5]);
								var flicker = eval(content[6]);
								var scale = Number(content[7]);
								var blend = String(content[8]);
								var opacity = Number(content[9]);
								var lightEffect = new EdisonLightMVCustom(event._eventId, type, switch_id, image, ax, ay, tone, flicker, scale, blend, opacity);
							 	break;
						}
						if (lightEffect) {
							this.lightEffects.push(lightEffect);
						}
						
					}
				}
			}
		}
	}

	updateLights() {
		for (var i = 0; i < this.lightEffects.length; i++) {
			this.lightEffects[i].updateLight();
		}
	}
}

Soulpour777.ThomasEdison.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    Soulpour777.ThomasEdison.Spriteset_Map_createLowerLayer.call(this);
    this.thomasEdisonObject = new Soul_ThomasEdisonMVCore();
    this.thomasEdisonObject.initializeLights();
    for (var i = 0; i < this.thomasEdisonObject.lightEffects.length; i++) {
    	this.addChild(this.thomasEdisonObject.lightEffects[i].lightImage);
    }
};

Soulpour777.ThomasEdison.Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    Soulpour777.ThomasEdison.Spriteset_Map_update.call(this);
    this.thomasEdisonObject.updateLights();
};
