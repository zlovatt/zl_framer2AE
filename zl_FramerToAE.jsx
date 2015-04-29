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
        projName - project name
        compObject - comp object from json

        Returns:
        framerComp - generated comp
    ******************************/
	function zl_F2AE_createComp (projName, compObject){

		var proj = (app.project) ? app.project: app.newProject();

		var compFolder = app.project.items.addFolder(projName);
		var compPixelAspectRatio = 1.0;
		var compDuration = 30;
		var compFrameRate = 24;
		var framerComp = compFolder.items.addComp(projName, compObject.layerFrame.width, compObject.layerFrame.height, compPixelAspectRatio, compDuration, compFrameRate);

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

		var objLayers = jsonObject[0].children;

		for (var i = 0; i < objLayers.length; i++){
			var curObjectLayer = objLayers[i];
		    var curFilePath = new File(jsonPath + curObjectLayer.image.path);
		    var curFile = app.project.importFile(new ImportOptions(curFilePath));
            curFile.parentFolder = targetComp.parentFolder;
		    var curFileAsLayer = targetComp.layers.add(curFile);

		    curFileAsLayer.name = curObjectLayer.name;
            curFileAsLayer.enabled = curObjectLayer.visible;
		    curFileAsLayer.transform.position.setValue([curObjectLayer.layerFrame.x, curObjectLayer.layerFrame.y]);
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
                    var framerComp = zl_F2AE_createComp(projName, jsonObject[0]);
                    zl_F2AE_createLayers (framerComp, jsonObject, jsonFile.path + "/");
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
        zl_F2AE_createPalette(thisObj);
	} // end zl_F2AE_main

    zl_F2AE_main(this);