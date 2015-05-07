    if(typeof JSON!=="object"){JSON={}}(function(){function f(n){return n<10?"0"+n:n}function this_value(){return this.valueOf()}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value}var cx,escapable,gap,indent,meta,rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

    /****************************** 
        zl_F2AE_readJSON()
          
        Description:
        Read the JSON file, output an object
         
        Parameters:
        targetFile - JSON file

        Returns:
        layersObject - object of Framer layers
    ******************************/
	function zl_F2AE_readJSON (targetFile){
        
        if (targetFile.exists == true){
            if (targetFile.open("r")){
                var layersJSON = targetFile.read();
                var layersObject = JSON.parse(layersJSON);
                targetFile.close();
            }
        } else {
            alert("Not a valid file!");
        }

		return layersObject;
	} // end zl_F2AE_readJSON


    /****************************** 
        zl_F2AE_createComp()
          
        Description:
        Read the JSON file, output an object
         
        Parameters:
        compObject - comp object from json

        Returns:
        framerComp - generated comp
    ******************************/
	function zl_F2AE_createComp (compObject, compFolder){

		var compPixelAspectRatio = 1.0;
		var compDuration = 30;
		var compFrameRate = 24;
        
        var thisHeight = compObject.layerFrame.height;
        if (thisHeight < 4) thisHeight = 4;
        
		var framerComp = compFolder.items.addComp(compObject.name, compObject.layerFrame.width, thisHeight, compPixelAspectRatio, compDuration, compFrameRate);

        framerComp.bgColor = [1, 1, 1];

		return framerComp;
	} // end zl_F2AE_createComp


    /****************************** 
        zl_F2AE_processChildren()
          
        Description:
        This is really really sloppy but it works.

        Parameters:
        thisJsonObject - current object from the json
        thisObjectComp - current comp from object
        compFolder - the folder
        jsonPath - file path

        Returns:
        framerComp - generated comp
    ******************************/
    function zl_F2AE_processChildren(thisJsonObject, thisObjectComp, compFolder, jsonPath){
        var numChildren = thisJsonObject.children.length;
    
        if (thisJsonObject.image == undefined){
            if (numChildren !== 0){
                for (var j = numChildren-1; j >= 0; j--){
                    var thisChild = thisJsonObject.children[j];
                    var newComp = zl_F2AE_createComp(thisChild, compFolder);
                    var newCompAsLayer = thisObjectComp.layers.add(newComp);
                    newCompAsLayer.transform.anchorPoint.setValue([0,0]);
                    newCompAsLayer.transform.position.setValue([thisChild.layerFrame.x - thisJsonObject.layerFrame.x, thisChild.layerFrame.y - thisJsonObject.layerFrame.y]);
                    zl_F2AE_processChildren(thisChild, newComp, compFolder, jsonPath);
                }
            } else {
                alert (thisJsonObject.name + " impossible");
            }
        }

        if (thisJsonObject.image !== undefined){

            var imgPath = thisJsonObject.image.path;
            var curFilePath = new File(jsonPath + imgPath);

            try {
                var curFile = app.project.importFile(new ImportOptions(curFilePath));
            } catch (e) {
                var curFile = app.project.importPlaceholder(thisJsonObject.name, thisJsonObject.layerFrame.width, thisJsonObject.layerFrame.height, 24, 30);
            }

            curFile.parentFolder = thisObjectComp.parentFolder;
            var curFileAsLayer = thisObjectComp.layers.add(curFile);

            curFileAsLayer.name = thisJsonObject.name;
            curFileAsLayer.enabled = thisJsonObject.visible;
            
            curFileAsLayer.transform.anchorPoint.setValue([0,0]);
            curFileAsLayer.transform.position.setValue([0,0]);

            if (numChildren !== 0){
                // there shouldn't be a precomp (should just be an image), so set each curFileAsLayer.parent to thisJsonObject 
            }
        }
    } // end processChildren



    function zl_F2AE_importImage(jsonPath, objectComp, objectKey) {
        var keyImagePath = objectKey.image.path;
        var curFilePath = new File(jsonPath + keyImagePath);

        try {
            var curFile = app.project.importFile(new ImportOptions(curFilePath));
        } catch (e) {
            var curFile = app.project.importPlaceholder(objectKey.name, objectKey.layerFrame.width, objectKey.layerFrame.height, 24, 30);
        }

        curFile.parentFolder = objectComp.parentFolder;
        var curFileAsLayer = objectComp.layers.add(curFile);

        curFileAsLayer.name = objectKey.name;
        curFileAsLayer.enabled = objectKey.visible;
                
        curFileAsLayer.transform.anchorPoint.setValue([0,0]);
        curFileAsLayer.transform.position.setValue([0,0]);
        return curFileAsLayer;
    }


    function zl_F2AE_processKey (jsonPath, objectComp, objectKey){
        var keyName = objectKey.name;
        var keyChildren = objectKey.children; // an array
        
        if (keyChildren.length > 0) {
            if (objectKey.hasOwnProperty("image")) {
                // yes children, yes image
                var childImage = zl_F2AE_importImage(jsonPath, objectComp, objectKey);
                //childImage.transform.position.setValue([objectKey.layerFrame.x - thisJsonObject.layerFrame.x, thisChild.layerFrame.y - thisJsonObject.layerFrame.y]);
                //childImage.transform.position.setValue([objectKey.layerFrame.x, objectKey.layerFrame.y]);

                for (var i = keyChildren.length - 1; i >= 0; i--) {
                    zl_F2AE_processKey(jsonPath, objectComp, keyChildren[i]);
                }
            } else {
                // yes children, no image
                var compFolder = app.project.items.addFolder(objectKey.name);
                var childObjectComp = zl_F2AE_createComp(objectKey, compFolder);
                var elementsFolder = app.project.items.addFolder(childObjectComp.name + " Elements");
                elementsFolder.parentFolder = compFolder;
                
                var newCompAsLayer = objectComp.layers.add(childObjectComp);
                
      
                newCompAsLayer.transform.anchorPoint.setValue([0,0]);
                newCompAsLayer.transform.position.setValue([objectKey.layerFrame.x, objectKey.layerFrame.y]);

                for (var i = keyChildren.length - 1; i >= 0; i--) {
                    zl_F2AE_processKey(jsonPath, childObjectComp, keyChildren[i]);
                }
            }
        } else {
            if (objectKey.hasOwnProperty("image")) {
                // 0 or 1 children, has to have image?
                var childImage = zl_F2AE_importImage(jsonPath, objectComp, objectKey);
            } else {
                // no children, no image
                alert(keyName + ": what am I doing here?");
            }
        }

    }


    /****************************** 
        zl_F2AE_createPalette()
          
        Description:
        Creates ScriptUI Palette Panel
        Generated using Boethos (crgreen.com/boethos)
        
        Parameters:
        thisObj - this comp object
        
        Returns:
        Nothing
     ******************************/
    function zl_F2AE_createPalette(thisObj) { 
        var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'Framer to AE', undefined); 
        
        { // Buttons
            win.importJsonButton = win.add('button', undefined, 'Import Framer JSON'); 
            win.importJsonButton.alignment = "fill";
            
            win.importJsonButton.onClick = function () {
                app.beginUndoGroup("Framer 2 AE");

                var jsonFile = File.openDialog("Choose your json file", "*.json");
                var jsonObject = zl_F2AE_readJSON(jsonFile);
                var jsonPath = jsonFile.path + "/";

                if (jsonObject !== null){
                    var proj = (app.project) ? app.project: app.newProject();

                    //for (var i = 0; i < jsonObject.length; i++){
                        var compFolder = proj.items.addFolder(jsonObject[1].name);
                        var thisObjectComp = zl_F2AE_createComp(jsonObject[1], compFolder);
                        zl_F2AE_processKey(jsonPath, thisObjectComp, jsonObject[1]);
                        thisObjectComp.openInViewer();
                    //}

/*
                    for (var i = 0; i < jsonObject.length; i++){
                        var thisJsonObject = jsonObject[i];
                        var compFolder = app.project.items.addFolder(thisJsonObject.name);
                        var thisObjectComp = zl_F2AE_createComp(thisJsonObject, compFolder);
                        var elementsFolder = app.project.items.addFolder(thisObjectComp.name + " Elements");
                        elementsFolder.parentFolder = compFolder;
                        zl_F2AE_processChildren(thisJsonObject, thisObjectComp, elementsFolder, jsonFile.path + "/")
                        thisObjectComp.openInViewer();
                    }
*/
                }

                app.endUndoGroup();
            } // end onClick
        }
    
        if (win instanceof Window) {
            win.show();
        } else {
            win.layout.layout(true);
        }
    } // end function createPalette


    /****************************** 
        zl_F2AE_main()
          
        Description:
        Builds palette
         
        Parameters:
        None.

        Returns:
        Nothing.
    ******************************/
	function zl_F2AE_main(thisObj) {
        zl_F2AE_createPalette(thisObj);
	} // end zl_F2AE_main

    zl_F2AE_main(this);