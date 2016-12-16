var cache = require('./cacheFiles.js');
// Function to return the bower path by passing the bower package name
var bowerPath = require('../../bower-discover');

var collectionDir;

var buildConfig = function (project) {

  collectionDir = project + '/collections';

  // Core config file from cache
  var config = cache.load(project + '/core/config.json');

  // Array of child configuration files
  var collections = config.load;

  // Build on top of core config a recursive configuration
  var allCollections = loadConfig(collectionDir, collections);

  return allCollections;

};

// The initial config loading logic
var loadConfig = function (root, list) {

  // Storage arrays
  var collectionNames = [];
  var menuItems = [];
  var menu = {};
  var bowerItems = [];
  var bower = {};

  // Load a list of configuration files relative to a given root
  function load (loadList, root) {

    for (var i = 0; i < loadList.length; i++) {

      // Name of this collection
      var collection = loadList[i];

      // Path to the configuration file
      var collectionPath = collectionDir + '/' + collection + '/config.json';
      // Fetch from cache or create cache
      var collectionConfig = cache.load(collectionPath);

      // Process any bower items
      if (typeof collectionConfig.bower !== 'undefined' && collectionConfig.bower.length) {

        bowerItems = bowerItems.concat(collectionConfig.bower);

        for (var l = 0; l < bowerItems.length; l++) {
          var bowerItem = bowerItems[l];

          var bowerName = bowerItem.name;
          var bowerPackage = bowerItem.package;
          var bowerVersion = bowerItem.version;
          var pathArray = bowerPath(bowerItem.name);

          for (var m = 0; m < pathArray.length; m++) {
            // console.log('bowerName', bowerName);
            // console.log('bowerPath', pathArray[m]);
            // console.log();
          }

          var bowerObj = {
            name: bowerName,
            version: bowerVersion,
            package: bowerPackage,
            paths: pathArray
          };

          // Detect if menu object exists yet
          if (typeof bower[bowerName] == 'undefined') {
            bower[bowerName] = {};
          }

          // Add item to the menu object's array
          bower[bowerName] = bowerObj;


//          console.log('path to ', bower.name, bowerPath(bower.name), '\n');
        }

      }

      // Process any menu items
      if (typeof collectionConfig.menuItems !== 'undefined' && collectionConfig.menuItems.length) {

        // Merge menu items into the core array
        menuItems = menuItems.concat(collectionConfig.menuItems);

        // Loop through the menu items to build seperate menu level object
        for (var j = 0; j < collectionConfig.menuItems.length; j++) {

          // Menus that the item is being applied to
          var menus = collectionConfig.menuItems[j].menu;
          // The menu item itself - copies whatever object schema is found
          var item = collectionConfig.menuItems[j].item;

          // For each menu that the item is being applied to
          for (var k = 0; k < menus.length; k++) {
            // Menu that is being applied to
            var menuName = menus[k];

            // Detect if menu object exists yet
            if (typeof menu[menuName] == 'undefined') {
              menu[menuName] = [];
            }

            // Add item to the menu object's array
            menu[menuName].push(item);

          }

        }


      }

      // Process any child configuration files
      if (typeof collectionConfig.load !== 'undefined' && collectionConfig.load.length) {

        // Loop to next child configuration file
        load(collectionConfig.load, collection);

      }

      // Track the collection name for later reference
      if (typeof root !== 'undefined') {
        collectionNames.push(root + '.' + collection);
      } else {
        collectionNames.push(collection);
      }

    }

  }


  load(list);

  return {collections: collectionNames, menuItem: menuItems, menu: menu, bowerItems: bowerItems, bower: bower};

};


module.exports = buildConfig;
