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


    function zl_F2AE_setupObject(jsonObject, jsonFilePath) {
        for (var i = 0; i < jsonObject.length; i++) {
            var thisArtboardObject = jsonObject[i];
            var compFolder = app.project.items.addFolder(thisArtboardObject.name);

            var framerComp = zl_F2AE_createComp(thisArtboardObject, compFolder);
            //zl_F2AE_createLayers (framerComp, thisArtboardObject, jsonFilePath);
        };
    }


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

        framerComp.openInViewer();

		return framerComp;
	} // end zl_F2AE_createComp


    /****************************** 
        zl_F2AE_createLayers()
          
        Description:
        Creates + sets up layers
         
        Parameters:
        targetComp - target comp
        jsonObject - object of layers from json
        jsonPath - where the json lives (to get image files)

        Returns:
        Nothing.
    ******************************/
	function zl_F2AE_createLayers (targetComp, jsonObject, jsonPath){

		var objLayers = jsonObject.children;

		for (var i = 0; i < objLayers.length; i++){
			var curObjectLayer = objLayers[i];

            if (curObjectLayer.image == undefined) {
                if (curObjectLayer.children.length > 0){
                    // No image & children! Create precomp
                    zl_F2AE_setupObject(curObjectLayer.children, jsonPath);
                } else {
                    // No image & no children! what am I doing here
                    alert(curObjectLayer.name + " what am I doing here")
                }
//alert(curObjectLayer.name + " has no image");
            } else {

                var imgPath = curObjectLayer.image.path;
                var curFilePath = new File(jsonPath + imgPath);

                try {
                    var curFile = app.project.importFile(new ImportOptions(curFilePath));
                } catch (e) {
                    $.writeln(curObjectLayer.name + ": " + typeof curObjectLayer + " (" + jsonPath + imgPath + ")");
                    var curFile = app.project.importFile(new ImportOptions(new File(jsonPath + objLayers[i-1].image.path)));
                }

                curFile.parentFolder = targetComp.parentFolder;
                var curFileAsLayer = targetComp.layers.add(curFile);

                curFileAsLayer.name = curObjectLayer.name;
                curFileAsLayer.enabled = curObjectLayer.visible;
                curFileAsLayer.transform.position.setValue([curObjectLayer.layerFrame.x, curObjectLayer.layerFrame.y]);

                if (curObjectLayer.children.length > 0) {
                    // Image and children! Parent the kids
                } else {
                    // Image and no children! Make a layer
                }
            }
		}
	} // end zl_F2AE_createLayers


    /****************************** 
        zl_TrimCompToContents_createPalette()
          
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
                
                var projName = jsonFile.parent.name;

                if (jsonObject !== null){

                    var proj = (app.project) ? app.project: app.newProject();

                    for (var i = 0; i < jsonObject.length; i++) {
                        var thisArtboardObject = jsonObject[i];
                        var compFolder = app.project.items.addFolder(thisArtboardObject.name);

                        var framerComp = zl_F2AE_createComp(thisArtboardObject, compFolder);
                        zl_F2AE_createLayers (framerComp, thisArtboardObject, jsonFile.path + "/");
                    };
                }

                app.endUndoGroup();
            } 
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
        //zl_F2AE_createPalette(thisObj);
        
        
                        app.beginUndoGroup("Framer 2 AE");

                //var jsonFile = File.openDialog("Choose your json file", "*.json");
                var jsonFile = new File("W:/Scripts/bokeh-iPhone-SkFrAe/layers.json");
                var jsonObject = zl_F2AE_readJSON(jsonFile);
                
                
                
                
                var projName = jsonFile.parent.name;

                if (jsonObject !== null){

                    var proj = (app.project) ? app.project: app.newProject();

                    zl_F2AE_setupObject(jsonObject, jsonFile.path + "/");
                }

                app.endUndoGroup();
                
                
	} // end zl_F2AE_main

   // zl_F2AE_main(this);





    app.beginUndoGroup("Framer 2 AE");

    var jsonPath = "W:/Scripts/bokeh-iPhone-SkFrAe/"
    var jsonFile = new File(jsonPath + "layers.json");
    var jsonObject = zl_F2AE_readJSON(jsonFile);

    
    

    if (jsonObject !== null){
        var proj = (app.project) ? app.project: app.newProject();

        for (var i = 0; i < jsonObject.length; i++){
            var thisJsonObject = jsonObject[i];
            var compFolder = app.project.items.addFolder(thisJsonObject.name);
            var thisObjectComp = zl_F2AE_createComp(thisJsonObject, compFolder);
            processChildren(thisJsonObject, thisObjectComp, compFolder, jsonPath)
        }
    }

    app.endUndoGroup();





    function processChildren(thisJsonObject, thisObjectComp, compFolder, jsonPath){
        var numChildren = thisJsonObject.children.length;
        
        if (numChildren !== 0){
            for (var j = numChildren-1; j >= 0; j--){
                var thisChild = thisJsonObject.children[j];
                var newComp = zl_F2AE_createComp(thisChild, compFolder);
                var newCompAsLayer = thisObjectComp.layers.add(newComp);
                newCompAsLayer.transform.anchorPoint.setValue([0,0]);
                newCompAsLayer.transform.position.setValue([thisChild.layerFrame.x, thisChild.layerFrame.y]);
                processChildren(thisChild, newComp, compFolder, jsonPath);
            }
        }

        if (thisJsonObject.image !== undefined){
            var imgPath = thisJsonObject.image.path;
            var curFilePath = new File(jsonPath + imgPath);

            try {
                var curFile = app.project.importFile(new ImportOptions(curFilePath));
            } catch (e) {
                //$.writeln(thisJsonObject.name + ": " + typeof thisJsonObject + " (" + jsonPath + imgPath + ")");
                var curFile = app.project.importPlaceholder(thisJsonObject.name, thisJsonObject.layerFrame.width, thisJsonObject.layerFrame.height, 24, 30);
                //var curFile = app.project.importFile(new ImportOptions(new File(jsonPath + objLayers[i-1].image.path)));
            }

            curFile.parentFolder = thisObjectComp.parentFolder;
            var curFileAsLayer = thisObjectComp.layers.add(curFile);

            curFileAsLayer.name = thisJsonObject.name;
            curFileAsLayer.enabled = thisJsonObject.visible;
            
            curFileAsLayer.transform.anchorPoint.setValue([0,0]);
            curFileAsLayer.transform.position.setValue([0,0]);
            //curFileAsLayer.transform.position.setValue([thisJsonObject.layerFrame.x, thisJsonObject.layerFrame.y]);

            //curFileAsLayer.transform.position.setValue([thisJsonObject.layerFrame.x, thisJsonObject.layerFrame.y]);
        }
    
    } // end func


