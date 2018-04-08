/*
 * ==============================================================================
 * ** Victor Engine MV - Fog And Overlay
 * ------------------------------------------------------------------------------
 * VE_FogAndOverlay.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Fog And Overlay'] = '1.07';

var VictorEngine = VictorEngine || {};
VictorEngine.FogAndOverlay = VictorEngine.FogAndOverlay || {};

(function() {

    VictorEngine.FogAndOverlay.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.FogAndOverlay.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Fog And Overlay', 'VE - Basic Module', '1.21');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Fog And Overlay', 'VE - Tile Priority');
    };

    VictorEngine.FogAndOverlay.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.FogAndOverlay.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.07 - Display fogs and overlay on maps and battles.
 * @author Victor Sant
 *
 * @param Max Fogs
 * @desc Max number of simultaneous fogs and overlay effects
 * Default: 5.
 * @default 5
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Fog Effect (notetag for Maps)
 * ------------------------------------------------------------------------------
 *  <fog effect>
 *   settings
 *  </fog effect>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Create a fog effect on the map, add the following values to the info
 *  the ID and name must be added, other values are optional.
 *    id: n      : fog ID
 *    name: 's'  : fog graphic filename ('filename' in quotations)
 *    opacity: n : fog opacity (0-255)
 *    zoom: n%   : fog zoom (100% = default size)
 *    hue: n     : fog hue (0-360)
 *    blend: n   : fog blend mode (0: normal, 1: addition, 2: subtraction)
 *    move x: n  : fog horizontal movement (Numeric value, can be negative)
 *    move y: n  : fog vertical movement   (Numeric value, can be negative)
 *    pan x: n   : fog horizontal panning  (Numeric value)
 *    pan y: n   : fog vertical panning    (Numeric value)
 *    depth: n   : fog depth (1-7, see details bellow)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <fog effect>
 *         id: 1
 *         name: 'Sky'
 *         opacity: 160
 *         hue: 100
 *         move x: 3
 *         move y: 2
 *        </fog effect>
 *
 *        <fog effect>
 *         id: 3
 *         name: '$Fog'
 *         opacity: 92
 *         zoom: 150%
 *         pan x: -5
 *         blend: 2
 *        </fog effect>
 * ==============================================================================
 *
 * ==============================================================================
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  FogEffect id name opacity hue blend depth
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Show the fog effect on map.
 *    id      : fog effect id. (Number)
 *    name    : fog filename. (filename can't contain white space)
 *    opacity : fog opacity. (0-255)
 *    hue     : fog hue. (0-360)
 *    blend   : fog blend mode (0: normal, 1: addition, 2: subtraction)
 *    depth   : fog depth (1-7, see details bellow)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: FogEffect 1 Sky 160 100 0 0
 *       FogEffect 2 $Fog 92 0 1 3
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  FogOpacity id opacity duration
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the fog effect opacity.
 *    id       : fog effect id. (Number)
 *    opacity  : opacity. (0-255)
 *    duration : opacity change duration. (in frames, 0 if not set).
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: FogOpacity 1 92 60
 *       FogOpacity 2 0 120
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  FogMove id x y
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Adds continuous movement to the fog effect.
 *      id : fog effect id. (Number)
 *      x  : fog move X. (Number, can be negative)
 *      y  : fog move Y. (Number, can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: FogMove 1 5 -5
 *       FogMove 2 0 4
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  FogPan id x y
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Change fog effect panning.
 *      id : fog effect id. (Number)
 *      x  : fog pan X. (Number, can be negative)
 *      y  : fog pan Y. (Number, can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: FogPan 1 4 4
 *       FogPan 2 0 -5
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 *  
 *  - Fogs Depths:
 *  The fog depth represents wich objects will be displayed above or bellow the
 *  overlay effect. There are 8 depths available from 0 to 7. 
 *
 *  On map:
 *   1: above animations
 *   2: above airship/upper characters
 *   3: above upper tiles
 *   4: above normal characters
 *   5: above lower characters
 *   6: above lower tilesets
 *   7: above parallax
 *
 *  On battle:
 *   0, 1, 2, 3, 4: above battlers
 *   5: above battleback2
 *   6: above battleback1
 *   7: above background (blured map image)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Fogs in Battle:
 *  By default, fogs are shown only on Map. You can make some fogs to display
 *  during battle by adding a prefix to it's filename. 
 *  Add '$' on the fog filename, for the fog to be shown in the map and battle.
 *  Add '%' on the fog filename, for the fog to be shown only in battle.
 *  For example, a fog named '%Clouds' will be shown only in battle.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Creating Fogs
 *  The fog images must be placed on the folder img/fogs/ (you must create this
 *  new folder).
 *  The fogs can be created either adding a notetag on the map note box or using
 *  plugin commands. Fogs created with plugin commands will disappear when you
 *  leave the map. You can also control fogs created with notetags using plugin
 *  commands with their Ids, but any change will reset when you leave the map.
 *  Fogs on the same depht are sorted based on their IDs. The ones with higher
 *  IDs will be shown above the ones with lower IDs.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  If you want to create a fixed overlay (that follows the map movement), 
 *  add '!' on the start of the overlay filename. For example, an overlay 
 *  named "Over" should be renamed "!Over". You can combine this prefix with
 *  the battle and battle only prefixes.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 * - To be used together with this plugin, the following plugins must be placed
 *   bellow this plugin:
 *     VE - Tile Priority
 * ==============================================================================
 *
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2015.12.07 > First release.
 *  v 1.01 - 2015.12.25 > Revised code for better performance.
 *                      > Added more depth options.
 *  v 1.02 - 2016.01.06 > Fixed issue with fogs not clearing.
 *  v 1.03 - 2016.01.27 > Fixed issue with loading games with fogs on the map.
 *  v 1.04 - 2016.03.12 > Fixed issue with stack call and battle fogs.
 *  v 1.05 - 2016.03.23 > Compatibility with Basic Module 1.16.
 *  v 1.06 - 2016.06.04 > Fixed issue when calling new Fogs with Plugin Commands.
 *  v 1.07 - 2016.06.11 > Compatibility with Tile Priority.
 *                      > Fixed issue with crash at battle start.
 * ------------------------------------------------------------------------------
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.FogAndOverlay = {};
        VictorEngine.Parameters.FogAndOverlay.MaxFogs = Number(parameters["Max Fogs"]) || 1;
    };

    //=============================================================================
    // ImageManager
    //=============================================================================

    /* Overwritten fucntion */
    Tilemap.prototype._compareChildOrder = function(a, b) {
        if ((a.z || 0) !== (b.z || 0)) {
            return (a.z || 0) - (b.z || 0);
        } else if ((a.y || 0) !== (b.y || 0)) {
            return (a.y || 0) - (b.y || 0);
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    //=============================================================================
    // ImageManager
    //=============================================================================

    ImageManager.loadFog = function(filename, hue) {
        return this.loadBitmap('img/fogs/', filename, hue, true);
    };

    ImageManager.isBattleOnlyFog = function(filename) {
        var sign = filename.match(/^[\!\%]+/);
        return sign && sign[0].contains('%');
    };

    ImageManager.isBattleFog = function(filename) {
        var sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('$');
    };

    ImageManager.isFixedFog = function(filename) {
        var sign = filename.match(/^[\!\$\%]+/);
        return sign && sign[0].contains('!');
    };

    //=============================================================================
    // Game_Screen
    //=============================================================================

    VictorEngine.FogAndOverlay.clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        VictorEngine.FogAndOverlay.clear.call(this);
        this.clearFogs();
    };

    VictorEngine.FogAndOverlay.GameScreenUpdate = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        VictorEngine.FogAndOverlay.GameScreenUpdate.call(this);
        this.updateFogs();
    };

    Game_Screen.prototype.fog = function(fogId) {
        return this._fogs[fogId];
    };

    Game_Screen.prototype.clearFogs = function() {
        this._fogs = [];
    };

    Game_Screen.prototype.updateFogs = function() {
        this._fogs.forEach(function(fog) {
            if (fog) fog.update();
        });
    };

    Game_Screen.prototype.showFog = function(fogId, name, opacity, hue, blend, depth) {
        var fog = new Game_Fog();
        fog.show(name, opacity, hue, blend, depth);
        this._fogs[fogId] = fog;
    };

    Game_Screen.prototype.moveFog = function(fogId, x, y) {
        var fog = this.fog(fogId);
        if (fog) {
            fog.move(x, y);
        }
    };

    Game_Screen.prototype.panFog = function(fogId, x, y) {
        var fog = this.fog(fogId);
        if (fog) {
            fog.pan(x, y);
        }
    };

    Game_Screen.prototype.changeFogZoom = function(fogId, zoom, duration) {
        var fog = this.fog(fogId);
        if (fog) {
            fog.changeZoom(zoom, duration);
        }
    };

    Game_Screen.prototype.changeFogOpacity = function(fogId, opacity, duration) {
        var fog = this.fog(fogId);
        if (fog) {
            fog.changeOpacity(opacity, duration);
        }
    };

    Game_Screen.prototype.eraseFog = function(fogId) {
        this._fogs[fogId] = null;
    };

    Game_Screen.prototype.mapFog = function() {
        this._fogScene = 'map';
    };

    Game_Screen.prototype.battleFog = function() {
        this._fogScene = 'battle';
    };

    Game_Screen.prototype.fogScene = function() {
        return this._fogScene
    };

    //=============================================================================
    // Game_Map
    //=============================================================================

    VictorEngine.FogAndOverlay.setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        VictorEngine.FogAndOverlay.setup.call(this, mapId);
        this.setupFogs();
    };

    VictorEngine.FogAndOverlay.setDisplayPos = Game_Map.prototype.setDisplayPos;
    Game_Map.prototype.setDisplayPos = function(x, y) {
        VictorEngine.FogAndOverlay.setDisplayPos.call(this, x, y);
        this._fogX = this.isLoopHorizontal() ? x : this._displayX;
        this._fogY = this.isLoopVertical() ? y : this._displayY;
    };

    VictorEngine.FogAndOverlay.scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        var lastY = this._displayY;
        VictorEngine.FogAndOverlay.scrollDown.call(this, distance);
        this._fogY += this.isLoopVertical() ? distance : this._displayY - lastY;
    };

    VictorEngine.FogAndOverlay.scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        var lastX = this._displayX;
        VictorEngine.FogAndOverlay.scrollLeft.call(this, distance);
        this._fogX += this.isLoopHorizontal() ? -distance : this._displayX - lastX;
    };

    VictorEngine.FogAndOverlay.scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        var lastX = this._displayX;
        VictorEngine.FogAndOverlay.scrollRight.call(this, distance);
        this._fogX += this.isLoopHorizontal() ? distance : this._displayX - lastX;
    };

    VictorEngine.FogAndOverlay.scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        var lastY = this._displayY;
        VictorEngine.FogAndOverlay.scrollUp.call(this, distance);
        this._fogY += this.isLoopVertical() ? -distance : this._displayY - lastY;
    };

    Game_Map.prototype.fogX = function() {
        return this._fogX;
    };

    Game_Map.prototype.fogY = function() {
        return this._fogY;
    };

    Game_Map.prototype.setupFogs = function() {
        $gameScreen.clearFogs();
        var note = $dataMap.note;
        this._fogX = 0
        this._fogY = 0
        this.createFog(note);
    };

    Game_Map.prototype.createFog = function(note) {
        var regex = VictorEngine.getNotesValues('fog effect');
        var match;
        while (match = regex.exec(note)) {
            this.setupFog(match[1]);
        };
    };

    Game_Map.prototype.setupFog = function(note) {
        var name = String(this.fogName(note, new RegExp("name:[ ]*('[^\']+'|\"[^\"]+\")", 'gi'), ''));
        var id = Number(this.fogValue(note, new RegExp('id:[ ]*(\\d+)', 'gi'), 0));
        var op = Number(this.fogValue(note, new RegExp('opacity:[ ]*(\\d+)', 'gi'), 192));
        var zoom = Number(this.fogValue(note, new RegExp('zoom:[ ]*(\\d+)%?', 'gi'), 100));
        var hue = Number(this.fogValue(note, new RegExp('hue:[ ]*(\\d+)', 'gi'), 0));
        var blend = Number(this.fogValue(note, new RegExp('blend:[ ]*(\\d+)', 'gi'), 0));
        var moveX = Number(this.fogValue(note, new RegExp('move x:[ ]*([+-]?\\d+)', 'gi'), 0));
        var moveY = Number(this.fogValue(note, new RegExp('move y:[ ]*([+-]?\\d+)', 'gi'), 0));
        var panX = Number(this.fogValue(note, new RegExp('pan x:[ ]*(\\d+)', 'gi'), 0));
        var panY = Number(this.fogValue(note, new RegExp('pan y:[ ]*(\\d+)', 'gi'), 0));
        var depth = Number(this.fogValue(note, new RegExp('depth:[ ]*(\\d+)', 'gi'), 1));
        $gameScreen.showFog(id, name, op, hue, blend, depth);
        $gameScreen.moveFog(id, moveX, moveY);
        $gameScreen.panFog(id, panX, panY);
        $gameScreen.changeFogZoom(id, zoom, 0);
    };

    Game_Map.prototype.fogValue = function(note, regex, value) {
        var result = regex.exec(note);
        return result ? result[1] : value;
    };

    Game_Map.prototype.fogName = function(note, regex, value) {
        var result = regex.exec(note);
        return result ? result[1].slice(1, -1) : value;
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    VictorEngine.FogAndOverlay.pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        VictorEngine.FogAndOverlay.pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'fogeffect') {
            var id = Number(args[0]);
            var name = String(args[1]);
            var op = Number(args[2]);
            var hue = Number(args[3]) || 0;
            var blend = Number(args[4]) || 0;
            var depth = Number(args[5]) || 1;
            $gameScreen.showFog(id, name, op, hue, blend, depth)
        }
        if (command.toLowerCase() === 'fogmove') {
            var id = Number(args[0]);
            var x = Number(args[1]);
            var y = Number(args[2]);
            $gameScreen.moveFog(id, x, y)
        }
        if (command.toLowerCase() === 'fogpan') {
            var id = Number(args[0]);
            var x = Number(args[1]);
            var y = Number(args[2]);
            $gameScreen.panFog(id, x, y)
        }
        if (command.toLowerCase() === 'fogopacity') {
            var id = Number(args[0]);
            var op = Number(args[1]);
            var d = Number(args[2]) || 0;
            $gameScreen.changeFogOpacity(id, op, d)
        }
        if (command.toLowerCase() === 'fogzoom') {
            var id = Number(args[0]);
            var z = Number(args[1]);
            var d = Number(args[2]) || 0;
            $gameScreen.changeFogZoom(id, z, d)
        }
    };

    //=============================================================================
    // Spriteset_Base
    //=============================================================================

    VictorEngine.FogAndOverlay.createLowerLayer = Spriteset_Base.prototype.createLowerLayer;
    Spriteset_Base.prototype.createLowerLayer = function() {
        VictorEngine.FogAndOverlay.createLowerLayer.call(this);
        this._fogEffects = [];
    };

    VictorEngine.FogAndOverlay.SpritesetBaseUpdate = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        VictorEngine.FogAndOverlay.SpritesetBaseUpdate.call(this);
        for (var i = 1; i < VictorEngine.Parameters.FogAndOverlay.MaxFogs; i++) {
            this.updateFogs(i);
        };
    };

    Spriteset_Base.prototype.updateFogs = function(fogId) {
        if (!this._fogEffects[fogId] && this.validFog(fogId)) {
            this.createFog(fogId);
            this.updateFog(fogId);
        } else if (this._fogEffects[fogId] && !this.validFog(fogId)) {
            this.deleteFog(fogId);
        } else if (this._fogEffects[fogId] && this.validFog(fogId)) {
            this.updateFog(fogId);
        }
    };

    Spriteset_Base.prototype.updateFog = function(fogId) {
        var sprite = this._fogEffects[fogId];
        var fog = $gameScreen.fog(fogId);
        if (sprite.fogName !== fog.name || sprite.fogHue !== fog.hue ||
            sprite.blendMode !== fog.blend || sprite.z !== fog.z) {
            this.deleteFog(fogId)
            this.createFog(fogId)
        }
        sprite.origin.x = Math.floor(fog.x);
        sprite.origin.y = Math.floor(fog.y);
        sprite.scale.x = fog.zoom;
        sprite.scale.y = fog.zoom;
        sprite.opacity = fog.opacity;
    };

    Spriteset_Base.prototype.setFogSpriteBitmap = function(sprite, bitmap) {
        sprite.bitmap = bitmap;
    };

    //=============================================================================
    // Spriteset_Map
    //=============================================================================

    Spriteset_Map.prototype.createFog = function(fogId) {
        var sprite = new TilingSprite();
        var fog = $gameScreen.fog(fogId);
        var bitmap = ImageManager.loadFog(fog.name, fog.hue);
        sprite.spriteId = sprite.spriteId || Sprite._counter++;
        sprite.bitmap = new Bitmap();
        sprite.fogName = fog.name;
        sprite.fogHue = fog.hue;
        sprite.blendMode = fog.blend;
        sprite.z = fog.z;
        sprite.move(0, 0, Graphics.width, Graphics.height);
        bitmap.addLoadListener(this.setFogSpriteBitmap.bind(this, sprite, bitmap));
        this._fogEffects[fogId] = sprite;
        if (fog.blend === 2 && fog.z > 3) {
            this.addChild(this._fogEffects[fogId]);
        } else {
            this._tilemap.addChild(this._fogEffects[fogId]);
        }
    };

    Spriteset_Map.prototype.deleteFog = function(fogId) {
        this._tilemap.removeChild(this._fogEffects[fogId]);
        this.removeChild(this._fogEffects[fogId]);
        this._fogEffects[fogId] = null;
    };

    Spriteset_Map.prototype.validFog = function(fogId) {
        var fog = $gameScreen.fog(fogId);
        if (!fog || fog.isBattleOnlyFog()) {
            return false;
        }
        return true;
    };

    //=============================================================================
    // Spriteset_Battle
    //=============================================================================

    VictorEngine.FogAndOverlay.createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function() {
        VictorEngine.FogAndOverlay.createBattleback.call(this)
        this._back1Sprite.z = 0
        this._back2Sprite.z = 1
    };

    VictorEngine.FogAndOverlay.updateSpritesetBattle = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        VictorEngine.FogAndOverlay.updateSpritesetBattle.call(this);
        this.sortBattleSprites();
    };

    Spriteset_Battle.prototype.createFog = function(fogId) {
        var sprite = new TilingSprite();
        var fog = $gameScreen.fog(fogId);
        var bitmap = ImageManager.loadFog(fog.name, fog.hue);
        sprite.spriteId = sprite.spriteId || Sprite._counter++;
        sprite.bitmap = new Bitmap();
        sprite.bitmap = ImageManager.loadFog(fog.name, fog.hue);
        sprite.fogName = fog.name;
        sprite.fogHue = fog.hue;
        sprite.blendMode = fog.blend;
        sprite.z = fog.z;
        sprite.move(0, 0, Graphics.width, Graphics.height);
        bitmap.addLoadListener(this.setFogSpriteBitmap.bind(this, sprite, bitmap));
        this._fogEffects[fogId] = sprite;
        if (fog.blend === 2 && fog.z > 3) {
            this.addChild(this._fogEffects[fogId]);
        } else {
            this._battleField.addChild(this._fogEffects[fogId]);
        }
    };

    Spriteset_Battle.prototype.deleteFog = function(fogId) {
        this._battleField.removeChild(this._fogEffects[fogId]);
        this.removeChild(this._fogEffects[fogId]);
        this._fogEffects[fogId] = null;
    };

    Spriteset_Battle.prototype.validFog = function(fogId) {
        var fog = $gameScreen.fog(fogId);
        if (!fog || !fog.isBattleFog()) {
            return false;
        }
        return true;
    };

})();

//=============================================================================
// Game_Fog
//=============================================================================

function Game_Fog() {
    this.initialize.apply(this, arguments);
}

Game_Fog.prototype.constructor = Game_Fog;

(function() {

    Object.defineProperties(Game_Fog.prototype, {
        x: {
            get: function() {
                return this._x;
            },
            configurable: true
        },
        y: {
            get: function() {
                return this._y;
            },
            configurable: true
        },
        hue: {
            get: function() {
                return this._hue;
            },
            configurable: true
        },
        name: {
            get: function() {
                return this._name;
            },
            configurable: true
        },
        zoom: {
            get: function() {
                return this._zoom;
            },
            configurable: true
        },
        blend: {
            get: function() {
                return this._blend;
            },
            configurable: true
        },
        opacity: {
            get: function() {
                return this._opacity;
            },
            configurable: true
        },
        z: {
            get: function() {
                var values = [9, 9, 6, 4, 3.5, 2, 1, -1];
                return values[this._depth] || 9;
            },
            configurable: true
        }
    });

    Game_Fog.prototype.initialize = function() {
        this.initBasic();
    };

    Game_Fog.prototype.isBattleFog = function() {
        return this._battleFog || this._battleOnly;
    };

    Game_Fog.prototype.isBattleOnlyFog = function() {
        return this._battleOnly;
    };

    Game_Fog.prototype.initBasic = function() {
        this.erase();
        this._x = 0;
        this._y = 0;
        this._sX = 0;
        this._sY = 0;
        this._zoomTarget = 192;
        this._zoomDuration = 0;
        this._opacityTarget = 192;
        this._opacityDuration = 0;
    };

    Game_Fog.prototype.show = function(name, opacity, hue, blend, depth) {
        this._name = name;
        this._hue = hue;
        this._blend = blend;
        this._depth = depth;
        this._opacity = opacity;
        this._fixed = ImageManager.isFixedFog(name);
        this._battleFog = ImageManager.isBattleFog(name);
        this._battleOnly = ImageManager.isBattleOnlyFog(name);
        this.update();
    };

    Game_Fog.prototype.erase = function() {
        this._name = '';
        this._hue = 0;
        this._blend = 0;
        this._moveX = 0;
        this._moveY = 0;
        this._depth = 1;
        this._panX = 1;
        this._panY = 1;
        this._zoom = 1;
        this._fixed = false;
        this._opacity = 192;
        this._battleFog = false;
        this._battleOnly = false;
    };

    Game_Fog.prototype.update = function() {
        this.updateMove();
        this.updateZoom();
        this.updateOpacity();
    };

    Game_Fog.prototype.pan = function(x, y) {
        this._panX = Math.max((10 + x) / 10, 1);
        this._panY = Math.max((10 + y) / 10, 1);
    };

    Game_Fog.prototype.move = function(x, y) {
        this._moveX = x;
        this._moveY = y;
    };

    Game_Fog.prototype.changeOpacity = function(opacity, duration) {
        this._opacityTarget = opacity;
        this._opacityDuration = duration;
        if (duration === 0) this._opacity = this._opacityTarget;
    };

    Game_Fog.prototype.changeZoom = function(zoom, duration) {
        this._zoomTarget = zoom / 100;
        this._zoomDuration = duration;
        if (duration === 0) {
            this._zoom = this._zoomTarget;
        }
    };

    Game_Fog.prototype.updateMove = function() {
        this._sX += this._moveX / $gameMap.tileWidth() / 2;
        this._sY += this._moveY / $gameMap.tileHeight() / 2;
        var mapX = $gameMap.fogX();
        var mapY = $gameMap.fogY();
        var tileW = $gameMap.tileWidth();
        var tileH = $gameMap.tileHeight();
        if (this._fixed) {
            this._x = (mapX + this._sX) * tileW;
            this._y = (mapY + this._sY) * tileH;
        } else {
            this._x = (mapX * this._panX + this._sX) * tileW / 2;
            this._y = (mapY * this._panY + this._sY) * tileH / 2;
        }
    };

    Game_Fog.prototype.updateOpacity = function() {
        if (this._opacityDuration > 0) {
            var d = this._opacityDuration;
            this._opacity = (this._opacity * (d - 1) + this._opacityTarget) / d;
            this._opacityDuration--;
        }
    };

    Game_Fog.prototype.updateZoom = function() {
        if (this._zoomDuration > 0) {
            var d = this._zoomDuration;
            this._zoom = (this._zoom * (d - 1) + this._zoomTarget) / d;
            this._zoomDuration--;
        }
    };

})();