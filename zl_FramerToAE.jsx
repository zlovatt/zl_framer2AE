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
                    processChildren(thisChild, newComp, compFolder, jsonPath);
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

                if (jsonObject !== null){
                    var proj = (app.project) ? app.project: app.newProject();

                    for (var i = 0; i < jsonObject.length; i++){
                        var thisJsonObject = jsonObject[i];
                        var compFolder = app.project.items.addFolder(thisJsonObject.name);
                        var thisObjectComp = zl_F2AE_createComp(thisJsonObject, compFolder);
                        var elementsFolder = app.project.items.addFolder(thisObjectComp.name + " Elements");
                        elementsFolder.parentFolder = compFolder;
                        processChildren(thisJsonObject, thisObjectComp, elementsFolder, jsonFile.path + "/")
                        thisObjectComp.openInViewer();
                    }
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