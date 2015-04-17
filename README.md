arcgis-dijit-locator 
====================

## Features
The Locator widget extends the Esri arcgis-dijit-search to allow pick lists to be displayed when multiple results are returned from a Geocoding Service.

[View it live](http://appsdev.esriuk.com/app/LocateWidget/5/wmt/view/4b157e9983f44d83b2cdc76830626d3a/index.html)

## Quickstart

This widget is created in the exact same way as the Esri Search widget.
A more detailed decription of the Search widget is available [here.](https://developers.arcgis.com/javascript/jssamples/search_multiplesources.html)

```javascript	
var locatorWidget = new Locator({
    enableButtonMode: false, //this enables the search widget to display as a single button
    enableLabel: false,
    enableInfoWindow: true,
    showInfoWindowOnSelect: false,
    map: map
}, "locatorWidget");

locatorWidget.startup();
```

 [New to Github? Get started here.](https://github.com/)


## Setup
Set your dojo config to load the module.

```javascript
var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
var dojoConfig = {
	// The locationPath logic below may look confusing but all its doing is
	// enabling us to load the api from a CDN and load local modules from the correct location.
	packages: [{
		name: "application",
		location: package_path + '/js'
	}]
};
```

## Require module
Include the module for the Locator.

	require(["application/Locator", ... ], function(Locator, ... ){ ... });

## Constructor

Locator(options, srcNode);

### Options (Object)

A full list of all available functions and properties is available on the Esri website [here.](https://developers.arcgis.com/javascript/jsapi/search-amd.html)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Anyone and everyone is welcome to contribute.


## Licensing

Copyright 2015 ESRI (UK) Limited

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the Licence.

A copy of the license is available in the repository's [license.txt](license.txt) file.