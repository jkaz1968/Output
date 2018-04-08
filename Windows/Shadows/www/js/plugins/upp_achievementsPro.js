/*:
 * @plugindesc Version: 1.02 | Achievements plugin for your game.
 * @author William Ramsey (TheUnproPro)
 *
 * @param ---Color Settings---
 *
 * @param BG Color
 * @desc The color drawn behind the list of rewards.
 * @default 0, 0, 0, 0.7
 *
 * @param ---Image Settings---
 *
 * @param BG Location
 * @desc Location of the background displayed when viewing achievements.
 * @default title1
 *
 * @param BG Image
 * @desc Background image shown when viewing achievements.
 * @default Fountain
 *
 * @param Complete Icon
 * @desc Icon drawn for complete achievements.
 * @default 87
 *
 * @param Incomplete Icon
 * @desc Icon drawn for incompelte achievements.
 * @default 16
 * 
 * @param ---Location Settings---
 *
 * @param Popup Window Location
 * @desc Location of the window popup when earning an achievement.
 * @default upper_left
 *
 * @param ---Other Settings---
 *
 * @param Popup Delay
 * @desc How many seconds does the popup stay on screen when you get an achievement?
 * @default 2.5
 *
 * @param Popup Sound
 * @desc What sound effect plays when gaining an achievement?
 * @default Item1
 *
 * @param Add Achievements option to menu
 * @desc Adds the achievement option to the menu.
 * @default true
 *
 * @help
 *
 * To set up achievements for your game, it's best to set up the achievements
 * right at the start of the game. Using the following plugin commands, we'll
 * create a few achievements.
 *
 * 1) - upp_setAchievementName id [Where id is the number. Start with 1 and
 *								   work your way up.]
 * 2) - upp_setAchievementDesc id [This sets the description of the achievement.]
 * 3) - upp_setAchievementLocation id [This sets the location of the achivement.]
 * 4) - upp_setAchievementHidden id [This hides the achievement from the
 * 									 achievement list.]
 * 5) - upp_setAchievementComplete id [This marks the achievement complete. ]
 *
 * It's best to use comments to separate the starting event that creates
 * your achievements.
 *
 * You can also use the plugin command upp_openAchievementsViewer to open
 * the achievements directly.
 * 
 * Window Locations:
 * upper_left, upper_center, upper_right,
 * mid_left, mid_center, mid_right,
 * bottom_left, bottom_center, bottom_right
 *
 * Config BG Location Names:
 * animations, battlebacks1, battlebacks2,
 * characters, enemies, faces, parallaxes,
 * pictures, sv_actors, sv_enemies, system, 
 * tilesets, title1, title2
 *
*/

(function() {
	
	//You may see random { and } containers. They're for me to keep organized with Notepad++.
//{  Initialization and plugin commands.
//Get the params.
var params = PluginManager.parameters("upp_achievementsPro");

var bgColor = params['BG Color'];
var bgLoc = params['BG Location'];
var bgImage = params['BG Image'];
var iconIncomplete = params['Incomplete Icon'];
var iconComplete = params['Complete Icon'];
var upp_popupSeconds = Number(params['Popup Delay']);
var upp_winLocation = params['Popup Window Location'];
var upp_winPopupSound = params['Popup Sound'];
var upp_addAchToMenu = eval(params['Add Achievements option to menu']);

//Add plugin commands.
var cmds = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	cmds.apply(this, arguments);
	
	if(command == "upp_setAchievementName"){
		var id = Number(args[0])-1;
		var name = "";
		var spacer = " ";
		for(var i=1;i<args.length;i++)
		{
			if(i==args.length-1)
			{
				spacer = "";
			}
			name += args[i] + spacer;
		}
		if(typeof $gameSystem.upp_achievements[id] != "object")
		{
			$gameSystem.upp_achievements[id] = new $upr();
			$gameSystem.upp_achievements[id].name = name;
		} else {
			$gameSystem.upp_achievements[id].name = name;
		}
	}
	
	if(command == "upp_setAchievementDesc"){
		var id = Number(args[0])-1;
		var desc = "";
		var spacer = " ";
		for(var i=1;i<args.length;i++)
		{
			if(i==args.length-1)
			{
				spacer = "";
			}
			desc += args[i] + spacer;
		}
		if(typeof $gameSystem.upp_achievements[id] != "object")
		{
			$gameSystem.upp_achievements[id] = new $upr();
			$gameSystem.upp_achievements[id].desc = desc;
		} else {
			$gameSystem.upp_achievements[id].desc = desc;
		}
	}
	
	if(command == "upp_setAchievementLocation"){
		var id = Number(args[0])-1;
		var loc = "";
		var spacer = " ";
		for(var i=1;i<args.length;i++)
		{
			if(i==args.length-1)
			{
				spacer = "";
			}
			loc += args[i] + spacer;
		}
		if(typeof $gameSystem.upp_achievements[id] != "object")
		{
			$gameSystem.upp_achievements[id] = new $upr();
			$gameSystem.upp_achievements[id].loc = loc;
		} else { 
			$gameSystem.upp_achievements[id].loc = loc;
		}
	}
	
	if(command == "upp_setAchievementHidden"){
		var id = Number(args[0])-1;
		$gameSystem.upp_achievements[id].hidden = true;
	}
	
	if(command == "upp_setAchievementComplete"){
		var id = Number(args[0])-1;
		if($gameSystem.upp_achievements[id].complete!=true)
		{
			$gameSystem.upp_achievements[id].complete = true;
			$gameSystem.upp_achievements[id].hidden = false;
			Earned = id;
			displayWindow = true;
			AudioManager.playSe(upp_earnSound);
		}
	}
	
	if(command == "upp_openAchievementsViewer"){
		SceneManager.push(Scene_Achievements);
	}
	
}

//Alias the game system to save achievement data.
var gameSystemAlias = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	gameSystemAlias.call(this);
	this.upp_achievements = upr;

}

var dmCAli = Scene_Load.prototype.onLoadSuccess
Scene_Load.prototype.onLoadSuccess = function() {
    dmCAli.call(this);
	if(typeof $gameSystem.upp_achievements != "object")
	{
		$gameSystem.upp_achievements = {}
	}
};

//Function to update reward entries.
function scanRewardCount(upTo) {
	for(var i=0;i<upTo;i++)
	{
		if(checkRewardExistance(upTo)) {
			createReward(upTo);
		}
	}
}

//Function to check if a reward exists or not.
function checkRewardExistance(id) {
	if($gameSystem.upp_achievements[id] != $upr) {
		return true;
	} else {
		return false;
	}
}

//Function to create a new reward.
function createReward(id) {
	$gameSystem.upp_achievements[id] = new $upr();
	$gameSystem.upp_achievements[id].id = id;
}

//Function to set the name of the reward.
function addRewardName(id, name) {
	//If the entry doesn't exist yet, create it.
	scanRewardCount(id);
	$gameSystem.upp_achievements[id].name = name;
}

//Function to set the desc of the reward.
function addRewardDesc(id, desc) {
	//If the entry doesn't exist yet, create it.
	scanRewardCount(id);
	$gameSystem.upp_achievements[id].desc = desc;
}

//Function to set the location of the reward.
function addRewardLoc(id, loc) {
	//If the entry doesn't exist yet, create it.
	scanRewardCount(id);
	$gameSystem.upp_achievements[id].loc = loc;
}

//Setting up the object that contains what you earn.
function $upr() {
	this.id = 0;
	this.name = "";
	this.desc = "";
	this.loc = "";
	this.hidden = false;
	this.complete = false;
}

//Array to store the objects.
var upr = [];
//}

//{ Windows

	//{ Window Achiement Display
	function Window_AchiementDisplay() {
		this.initialize.apply(this, arguments);
	}

	Window_AchiementDisplay.prototype = Object.create(Window_Base.prototype);
	Window_AchiementDisplay.prototype.constructor = Window_AchiementDisplay;

	//{ Initialize
	Window_AchiementDisplay.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth, Graphics.boxHeight);
		this.lineColor = "rgba(255, 255, 255, 0.25)";
		this.opacity = 0;
		this.lHeight = 2;
		this.lWidth = 2;
		this.refresh();
	}
	//}
	
	//{ Refresh
	Window_AchiementDisplay.prototype.refresh = function(){
		this.drawGrid();
		this.drawInfo();
	}
	//}
	
	//{ Draw Grid
	Window_AchiementDisplay.prototype.drawGrid = function(){
		var pad = this.padding;
		var calcX = Graphics.boxWidth/4;
		var calcWidth=calcX-(pad*2);
		
		var calcY = Graphics.boxHeight/4;
		var calcHeight=calcY-(pad*2);
		
		var lh2 = calcHeight;
		
		this.contents.clear();
		this.contents.fillRect(0, 0, this.contents.width, this.contents.height, "rgba("+bgColor+")");
		
		this.makeHorzLine(0, this.contents.height-this.lHeight, this.contents.width);
		this.makeVertLine(this.contents.width-this.lWidth, 0, this.contents.height);
		
		for(i=0;i<4;i++)
		{
			this.contents.clearRect(0, i*this.contents.height/4, this.contents.width, this.lHeight);
			this.makeHorzLine(0, i*this.contents.height/4, this.contents.width);
			
			this.contents.clearRect(i*this.contents.width/4, 0, this.lWidth, this.contents.height);
			this.makeVertLine(i*this.contents.width/4, 0, this.contents.height);
			
		}
		
	}
	//}
	
	//{ Draw Text
	Window_AchiementDisplay.prototype.drawInfo = function(){
		var pad = this.padding;
		
		var id=(viewPage-1)*16;
		var textPad = pad/2;
		var defaultFontSize = this.contents.fontSize;
		
		maxPages = 1 + (Math.floor($gameSystem.upp_achievements.length/16));
		
		for(i=0;i<4;i++)
		{
			for(i2=0;i2<4;i2++)
			{
				
				id+=1;
				objName = "-";
				objDesc = "-";
				objLoc = "-";
				drawIcon=false;
				this.contents.fontSize = defaultFontSize-12;
				this.contents.drawText(id, (i2*this.contents.width/4)-textPad, (i*this.contents.height/4), this.contents.width/4, this.lineHeight(), 'right');
				this.contents.fontSize = defaultFontSize;
				if(typeof $gameSystem.upp_achievements[id-1] == "object")
				{
					objName = $gameSystem.upp_achievements[id-1].name;
					objDesc = $gameSystem.upp_achievements[id-1].desc;
					objLoc = $gameSystem.upp_achievements[id-1].loc;
					drawIcon=true;
					if($gameSystem.upp_achievements[id-1].hidden == true)
					{
						objName = "???";
						objDesc = "???";
						objLoc = "???";
					}
				}
				if(drawIcon==true)
				{
					switch($gameSystem.upp_achievements[id-1].complete)
					{
						case false:
							this.drawIcon(iconIncomplete, (i2*this.contents.width/4)+pad/2, (i*this.contents.height/4)+this.lineHeight()*3)
						break;
						case true:
							this.drawIcon(iconComplete, (i2*this.contents.width/4)+pad/2, (i*this.contents.height/4)+this.lineHeight()*3)
						break;
					}
				}
				this.contents.fillRect((i2*this.contents.width/4), (i*this.contents.height/4), (this.contents.width/4), this.lineHeight(), "rgba(255, 255, 255, 0.15)");
				this.contents.fillRect((i2*this.contents.width/4), (i*this.contents.height/4)+this.lineHeight(), (this.contents.width/4), this.lineHeight()*2, "rgba(0, 0, 0, 0.25)");
				this.contents.fillRect((i2*this.contents.width/4), (i*this.contents.height/4)+this.lineHeight()*3, (this.contents.width/4), this.lineHeight(), "rgba(50, 50, 50, 0.25)");
				
				this.contents.drawText(objName, (i2*this.contents.width/4)+textPad, (i*this.contents.height/4), this.contents.width/4-(pad*2), this.lineHeight());
				this.contents.fontSize = defaultFontSize-12;
				this.contents.drawText(objLoc, (i2*this.contents.width/4)-textPad, (i*this.contents.height/4)+this.lineHeight()*3, this.contents.width/4, this.lineHeight(), 'right');
				
				var tX=(i2*this.contents.width/4)+textPad;;
				var tY=(i*this.contents.height/4)+this.lineHeight();
				var up=0;
				for(j=0;j<objDesc.length;j++)
				{
					tX=(i2*this.contents.width/4)+textPad+(up*(this.contents.fontSize/2));
					this.contents.drawText(objDesc[j], tX, tY, this.contents.width/4-(pad*2), this.lineHeight());
					objDesc = objDesc.replace(/\\n/g, "\n");
					if(objDesc[j] == "\n")
					{
						up=-1;
						tY+=this.contents.fontSize;
					}
					up+=1;
				}
				
			}
		}
		this.contents.fontSize = defaultFontSize;
	}
	//}
	//{ Make Lines
	Window_AchiementDisplay.prototype.makeHorzLine = function(x, y, width){
		this.contents.fillRect(x, y, width, this.lHeight, this.lineColor)
	}
	
	Window_AchiementDisplay.prototype.makeVertLine = function(x, y, height){
		this.contents.fillRect(x, y, this.lWidth, height, this.lineColor)
	}
	//}
	
	//}
	
	//{ Window Achiement Display 2
	function Window_AchiementDisplay2() {
		this.initialize.apply(this, arguments);
	}

	Window_AchiementDisplay2.prototype = Object.create(Window_Base.prototype);
	Window_AchiementDisplay2.prototype.constructor = Window_AchiementDisplay2;

	//{ Initialize
	Window_AchiementDisplay2.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth, Graphics.boxHeight);
		this.lineColor = "rgba(255, 255, 255, 0.25)";
		this.opacity = 0;
		this.refresh();
	}
	//}
	
	Window_AchiementDisplay2.prototype.standardPadding = function(){
		return 0;
	}
	
	//{ Refresh
	Window_AchiementDisplay2.prototype.refresh = function(){
		this.defaultFontSize = this.contents.fontSize;
		this.contents.fontSize -= 8;
		this.contents.fillRect(0, 0, this.contents.width, this.lineHeight(), "rgba("+bgColor+")");
		this.contents.drawText("< Achievements", Window_Base.prototype.standardPadding(), 0, this.contents.width, this.lineHeight());
		this.contents.drawText("Page: " + viewPage + "/" + maxPages + " >", 0, 0, this.contents.width-Window_Base.prototype.standardPadding(), this.lineHeight(), 'right');
		this.contents.fontSize = this.defaultFontSize;
	}
	
	//}
	//}
	
	//{ Window Achiement Display Map
	function Window_AchiementDisplayMap() {
		this.initialize.apply(this, arguments);
	}

	Window_AchiementDisplayMap.prototype = Object.create(Window_Base.prototype);
	Window_AchiementDisplayMap.prototype.constructor = Window_AchiementDisplayMap;

	//{ Initialize
	Window_AchiementDisplayMap.prototype.initialize = function() {
		Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth/4+36, Graphics.boxHeight/4+this.lineHeight()-12);
		this.opacity = 0;
		this.refresh();
	}
	//}
	
	//{ Refresh
	Window_AchiementDisplayMap.prototype.refresh = function(){
		switch(upp_winLocation){
			case 'upper_left':
				this.x=0;
				this.y=0;
			break;
			
			case 'upper_center':
				this.x=Graphics.boxWidth/2-(this.width/2);
				this.y=0;
			break;
			
			case 'upper_right':
				this.x=Graphics.boxWidth-this.width;
				this.y=0;
			break;
			
			case 'mid_left':
				this.x=0;
				this.y=Graphics.boxHeight/2-(this.height/2);
			break;
			
			case 'mid_center':
				this.x=Graphics.boxWidth/2-(this.width/2);
				this.y=Graphics.boxHeight/2-(this.height/2);
			break;
			
			case 'mid_right':
				this.x=Graphics.boxWidth-this.width;
				this.y=Graphics.boxHeight/2-(this.height/2);
			break;
			
			case 'bottom_left':
				this.x=0;
				this.y=Graphics.boxHeight-this.height;
			break;
			
			case 'bottom_center':
				this.x=Graphics.boxWidth/2-(this.width/2);
				this.y=Graphics.boxHeight-this.height;
			break;
			
			case 'bottom_right':
				this.x=Graphics.boxWidth-this.width;
				this.y=Graphics.boxHeight-this.height;
			break;
		}
		this.contents.clear();
		this.defaultFontSize = this.contents.fontSize;
		this.contents.fillRect(0, 0, this.contents.width, this.contents.height, "rgba("+bgColor+")");
		this.contents.fillRect(0, 0, this.contents.width, this.lineHeight(), "rgba(255, 255, 255, 0.15)");
		this.contents.fillRect(0, this.lineHeight(), this.contents.width, this.lineHeight()*2, "rgba(0, 0, 0, 0.25)");
		this.contents.fillRect(0, this.lineHeight()*3, this.contents.width, this.lineHeight(), "rgba(50, 50, 50, 0.25)");
		if(typeof $gameSystem.upp_achievements[Earned] == "object")
		{
			var pad = this.padding/2;
			this.contents.drawText($gameSystem.upp_achievements[Earned].name, pad, 0, this.contents.width, this.lineHeight());
			this.contents.fontSize -= 12;
			objDesc = $gameSystem.upp_achievements[Earned].desc.replace(/\\n/g, "\n");
			var tx = 0;
			var ty = 0;
			for(i=0;i<objDesc.length;i++)
			{
				this.contents.drawText(objDesc[i], pad+tx/2, this.lineHeight()+ty+pad, this.contents.width, this.contents.fontSize);
				if(objDesc[i] == "\n")
				{
					tx=-this.contents.fontSize;
					ty+=this.contents.fontSize;
				}
				tx+=this.contents.fontSize;
			}
			this.contents.drawText($gameSystem.upp_achievements[Earned].id+1, 0, 0, this.contents.width-pad, this.lineHeight(), 'right');
			this.contents.fontSize = this.defaultFontSize-8;
			this.contents.drawText($gameSystem.upp_achievements[Earned].loc, 0, this.lineHeight()*3, this.contents.width-pad, this.lineHeight(), 'right');
			
			if($gameSystem.upp_achievements[Earned].complete == true)
			{
				this.drawIcon(iconComplete, 0, this.lineHeight()*3);
			} else { 
				this.drawIcon(iconIncomplete, 0, this.lineHeight()*3);
			}
		}
		
		this.contents.fontSize = this.defaultFontSize;
	}
	
	//}
	//}

	//{ Window_MenuCommand Alias
	var winMenuCommand = Window_MenuCommand.prototype.addOriginalCommands
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		winMenuCommand.call(this);
		if(upp_addAchToMenu==true)
		{
			this.addCommand("Achievements", 'achievements');
		}
	}
	//}
//}

//{ Scenes

	var viewPage=1;
	var maxPages = 1;
	var Earned=0;
	var displayWindow = false;
	var upp_earnSound = {
		name: upp_winPopupSound,
		volume: 70,
		pitch: 100,
		pan: 0
	}
	var upp_clearTimer=0;
	var fadeType;
	//{ Scene Tmp
	function Scene_Achievements() {
    this.initialize.apply(this, arguments);
	}

	Scene_Achievements.prototype = Object.create(Scene_Base.prototype);
	Scene_Achievements.prototype.constructor = Scene_Achievements;
	
	//{ Initialize
	Scene_Achievements.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this);
	}
	//}
	
	//{ Create
	Scene_Achievements.prototype.create = function() {
		Scene_Base.prototype.create.call(this);
		this.createList();
	}
	
	Scene_Achievements.prototype.createList = function() {
		this.winTmp = new Window_AchiementDisplay(0, Window_Base.prototype.lineHeight()/2-2, Graphics.boxWidth, Graphics.boxHeight);
		this.winTmp2 = new Window_AchiementDisplay2(0, 0, Graphics.boxWidth, Graphics.boxHeight);
		this.graphic = new Sprite();
		var img;
		switch(bgLoc)
		{
			case "animations":
				img = ImageManager.loadAnimation(bgImage);
			break;
			
			case "battlebacks1":
				img = ImageManager.loadBattleback1(bgImage);
			break;
			
			case "battlebacks2":
				img = ImageManager.loadBattleback2(bgImage);
			break;
			
			case "enemies":
				img = ImageManager.loadEnemy(bgImage);
			break;
			
			case "characters":
				img = ImageManager.loadCharacter(bgImage);
			break;
			
			case "faces":
				img = ImageManager.loadFace(bgImage);
			break;
			
			case "parallaxes":
				img = ImageManager.loadParallax(bgImage);
			break;
			
			case "pictures":
				img = ImageManager.loadPicture(bgImage);
			break;
			
			case "sv_actors":
				img = ImageManager.loadSvActor(bgImage);
			break;
			
			case "sv_enemies":
				img = ImageManager.loadSvEnemy(bgImage);
			break;
			
			case "system":
				img = ImageManager.loadSystem(bgImage);
			break;
			
			case "tileset":
				img = ImageManager.loadTileset(bgImage);
			break;
			
			case "title1":
				img = ImageManager.loadTitle1(bgImage);
			break;
			
			case "title2":
				img = ImageManager.loadTitle2(bgImage);
			break;
		}
		this.graphic.bitmap = img;
		this.addChild(this.graphic);
		this.addChild(this.winTmp2);
		this.addChild(this.winTmp);
	}
	//}
	
	Scene_Achievements.prototype.update = function(){
		
		if(Input.isRepeated("right"))
		{
			if(viewPage<maxPages)
			{
				viewPage +=1;
				SoundManager.playCursor();
			
				this.winTmp.refresh();
				this.winTmp2.refresh();
			}
		}
		if(Input.isRepeated("left"))
		{
			if(viewPage>1)
			{
				viewPage -=1;
				SoundManager.playCursor();
			
				this.winTmp.refresh();
				this.winTmp2.refresh();
			}
		}
		
		if(Input.isTriggered("escape"))
		{
			SoundManager.playCancel();
			SceneManager.pop();
		}
		Scene_Base.prototype.update.call(this);
	}
	
	//}
	
	//{ Scene Map Alias
	var Scene_Map_Alias = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function() {
		Scene_Map_Alias.call(this);
		this.createMapAchievementOverlay();
	}
	
	Scene_Map.prototype.createMapAchievementOverlay = function() {
		this.upp_achievementPopup = new Window_AchiementDisplayMap();
		this.upp_achievementPopup.alpha = 0;
		this.addChild(this.upp_achievementPopup);
	}
	
	var Scene_Map_Update_Alias = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		if(displayWindow == true){
			upp_clearTimer=0;
			this.upp_achievementPopup.alpha = 1;
			this.upp_achievementPopup.refresh();
			displayWindow=false;
			fadeType=1;
		}
		upp_clearTimer+=1;
		
		if(upp_clearTimer>=60*upp_popupSeconds)
		{
			this.upp_achievementPopup.alpha = 0;
		}
		Scene_Map_Update_Alias.call(this);
	}
	//}
	
	//{ Scene Menu Alias
	var ScMenuCmds = Scene_Menu.prototype.createCommandWindow
	Scene_Menu.prototype.createCommandWindow = function() {
		ScMenuCmds.call(this);
		this._commandWindow.setHandler('achievements',      this.cmdAchievements.bind(this));
	}
	Scene_Menu.prototype.cmdAchievements = function(){
		viewPage=1;
		SceneManager.push(Scene_Achievements);
	}
	//}
//}

})();