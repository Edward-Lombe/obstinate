# obstinate
---
A simple reference based interface for easy watching and saving of Javascript objects

# How to install
---
`npm install obstinate`

# How to use
---
Usage right now is fairly simple. If control over the resultant watch object is not required, it can be set up as follows by passing a reference to the object you wish to persist.

```javascript
var obstinate = require('obstinate'),
	obj = {};

obstinate('obj', obj).start();
```

All changes to the object will (hopefully) be persisted. If control over the watch object is needed, simply assign a var to the return value of the obstinate function as such.

```javascript
var	obj = {},
	objControl = obstinate('obj', obj);

// Start watching the object
objControl.start();

// Stop watching the object
objControl.stop();

// Remove the object completely
objControl.remove();

// Manually call save
objControl.save();

```

Additionally a third options argument can be passed to the obstinate in order to change some of the default parameters.

```javascript
var	obj = {},
	options = {
		// The folder in which to save the files
		filepath : 'data/',
		// The delay between each check of the object in ms
		delay : 200
	},
	objControl = obstinate('obj', obj, options);
```