/*:
-------------------------------------------------------------------------------
@title Shop Manager
@author Hime --> HimeWorks (http://himeworks.com)
@date Apr 12, 2016
@version 1.0
@filename HIME_ShopManager.js
@url 

If you enjoy my work, consider supporting me on Patreon!

https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

Main Website: http://himeworks.com
Facebook: https://www.facebook.com/himeworkscom/
Twitter: https://twitter.com/HimeWorks
Youtube: https://www.youtube.com/c/HimeWorks
Tumblr: http://himeworks.tumblr.com/
-------------------------------------------------------------------------------
@plugindesc Core plugin that manages shop information. Required for
many shop-related plugins.
@help 
-------------------------------------------------------------------------------
== Description ==

In RPG Maker, you can open shops to allow players to buy or sell items.
However, the functionality that is available is very limited.

The Shop Manager provides basic shop management functionality.

At the core of this plugin is the ability to assign "names" to your shops,
and to be able to have the game open a specific shop when you would like to
enter one.

The ability to call up specific shops allows you to keep track of additional
information about the shop that would otherwise not be possible.

For example, you may want the shop to maintain a set of items for a period
of time, and then randomly refresh them after that time has passed.

Or perhaps you may want the shop to hold only a limited amount of each
item, and once you buy them all, it will be out of stock.

The shop manager serves as the basis for additional shop plugins and aims
to improve compatibility between them, as well as providing a standard way
to manage shops and shop goods.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Free for use in commercial projects, but it would be nice to let me know
- Please provide credits to HimeWorks

== Change Log ==

1.0 - Apr 12, 2016
 * Initial release

== Usage ==

  -- Opening a Shop --
  
Before opening a shop, you must tell the game which shop you would like
to open. This can be done with a script call:

  Shop.open( SHOP_NAME );
  
Where the SHOP_NAME is any name you would like. Make sure you're using
a script call and not a plugin command.

For example, you might
call your shop

  "my shop" 
  "city1_weapon_shop1"
  "fruit_shop2"
  
And so on. You might come up with a naming scheme that is easy to remember.
Once the name is set, it cannot be changed, so choose wisely!

When a shop is open, the game will automatically load all of the information
for that shop. This plugin offers some extra functionality built-in, but 
additional plugins can be developed on top of it.

Finally, you can run the "Open Shop Processing" command to go to the shop.

  -- Setting up Shop Goods --
  
After opening a shop, the first time you run the "shop processing" event
command will involve setting up the shop goods. For example, if your shop
sells potions and fruits, the shop will have those set up in the store
automatically.

During this setup process, any other "setup" methods provided by other
plugins will be called. The setup process serves as the initialization
process.

After that, however, the shop will not set up again until you choose to
reset the shop. This means that whenever you visit the shop, it will be
the same as when you left, unless you explicitly change it.

  -- Reset Shop Goods --
  
If you would like to reset the shop, use the script call

  Shop.resetShop( SHOP_NAME )
  
The next time you run the "shop processing" event, the shop will automatically
set up the goods again.

By default, it will simply set up all of the items that you specify.
Any custom changes to the shop that occur during the game will be reverted.

  -- Multiple Shops in one Event --
  
If you would like to open different shops in the same event, simply make the
script call before the "Open Shop Processing" command.

For example, you can use conditional branches to ask the player which shop
they would like to visit, and then open the appropriate shop.

  -- Same Shop from Different Events --
  
You can visit the same shop from different events by opening the same shop.

For example, if you have a traveling merchant that follows you around and
appears at every dungeon, and you wanted to make it look like the same person
that the player had done business with before, you would simply use the
shop open script call with the same name.

I would recommend using a common event for this, so that whenever the common
event is called, you know it is the same shop.

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.ShopManager = 1;
TH.ShopManager = TH.ShopManager || {};

function Shop() {
  throw new Error('This is a static class');
};

function Game_Shop() {
  this.initialize.apply(this, arguments);
}

function Game_ShopGood() {
  this.initialize.apply(this, arguments);
}

(function ($) {

  Shop._currentShop = null;

  Shop.open = function(shopId) {
    this._currentShop = this.getShop(shopId);
  };

  Shop.getShop = function(shopId) {  
    return $gameSystem.getShop(shopId);
  };

  Shop.clearShop = function() {
    this._currentShop = null;
  };
  
  Shop.resetShop = function(shopId) {
    this.getShop(shopId).reset();
  };

  Shop.currentShop = function() {
    return this._currentShop;
  };
  
  /***************************************************************************/
  
  Object.defineProperty(Game_Shop.prototype, 'id', {
    get: function() {
        return this._id;
    },
    configurable: true
  });

  Game_Shop.prototype.initialize = function(shopId) {
    this._id = shopId; 
    this._goods = [];
    this._needsSetup = true;    
  };
  
  /* Next time the shop is opened, it needs to be reset */
  Game_Shop.prototype.reset = function() {
    this._needsSetup = true;
  };
  
  /* Setup shop goods, if needed */
  Game_Shop.prototype.setupGoods = function(goods) {
    if (!this._needsSetup) {
      return;
    }
    this._needsSetup = false;
    this._goods = []
    for (var i = 0, len = goods.length; i < len; i++) {
      var data = goods[i];
      
      var itemType = data[0];
      var itemId = data[1];
      var priceType = data[2];
      var price = data[3];
      var shopPrice;
      
      if (itemType === 0) {
        item = $dataItems[itemId];
      }
      else if (itemType === 1) {
        item = $dataWeapons[itemId];
      }
      else if (itemType === 2) {
        item = $dataArmors[itemId];
      }
      
      /* Type of price
       *   0 - price from item in database
       *   1 - custom shop price
       */
      if (priceType === 0) {
        shopPrice = item.price;
      }
      else {
        shopPrice = price;
      }
      var shopGood = new Game_ShopGood(i, item, shopPrice)
      this.addGood(shopGood);
    }
  };
  
  Game_Shop.prototype.goods = function() {
    return this._goods;
  };
  
  Game_Shop.prototype.id = function() {
    return this._id;
  };
  
  Game_Shop.prototype.addGood = function(shopGood) {
    this._goods.push(shopGood);
  };
  
  Game_Shop.prototype.getGood = function(goodId) {
    return this._goods[goodId];
  };
  
  /***************************************************************************/
  
  Game_ShopGood.prototype.initialize = function(id, item, price) {
    this._id = id;
    this._item = item;
    this._shopPrice = price;
  };
  
  Game_ShopGood.prototype.id = function() {
    return this._id;
  }
  
  Game_ShopGood.prototype.item = function() {
    return this._item;
  }
  
  Game_ShopGood.prototype.price = function() {
    return this._shopPrice;
  }
  
  /***************************************************************************/
  
  var TH_Shop_GameSystem_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    TH_Shop_GameSystem_initialize.call(this);
    this._shops = {}
  };
  
  Game_System.prototype.getShop = function(shopId) {
    if (this._shops[shopId]) {
      return this._shops[shopId];
    }   
    var shop = new Game_Shop(shopId);
    this._shops[shopId] = shop
    
    return shop;
  };
  
  /***************************************************************************/
  
  /* Prepare the current shop. If it has no goods, initialize some goods. */
  Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
    this._shop = Shop.currentShop();
    this.prepareGoods(goods);
    this._goods = this._shop.goods()
    this._purchaseOnly = purchaseOnly;
    this._item = null;
    this._shopGood = null;
  };
  
  Scene_Shop.prototype.prepareGoods = function(goods) {
    this._shop.setupGoods(goods)
  };
  
  var TH_Shop_SceneShop_onBuyOk = Scene_Shop.prototype.onBuyOk;
  Scene_Shop.prototype.onBuyOk = function() {
    this._shopGood = this._buyWindow.shopGood();
    TH_Shop_SceneShop_onBuyOk.call(this);
  };
  
  Scene_Shop.prototype.buyingPrice = function() {
    return this._buyWindow.price(this._shopGood);
  };
  
  /***************************************************************************/
  /* We use an array of shop goods now */
  Window_ShopBuy.prototype.makeItemList = function() {
    this._data = [];
    var shopGoods = this._shopGoods;
    for (var i = 0, len = shopGoods.length; i < len; i++) {
      this._data.push(shopGoods[i]);
    }
  }
  
  /* Prices are determined by the shop good */
  Window_ShopBuy.prototype.price = function(shopGood) {
    return shopGood.price();
  };
  
  Window_ShopBuy.prototype.isEnabled = function(shopGood) {
    return (shopGood && shopGood.price() <= this._money &&
            !$gameParty.hasMaxItems(shopGood.item()));
  };
  
  /* Overwrite. */
  Window_ShopBuy.prototype.shopGood = function() {
    return this._data[this.index()];
  };
  
  /* Overwrite. Item is based on the good selected */
  Window_ShopBuy.prototype.item = function() {
    return this.shopGood().item();
  };
  
  /* Overwrite. Draw shop goods */
  Window_ShopBuy.prototype.drawItem = function(index) {
    var good = this._data[index];    
    var rect = this.itemRect(index);    
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(good));
    this.drawItemDetails(good, rect)    
    this.changePaintOpacity(true);
  };
  
  Window_ShopBuy.prototype.drawItemDetails = function(good, rect) {
    var priceWidth = 96;
    this.drawItemName(good.item(), rect.x, rect.y, rect.width - priceWidth);
    this.drawText(good.price(), rect.x + rect.width - priceWidth, rect.y, priceWidth, 'right');
  }
})(TH.ShopManager);