/*:

 JK - LibraryData
 @plugindesc This plugin allows the creation and management of a LibraryData book via a Common Event and Plugin Commands.
 @author JK, with PrimeHover's LibraryDataBook plugin as a base
 @version 1.0.0
 @date 12/10/2016

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Screen Options---
 @default

 @param Show in Menu
 @desc Allows having access of the LibraryData book via menu (1: true, 0: false) (Ignore it if you are using Yanfly Main Menu Manager)
 @default 1

 @param Name in Menu
 @desc Changes the name of the LibraryData book on the menu (Ignore it if you are using Yanfly Main Menu Manager)
 @default LibraryData Book

 @param Show Icons
 @desc Show an icon before the name of the LibraryData (1: yes, 0: no)
 @default 1

 @param Background Image
 @desc Image for background of the LibraryData book (PNG image only; Leave it in blank to have the default background)
 @default

 @param ---Category Options---
 @default

 @param Category IDs
 @desc ID of the categories to be displayed separated by commas (,) (each one has to be unique!)
 @default primary, secondary, completed, failed

 @param Category Texts
 @desc Texts of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!)
 @default Primary, Secondary, Completed, Failed

 @param Category Icons ID
 @desc Icons of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!)
 @default 312, 311, 310, 309

 @param ---Default Options---
 @default

 @param Icon Default LibraryData Entry
 @desc ID of the icon to be displayed in case the LibraryData does not have a specific category
 @default 312

 @param Text Default LibraryData Entry
 @desc Default text to be shown when the LibraryData does not have a specific category
 @default Default

 @param Text No Entries
 @desc Text to be shown when no LibraryData entries are available
 @default No Entries Available

 @param ---Additional Options---
 @default

 @param Text Title
 @desc Text of the title of the book
 @default My LibraryData Book

 @param Text Title Color
 @desc Color for the text of the title of the book (RMMV Color Code)
 @default 0

 @help

 Plugin Command:
    LibraryData add Title_of_the_entry                   # Add a LibraryData entry to the book
    LibraryData remove Title_of_the_entry                # Remove a LibraryData entry from the book
    LibraryData clear                                    # Clear the LibraryData
    LibraryData show                                     # Open the LibraryData
    LibraryData change Title_of_the_entry|category       # Changes the category of a LibraryData entry
    LibraryData update Title_of_the_entry                # Updates an existent LibraryData entry
	
	Note: the title does not have to use underscores

 ========================================

 HOW TO USE:

    CREATING A CATEGORY:
    - In order to create a category, you have to set 3 required parameters, which are: [Category IDs], [Category Texts] and [Category Icons IDs]. Here is an example of these three parameters.

        [Category IDs]:         primary, secondary
        [Category Texts]:       Primary, Secondary
        [Category Icons IDs]:   312, 311

    - In the example above, the "primary" in [Category IDs] will be a category. The text that will be displayed when an entry is in this category is "Primary", and the default icon for this category is the ID "312".
    - As I stated earlier, you can have as many categories as you want. You just need to separate the ids, names and icons with a comma (,).
	- If you are using a custom icon pack, you will want to refer to the icons for the desired number.
    - IMPORTANT: Make sure that you have the same amount of ids, texts and icons. In other words, if you have 4 IDs, you must have 4 Texts and 4 Icons.


    WRITING A LibraryData ENTRY:
    - Open the database and go to the section "Common Events"
    - Create a common event with the name "LibraryData" (without quotation marks)
    - Create one or several comments to create Libraries.
    - The comments need to follow a pattern:

        {Example of LibraryData Entry|categoryID|iconID}
        Description of the Entry.

    - The "categoryID" is optional, but it is highly recommended in order to sort your Libraries. You can set as many categories as you want using the parameter [Category IDs]. If you don't specify the category of the entry, it will be set as "default".
    - The "iconID" is also optional. You can put the ID of the icon you want to show for this entry. If you don't specify an icon, the entry will get the default icon for its category.
    - You are allowed to have several comments meaning one entry (you don't need to use just the 6 lines for comments, you can add a new comment right below and keep going).
    - You are allowed to write control characters in the description of the entry (such as \C[n], \I[n], \V[n]).
    - You are allowed to use some special tags to get the name of an item, weapon, armor, enemy or actor. When you are writing the description of a entry, use the tags <enemy:ID>, <actor:ID>, <item:ID>, <weapon:ID> and <armor:ID> to print the name of the particular item on the description. Change "ID" for the corresponding number you want.
    - There is a tag called [break-on-update]. When you use it, all the content of the same entry will be hidden, and it will just appear in the entry book when you call the plugin command "LibraryData update Title_of_the_entry".
    - You are allowed to have as many [break-on-update] as you want. And always when you call the plugin command for updating, it will allow the player to see a new part of the entry.
      (This is a good feature if you want to have a "step-by-step" entry, where each time the player completes the entry, the same entry is updated and new things have to be done).

    REGISTERING A LibraryData ENTRY ON THE BOOK:
    - To register an entry in the book, create an event in the map, go to "Plugin Command" and type the command for adding the entry
         Ex.: LibraryData add Example of LibraryData Title
    - To check the status or category of the entry, you can use these Script commands:

         JKPlugins.LibraryData.isActive("Title of the Entry");
         JKPlugins.LibraryData.is("Title of the Entry", "categoryID");


 ========================================

 Notes:

 "Example of Entry Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

 */

/* Global variable for JK Plugins */
var JKPlugins = JKPlugins || {};
JKPlugins.Parameters = PluginManager.parameters('LibraryData');
JKPlugins.Params = JKPlugins.Params || {};

/* Global variable for the list of Libraries */
JKPlugins.LibraryData = null;

/* Getting the parameters */
JKPlugins.Params.LibraryDataAddToMenu = Number(JKPlugins.Parameters['Show in Menu']);
JKPlugins.Params.LibraryDataMenuText = String(JKPlugins.Parameters['Name in Menu']);
JKPlugins.Params.LibraryDataDisplayType = Number(JKPlugins.Parameters['Display Type']);
JKPlugins.Params.LibraryDataBackgroundImage = String(JKPlugins.Parameters['Background Image']);

JKPlugins.Params.LibraryDataDisplayIcon = Number(JKPlugins.Parameters['Show Icons']);
JKPlugins.Params.LibraryDataIconDefault = Number(JKPlugins.Parameters['Icon Default Entry']);

JKPlugins.Params.LibraryDataTextTitle = String(JKPlugins.Parameters['Text Title']);
JKPlugins.Params.LibraryDataTextTitleColor = Number(JKPlugins.Parameters['Text Title Entry']);

JKPlugins.Params.LibraryDataTextDefault = String(JKPlugins.Parameters['Text Default Entry']);
JKPlugins.Params.LibraryDataTextNoLibraryData = String(JKPlugins.Parameters['Text No Entry']);

JKPlugins.Params.LibraryDataCategoryId = String(JKPlugins.Parameters['Category IDs']);
JKPlugins.Params.LibraryDataCategoryTexts = String(JKPlugins.Parameters['Category Texts']);
JKPlugins.Params.LibraryDataCategoryIcons = String(JKPlugins.Parameters['Category Icons ID']);

(function() {

    /* CLASS LibraryData */
    function LibraryData() {
        this.Libraries = [];
        this._categories = this.populateCategories();
        this._lastCategory = 'default';
    }
    LibraryData.prototype.constructor = LibraryData;

    /* Populates the categories */
    LibraryData.prototype.populateCategories = function() {
        var categories = { 'default': { name: JKPlugins.Params.LibraryDataTextDefault, icon: JKPlugins.Params.LibraryDataIconDefault } };
        if (JKPlugins.Params.LibraryDataCategoryId.trim() != '') {
            var ids = JKPlugins.Params.LibraryDataCategoryId.split(',');
            var names = JKPlugins.Params.LibraryDataCategoryTexts.split(',');
            var icons = JKPlugins.Params.LibraryDataCategoryIcons.split(',');

            for (var i = 0; i < ids.length; i++) {
                ids[i] = ids[i].trim();

                // Name
                if (typeof names[i] != 'undefined') {
                    names[i] = names[i].trim();
                } else {
                    names[i] = JKPlugins.Params.LibraryDataTextDefault + ' - ' + i;
                }

                // Icon
                if (typeof icons[i] != 'undefined') {
                    icons[i] = icons[i].trim();
                } else {
                    icons[i] = JKPlugins.Params.LibraryDataIconDefault;
                }

                // Adding the category
                categories[ids[i]] = { name: names[i], icon: icons[i] };
            }

        }
        return categories;
    };

    /* Gets the Common Event for Libraries */
    LibraryData.prototype.getLibraryDataCommonEvent = function() {

        var LibraryDataVar = null;

        if ($dataCommonEvents) {
            for (var i = 0; i < $dataCommonEvents.length; i++) {
                if ($dataCommonEvents[i] instanceof Object && $dataCommonEvents[i].name == "LibraryData") {
                    LibraryDataVar = $dataCommonEvents[i].list;
                    i = $dataCommonEvents.length;
                }
            }
        }

        if (LibraryDataVar != null) {
            this.populateListOfEntries(LibraryDataVar);
        }

    };

    /* Populates the LibraryData list */
    LibraryData.prototype.populateListOfEntries = function(LibraryDataVar) {
        var str = '';
        var index = -1;
        var header;
        var checkPage;
        var descriptionIndex = 0;
        this.Libraries = [];

        for (var i = 0; i < LibraryDataVar.length; i++) {
            if (typeof LibraryDataVar[i].parameters[0] !== 'undefined') {
                str = LibraryDataVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    header = this.separateTitleAndType(str);
                    this.Libraries.push(
                        {
                            title: header[0],
                            icon: header[1],
                            type: header[2],
                            descriptions: [''],
                            reward: [],
                            updates: 0,
                            active: false
                        }
                    );
                    descriptionIndex = 0;
                    index++;
                } else if (this.Libraries[index]) {
                    str = this.replaceVariants(str);
                    checkPage = this.checkPageBreak(str);
                    if (checkPage == 0) {
                        this.Libraries[index].descriptions[descriptionIndex] += str + '\n';
                    } else if (checkPage == 1) {
                        descriptionIndex++;
                        this.Libraries[index].descriptions[descriptionIndex] = '';
                    }
                }
            }
        }
    };

    /* Replaces the variant tags for enemies, items, etc */
    LibraryData.prototype.replaceVariants = function(str) {

        var variants = ['enemy', 'item', 'weapon', 'armor', 'actor', 'skill'];
        var variantIndex = -1;

        var originalStr = '';
        var regex = /\<(.*?)\>/g;
        var matches = null;

        while ((matches = regex.exec(str)) != null) {
            originalStr = matches[0];
            matches = matches[1];
            matches = matches.split(':');
            variantIndex = variants.indexOf(matches[0]);
            if (variantIndex > -1 && typeof matches[1] !== 'undefined') {
                str = str.replace(originalStr, this.getVariantName(variants[variantIndex], parseInt(matches[1])));
            }
        }

        return str;

    };

    /* Gets the real name of the variant */
    LibraryData.prototype.getVariantName = function(type, id) {
        switch (type) {
            case 'enemy':
                return (typeof $dataEnemies[id] !== 'undefined' ? $dataEnemies[id].name : '');
                break;
            case 'item':
                return (typeof $dataItems[id] !== 'undefined' ? $dataItems[id].name : '');
                break;
            case 'weapon':
                return (typeof $dataWeapons[id] !== 'undefined' ? $dataWeapons[id].name : '');
                break;
            case 'armor':
                return (typeof $dataArmors[id] !== 'undefined' ? $dataArmors[id].name : '');
                break;
            case 'actor':
                return (typeof $dataActors[id] !== 'undefined' ? $dataActors[id].name : '');
                break;
            case 'skill':
                return (typeof $dataSkills[id] !== 'undefined' ? $dataSkills[id].name : '');
                break;
        }
    };

    /* Checks if the string is a title or a description */
    LibraryData.prototype.checkTitle = function(str) {
        if (str.charAt(0) == "{" && str.charAt(str.length - 1) == "}") {
            return true;
        }
        return false;
    };

    /* Checks if the string is a break page */
    LibraryData.prototype.checkPageBreak = function(str) {
        if (str.indexOf('[break-on-update]') > -1) {
            return 1;
        }
        return 0;
    };

    /* Separates the title from the type of the LibraryData */
    LibraryData.prototype.separateTitleAndType = function(str) {

        var regExpTitle = /\{([^)]+)\}/;
        var matches = regExpTitle.exec(str);

        var title;
        var icon;
        var category;

        if (matches == null) {
            icon = JKPlugins.Params.LibraryDataIconDefault;
            category = 'default';
            title = '';
        } else {
            matches[1] = matches[1].trim();
            title = matches[1].split('|');
            if (typeof title[1] != 'undefined' && title[1].trim() != '' && typeof this._categories[title[1].trim()] != 'undefined') {
                category = title[1].trim();
                if (typeof title[2] != 'undefined' && title[2].trim() != '') {
                    icon = title[2].trim();
                } else {
                    icon = this._categories[category].icon;
                }
            } else {
                category = 'default';
                icon = JKPlugins.Params.LibraryDataIconDefault;
            }
            title = title[0].trim();
        }

        return [
            title, icon, category
        ];

    };

    /* Toggle the LibraryData according to the title */
    LibraryData.prototype.toggleLibraryData = function(title, toggle) {
        for (var i = 0; i < this.Libraries.length; i++) {
            if (this.Libraries[i].title == title) {
                this.Libraries[i].active = toggle;
                i = this.Libraries.length;
            }
        }
    };

    /* Updates the LibraryData to show more instructions */
    LibraryData.prototype.updateLibraryData = function(title) {
        for (var i = 0; i < this.Libraries.length; i++) {
            if (this.Libraries[i].title == title) {
                if (this.Libraries[i].updates + 1 <= this.Libraries[i].descriptions.length - 1) {
                    this.Libraries[i].updates = this.Libraries[i].updates + 1;
                    i = this.Libraries.length;
                }
            }
        }
    };

    /* Get the quantity of Libraries for the category menu */
    LibraryData.prototype.getQuantityLibraries = function() {
        var counter = {};
        for (var val in this._categories) {
            if (this._categories.hasOwnProperty(val)) {
                counter[val] = { qtty: 0, name: this._categories[val].name };
            }
        }
        for (var i = 0; i < this.Libraries.length; i++) {
            if (this.Libraries[i].active) {
                counter[this.Libraries[i].type].qtty++;
            }
        }
        return counter;
    };

    /* Get the Libraries for the list */
    LibraryData.prototype.getAvailableLibraries = function() {
        var Libraries = [];
        for (var i = 0; i < this.Libraries.length; i++) {
            if (this.Libraries[i].active && this.Libraries[i].type == this._lastCategory) {
                Libraries.push( { LibraryData: this.Libraries[i], _index: i } );
            }
        }
        return Libraries;
    };

    /* Get the full description of a LibraryData */
    LibraryData.prototype.getFullDescription = function(index) {
        if (typeof this.Libraries[index] !== 'undefined' && typeof this.Libraries[index].descriptions[this.Libraries[index].updates] !== 'undefined') {
            var str = '';
            str += this.Libraries[index].descriptions[this.Libraries[index].updates];
            for (var i = this.Libraries[index].updates - 1; i >= 0; i--) {
                str += '\n\n' + this.Libraries[index].descriptions[i];
            }
            return str;
        }
        return '';
    };

    /* Get the quantity of pages to draw */
    LibraryData.prototype.getQuantityPages = function(index) {
        if (typeof this.Libraries[index] !== 'undefined') {
            if (this.Libraries[index].updates.length == 0) {
                return this.Libraries[index].descriptions.length;
            } else {
                return this.Libraries[index].updates[0];
            }
        }
        return 0;
    };

    /* Clear Libraries */
    LibraryData.prototype.clearLibraries = function() {
        for (var i = 0; i < JKPlugins.LibraryData.Libraries.length; i++) {
            JKPlugins.LibraryData.Libraries[i].active = false;
        }
    };

    /* Changes the category of a LibraryData with the given term (Title of the LibraryData|category) */
    LibraryData.prototype.changeLibraryDataCategory = function(term) {
        term = term.split('|');
        if (term.length == 2) {
            term[0] = term[0].trim();
            term[1] = term[1].trim();
            for (var i = 0; i < this.Libraries.length; i++) {
                if (this.Libraries[i].title == term[0] && typeof this._categories[term[1]] != 'undefined') {
                    this.Libraries[i].icon = JKPlugins.Params.LibraryDataIconCompleted;
                    this.Libraries[i].type = term[1];
                    i = this.Libraries.length;
                }
            }
        }
    };

    /* Gets the index of the LibraryData title */
    LibraryData.prototype.findIndex = function(title) {
        for (var i = 0; i < this.Libraries.length; i++) {
            if (title == this.Libraries[i].title) {
                return i;
            }
        }
        return -1;
    };

    /* Gets the symbol for the category */
    LibraryData.prototype.getIconForCategory = function(symbol) {
        if (typeof this._categories[symbol] != 'undefined') {
            return this._categories[symbol].icon;
        }
        return JKPlugins.Params.LibraryDataIconDefault;
    };

    /* Checks if a LibraryData is active */
    LibraryData.prototype.isActive = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.Libraries[index].active) {
            return true;
        }
        return false;
    };

    /* Checks if a LibraryData has a particular category */
    LibraryData.prototype.is = function(title, category) {
        var index = this.findIndex(title);
        if (index > -1 && this.Libraries[index].type == category) {
            return true;
        }
        return false;
    };


    /* ---------------------------------------------------------- *
     *                 GAME INTERPRETER PROCESS                   *
     * ---------------------------------------------------------- */


    var getAllArguments = function(args) {
        var str = args[1].toString();
        for (var i = 2; i < args.length; i++) {
            str += ' ' + args[i].toString();
        }
        return str;
    };

    /*
     * Turn Libraries on and off via Plugin Command
     */
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'LibraryData') {
            switch (args[0]) {
                case 'add':
                    JKPlugins.LibraryData.toggleLibraryData(getAllArguments(args), true);
                    break;
                case 'remove':
                    JKPlugins.LibraryData.toggleLibraryData(getAllArguments(args), false);
                    break;
                case 'clear':
                    JKPlugins.LibraryData.clearLibraries();
                    break;
                case 'show':
                    SceneManager.push(Scene_LibraryDataBook);
                    break;
                case 'change':
                    JKPlugins.LibraryData.changeLibraryDataCategory(getAllArguments(args));
                    break;
                case 'update':
                    JKPlugins.LibraryData.updateLibraryData(getAllArguments(args));
                    break;
            }
        }
    };


    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /* Creating LibraryData when creating objects */
    var _DataManager_createGameObjects_ = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects_.call(this);
        if (typeof $dataCommonEvents !== "undefined") {
            JKPlugins.LibraryData = new LibraryData();
            JKPlugins.LibraryData.getLibraryDataCommonEvent();
        }
    };

    /*
     * Populating LibraryData variable after loading the whole database
     */
    var _DataManager_onLoad_ = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad_.call(this, object);
        if (object === $dataCommonEvents) {
            if (JKPlugins.LibraryData == null) {
                JKPlugins.LibraryData = new LibraryData();
                JKPlugins.LibraryData.getLibraryDataCommonEvent();
            }
        }
    };

    /* Saves the Libraries when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.Libraries = JKPlugins.LibraryData.Libraries;
        return contents;
    };

    /* Retrieve the Libraries from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        JKPlugins.LibraryData = new LibraryData();
        JKPlugins.LibraryData.Libraries = contents.Libraries;
    };

})();

/* ---------------------------------------------------------- *
 *                        MENU PROCESS                        *
 * ---------------------------------------------------------- */

/*
 * Creates an icon on the menu for accessing the LibraryData book
 * It's compatible with Yanfly Main Menu Manager as well
 */
if (JKPlugins.Params.LibraryDataAddToMenu == 1 && (typeof Yanfly === "undefined" || typeof Yanfly.MMM === "undefined")) {
    var Window_MenuCommand_prototype_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        Window_MenuCommand_prototype_addOriginalCommands.call(this);
        this.addCommand(JKPlugins.Params.LibraryDataMenuText, 'LibraryDatabook');
    };
    var _Scene_Menu_prototype_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_prototype_createCommandWindow.call(this);
        this._commandWindow.setHandler('LibraryDatabook', function () {
            SceneManager.push(Scene_LibraryDataBook);
        });
    };
}

/* ---------------------------------------------------------- *
 *                       WINDOW PROCESS                       *
 * ---------------------------------------------------------- */

/*
 * WINDOW LibraryData TITLE
 */
function Window_LibraryDataBookTitle() {
    this.initialize.apply(this, arguments);
}
Window_LibraryDataBookTitle.prototype = Object.create(Window_Base.prototype);
Window_LibraryDataBookTitle.prototype.constructor = Window_LibraryDataBookTitle;

Window_LibraryDataBookTitle.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, this.fittingHeight(1));
    if (isNaN(parseInt(JKPlugins.Params.LibraryDataTextTitleColor))) {
        JKPlugins.Params.LibraryDataTextTitleColor = 0;
    }
    this.refresh();
};

Window_LibraryDataBookTitle.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.textColor(JKPlugins.Params.LibraryDataTextTitleColor));
    this.drawText(JKPlugins.Params.LibraryDataTextTitle, 0, 0, Graphics.boxWidth, "center");
};


/*
 * WINDOW LibraryData CATEGORY
 */
function Window_LibraryDataBookCategory() {
    this.initialize.apply(this, arguments);
}
Window_LibraryDataBookCategory.prototype = Object.create(Window_Command.prototype);
Window_LibraryDataBookCategory.prototype.constructor = Window_LibraryDataBookCategory;

Window_LibraryDataBookCategory.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, this.fittingHeight(1));
    this._LibraryDataQuantity = JKPlugins.LibraryData.getQuantityLibraries();
    this.select(0);
};

Window_LibraryDataBookCategory.prototype.setListWindow = function(window) {
    this._listWindow = window;
};

Window_LibraryDataBookCategory.prototype.setLibraryDataCategory = function() {
    JKPlugins.LibraryData._lastCategory = this.currentSymbol() || 'default';
};

Window_LibraryDataBookCategory.prototype.maxCols = function() {
    return 1;
};

Window_LibraryDataBookCategory.prototype.windowWidth = function() {
    return parseInt((Graphics.boxWidth * 2) / 6);
};

Window_LibraryDataBookCategory.prototype.windowHeight = function() {
    return Graphics.boxHeight - this.fittingHeight(1);
};

Window_LibraryDataBookCategory.prototype.makeCommandList = function() {
    this._LibraryDataQuantity = this._LibraryDataQuantity || JKPlugins.LibraryData.getQuantityLibraries();
    var added = false;
    for (var val in this._LibraryDataQuantity) {
        if (this._LibraryDataQuantity.hasOwnProperty(val) && this._LibraryDataQuantity[val].qtty > 0) {
            this.addCommand(this._LibraryDataQuantity[val].name, val, true);
            added = true;
        }
    }

    if (!added) {
        this.addCommand(JKPlugins.Params.LibraryDataTextNoLibraryData, 'noLibraryData', false);
    }
};

Window_LibraryDataBookCategory.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = 'left';
    this.resetTextColor();

    var iconWidth = Window_Base._iconWidth + 3;
    if (JKPlugins.Params.LibraryDataDisplayIcon == 1 && this.findSymbol('noLibraryData') == -1) {
        this.drawIcon(JKPlugins.LibraryData.getIconForCategory(this.commandSymbol(index)), rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x + iconWidth, rect.y, rect.width - iconWidth, align);
};

Window_LibraryDataBookCategory.prototype.itemTextAlign = function() {
    return 'center';
};

Window_LibraryDataBookCategory.prototype.refresh = function() {
    Window_Command.prototype.refresh.call(this);
};

Window_LibraryDataBookCategory.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    this.setLibraryDataCategory();
    this._listWindow.refresh();
};




/*
 * WINDOW LibraryData DETAILS
 */
function Window_LibraryDataBookDetails() {
    this.initialize.apply(this, arguments);
}

Window_LibraryDataBookDetails.prototype = Object.create(Window_Selectable.prototype);
Window_LibraryDataBookDetails.prototype.constructor = Window_LibraryDataBookDetails;

Window_LibraryDataBookDetails.prototype.initialize = function() {

    this._LibraryDataPage = 0;
    this._lastTotalPages = 0;
    var height = this.fittingHeight(1);

    var categoryDistance = parseInt((Graphics.boxWidth * 2) / 6);
    Window_Selectable.prototype.initialize.call(this, categoryDistance, height, Graphics.boxWidth - categoryDistance, Graphics.boxHeight - height);

};

Window_LibraryDataBookDetails.prototype.setLibraryDataIndex = function(index) {
    this._LibraryDataIndex = index;
};

Window_LibraryDataBookDetails.prototype.setLibraryDataPage = function(page) {
    this._LibraryDataPage = page;
};

Window_LibraryDataBookDetails.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    if (this._LibraryDataIndex > -1) {
        this.drawLibraryDataTextEx(JKPlugins.LibraryData.getFullDescription(this._LibraryDataIndex), 0, 0);
    }
};

Window_LibraryDataBookDetails.prototype.drawLibraryDataTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(this.verifyFontSize(text));
        textState.height = this.calcTextHeight(textState, false);
        textState.y -= this._LibraryDataPage * textState.height;
        textState.text = this.formatLibraryData(textState.text, textState.height);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

Window_LibraryDataBookDetails.prototype.formatLibraryData = function(text, height) {

    var LibraryData = text;
    var finalText = '';

    var totalSize = 0;
    var textWidth = 0;
    var btmWidth = this.contentsWidth();
    var spaceWidth = this.textWidth(' ');

    var totalPages = 0;
    var totalHeight = 0;
    var btmHeight = this.contentsHeight();

    LibraryData = LibraryData.split(' ');
    for (var i = 0; i < LibraryData.length; i++) {
        if (LibraryData[i].indexOf('\n') == -1) {
            textWidth = this.textWidth(LibraryData[i]);
            if (totalSize + textWidth <= btmWidth) {
                finalText += LibraryData[i] + ' ';
                totalSize += textWidth + spaceWidth;
            } else {
                finalText += '\n';
                finalText += LibraryData[i] + ' ';
                totalSize = textWidth + spaceWidth;
                totalHeight += height;
                if (totalHeight > btmHeight) totalPages++;
            }
        } else {
            LibraryData[i] = LibraryData[i].split('\n');
            for (var j = 0; j < LibraryData[i].length; j++) {
                textWidth = this.textWidth(LibraryData[i][j]);
                if (totalSize + textWidth > btmWidth) {
                    finalText += '\n';
                    totalSize = 0;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
                finalText += LibraryData[i][j] + ' ';
                totalSize += textWidth + spaceWidth;
                if (j + 1 < LibraryData[i].length) {
                    finalText += '\n';
                    totalSize = textWidth + spaceWidth;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
            }
        }
    }

    this._lastTotalPages = totalPages;
    return finalText;

};

Window_LibraryDataBookDetails.prototype.verifyFontSize = function(text) {
    return text.replace(/\\{/g, '').replace(/\\}/g, '');
};

Window_LibraryDataBookDetails.prototype.allowPageUp = function() {
    return this._LibraryDataPage > 0;
};

Window_LibraryDataBookDetails.prototype.allowPageDown = function() {
    if (this._LibraryDataPage < this._lastTotalPages) {
        return true;
    }
    return false;
};

Window_LibraryDataBookDetails.prototype.updateArrows = function() {
    this.downArrowVisible = this.allowPageDown();
    this.upArrowVisible = this.allowPageUp();
};

Window_LibraryDataBookDetails.prototype.isCursorMovable = function() {
    return this.isOpenAndActive();
};

Window_LibraryDataBookDetails.prototype.processWheel = function() {
    if (this.isOpenAndActive()) {
        var threshold = 10;
        if (TouchInput.wheelY >= threshold) {
            this.cursorDown();
        }
        if (TouchInput.wheelY <= -threshold) {
            this.cursorUp();
        }
    }
};

Window_LibraryDataBookDetails.prototype.cursorDown = function() {
    if (this.allowPageDown()) {
        SoundManager.playCursor();
        this._LibraryDataPage++;
        this.refresh();
    }
};

Window_LibraryDataBookDetails.prototype.cursorUp = function() {
    if (this.allowPageUp()) {
        SoundManager.playCursor();
        this._LibraryDataPage--;
        this.refresh();
    }
};

Window_LibraryDataBookDetails.prototype.cursorPagedown = function() {
    this.cursorDown();
};

Window_LibraryDataBookDetails.prototype.cursorPageup = function() {
    this.cursorUp();
};



/*
 * WINDOW LibraryData LIST
 */
function Window_LibraryDataBookList() {
    this.initialize.apply(this, arguments);
}

Window_LibraryDataBookList.prototype = Object.create(Window_Selectable.prototype);
Window_LibraryDataBookList.prototype.constructor = Window_LibraryDataBookList;

Window_LibraryDataBookList.prototype.initialize = function() {

    this._LibraryDataList = [];
    var categoryDistance = parseInt((Graphics.boxWidth * 2) / 6);
    var height = this.fittingHeight(1);
    Window_Selectable.prototype.initialize.call(this, categoryDistance, height, Graphics.boxWidth - categoryDistance, Graphics.boxHeight - height);

    this.refresh();
};

Window_LibraryDataBookList.prototype.setDetailWindow = function(window) {
    this._detailWindow = window;
};

Window_LibraryDataBookList.prototype.maxItems = function() {
    return this._LibraryDataList.length;
};

Window_LibraryDataBookList.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.drawLibraryDataList();
};

Window_LibraryDataBookList.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this.index() > -1) {
        this._detailWindow.setLibraryDataIndex(this._LibraryDataList[this.index()]._index);
    } else {
        this._detailWindow.setLibraryDataIndex(-1);
    }
    this._detailWindow.refresh();
};

Window_LibraryDataBookList.prototype.drawLibraryDataList = function() {
    this._LibraryDataList = JKPlugins.LibraryData.getAvailableLibraries();
    for (var i = 0; i < this._LibraryDataList.length; i++) {
        this.drawLibraryData(this._LibraryDataList[i].LibraryData, i);
    }
};

Window_LibraryDataBookList.prototype.drawLibraryData = function(LibraryData, index) {

    var title = LibraryData.title;
    var rect = this.itemRectForText(index);

    var iconWidth = Window_Base._iconWidth + 3;
    if (JKPlugins.Params.LibraryDataDisplayIcon == 1) {
        this.drawIcon(LibraryData.icon, rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    var width = rect.width - this.textPadding() - iconWidth;
    this.drawText(title, rect.x + iconWidth, rect.y, width);
};


/* ---------------------------------------------------------- *
 *                        SCENE PROCESS                       *
 * ---------------------------------------------------------- */

/*
 * Create the scene of the LibraryData book
 */
function Scene_LibraryDataBook() {
    this.initialize.apply(this, arguments);
}

Scene_LibraryDataBook.prototype = Object.create(Scene_MenuBase.prototype);
Scene_LibraryDataBook.prototype.constructor = Scene_LibraryDataBook;

Scene_LibraryDataBook.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_LibraryDataBook.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this.createWindowDetail();
    this.createWindowList();
    this.createWindowCategory();
    this.createWindowTitle();
    this.changeWindowsOpacity();

};

if (JKPlugins.Params.LibraryDataBackgroundImage != '') {
    Scene_LibraryDataBook.prototype.createBackground = function () {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(JKPlugins.Params.LibraryDataBackgroundImage);
        this.addChild(this._backgroundSprite);
    };
}

Scene_LibraryDataBook.prototype.createWindowCategory = function() {
    this._categoryWindow = new Window_LibraryDataBookCategory();
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setListWindow(this._listWindow);
    this.addWindow(this._categoryWindow);
};

Scene_LibraryDataBook.prototype.createWindowList = function() {
    this._listWindow = new Window_LibraryDataBookList();
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setDetailWindow(this._detailWindow);
    this.addWindow(this._listWindow);
};

Scene_LibraryDataBook.prototype.createWindowDetail = function() {
    this._detailWindow = new Window_LibraryDataBookDetails();
    this._detailWindow.setHandler('cancel', this.onDetailCancel.bind(this));
    this.addWindow(this._detailWindow);
};

Scene_LibraryDataBook.prototype.createWindowTitle = function() {
    this._titleWindow = new Window_LibraryDataBookTitle();
    this.addWindow(this._titleWindow);
};

Scene_LibraryDataBook.prototype.changeWindowsOpacity = function() {
    if (JKPlugins.Params.LibraryDataBackgroundImage != '') {
        this._categoryWindow.opacity = 0;
        this._listWindow.opacity = 0;
        this._detailWindow.opacity = 0;
        this._titleWindow.opacity = 0;
    }
};

Scene_LibraryDataBook.prototype.onCategoryOk = function() {
    this._detailWindow._LibraryDataPage = 0;
    this._categoryWindow.setLibraryDataCategory();
    this._categoryWindow.deactivate();
    this._listWindow.select(0);
    this._listWindow.activate();
};

Scene_LibraryDataBook.prototype.onListCancel = function() {
    this._listWindow.deselect();
    this._listWindow.deactivate();
    this._categoryWindow.activate();
};

Scene_LibraryDataBook.prototype.onListOk = function() {
    this._listWindow.deactivate();
    this._listWindow.hide();
    this._detailWindow.show();
    this._detailWindow.activate();
};

Scene_LibraryDataBook.prototype.onDetailCancel = function() {
    this._detailWindow._LibraryDataPage = 0;
    this._detailWindow.deactivate();
    this._detailWindow.hide();
    this._listWindow.show();
    this._listWindow.activate();
};