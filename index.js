'use strict';
var fs = require('fs'),
    crypto = require('crypto');

module.exports = function (sReferenceName, oReferenceObject, oArguments) {

    var oParameters = {
        name : sReferenceName,
        delay : 50,
        filepath : 'globals/'
    };

    defaultArguments(oParameters, oArguments);
    readJSON(oParameters.filepath, oParameters.name, oReferenceObject);

    if (!fs.existsSync(oParameters.filepath)) {
        fs.mkdirSync(oParameters.filepath);
    }

    var oProperties = {
        name : { value : oParameters.name },
        interval : {
            value : null,
            writable : true
        },
        delay : { value : oParameters.delay },
        filepath : { value : oParameters.filepath },
        fileHash : { 
            value : hashObject(oReferenceObject),
            writable : true
        },
        object : { 
            value : oReferenceObject,
            writable : true
        }
    };

    var oPrototype = {
        check : function () {
            var sMemoryHash = hashObject(this.object);
            if (sMemoryHash !== this.fileHash) {
                this.save();
                this.fileHash = sMemoryHash;
            }
        },
        save : function () {
            fs.writeFileSync(
                this.filepath + this.name,
                JSON.stringify(this.object)
            );
        },
        remove : function () {
            this.object = {};
            this.save();
            this.fileHash = hashObject({});
        },
        start : function () {
            this.interval = setInterval(this.check.bind(this), this.delay);
        },
        stop : function (bSave) {
            if (typeof bSave === 'undefined') { bSave = false; }
            clearInterval(this.interval);
            if (bSave) { this.save(); }
        }
    };

    return Object.create(oPrototype, oProperties);
}

function readJSON(sFilepath, sReferenceName, oReferenceObject) {
    var aFiles = fs.readdirSync(sFilepath); 
    if (aFiles.indexOf(sReferenceName) > -1) {
        var sJSON = fs.readFileSync(sFilepath + sReferenceName, 'utf8');
        var oStored = JSON.parse(sJSON);
        var aKeys = Object.keys(oStored);
        for (var i = aKeys.length - 1; i >= 0; i--) {
            oReferenceObject[aKeys[i]] = oStored[aKeys[i]];
        }
    }
}

function hashObject(object) {
    var sJSON = JSON.stringify(object),
        oSHA256 = crypto.createHash('sha256');
    oSHA256.update(sJSON);
    return oSHA256.digest('hex');
}

function defaultArguments(oDefault, oArguments) {
    if (typeof oArguments === 'undefined') { return; }
    for (var sKey in oDefaults) {
        if (oArguments.hasOwnProperty(sKey)) {
            oDefault[sKey] = oArguments[sKey];
        }
    }
}