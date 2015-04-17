/*global define, console*/

/*
 | Copyright 2015 ESRI (UK) Limited
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 ,
    './PicklistItem'
 */

define([
    'dojo/_base/declare',
    "dojo/_base/lang",
    'esri/dijit/Search',
    'dojo/text!./templates/Locator.html',
    './PickListItem'
],
function (
    declare, lang, Search, searchTemplate, PickListItem) {

    return declare([Search], {
        // description:
        //    Find the nearest features around a point

        //templateString: template,
        baseClass: 'search',
        widgetsInTemplate: true,
        accordionItems: [],
        pickListItems: null,
        aContainer: null,
        listItemIndexes:null,
        

        // Properties to be sent into constructor

        constructor: function (options, srcRefNode) {
            this.options = {

            };

            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            
            // language
            // this._i18n = i18n;

            // widget node
            this.domNode = srcRefNode;
            PickListItem.init();
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private

            this.setupConnections();

            this.inherited(arguments);
        },

        // start widget. called by user
        startup: function () {
            this._init();
        },

        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            // call the superclass method of the same name.
            this.inherited(arguments);
        },

        setupConnections: function () {
            // summary:
            //    wire events, and such            
        },


        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        
        search: function(value) {
            // call the superclass function of the same name.
            promise = this.inherited(arguments);
        },

        suggest: function (value) {
            var _this = this, resArr, keyedAddresses, keyedAddrArray=[], key, arr, ind2, address, splitAddress, postcode, key2, key3, descKey, i,
                   addressesMerge, suggestDiv, descriptions;
            // call the superclass function of the same name.
            this.inherited(arguments).then(function (a) {
                // results is an array of results from different sources
                resArr = a.results;

                //first iteration group by outcode + incode
                //Create Dictionary keyed by postcode
                //with list of addresses as values
                for (key in resArr) {
                    if (resArr.hasOwnProperty(key)) {
                        if (resArr[key].length > 0) {
                            keyedAddresses = {}
                            keyedAddresses["index_" + key] = PickListItem.createNewPickListItem(_this.sources[key].name);
                            keyedAddresses["index_" + key].Source = _this.sources[key].name;

                            if (!resArr[key][0].hasOwnProperty("feature")) {
                                arr = resArr[key];                                
                                for (ind2 = 0; ind2 < arr.length; ind2++) {
                                    address = arr[ind2].text;
                                    splitAddress = address.split(',');
                                    postcode = splitAddress[splitAddress.length - 1].trim();

                                    if (keyedAddresses.hasOwnProperty(postcode))
                                        keyedAddresses[postcode].Addresses.push(address);
                                    else
                                        keyedAddresses[postcode] = PickListItem.createNewPickListItem(address);
                                }
                                keyedAddresses["index_" + key].Type = "locator";
                            }
                            else {
                                arr = resArr[key];
                                for (ind2 = 0; ind2 < arr.length; ind2++) {
                                    keyedAddresses[arr[ind2].name] = PickListItem.createNewPickListItem(arr[ind2].name);
                                }
                                keyedAddresses["index_" + key].Type = "feature";
                            }
                            keyedAddrArray.push(keyedAddresses);
                        }                        
                    }
                }

                for (ind2 = 0; ind2 < keyedAddrArray.length; ind2++) {
                    keyedAddresses = keyedAddrArray[ind2];

                    //For each dictionary item
                    //need to work out common address elements - to create overall description
                    for (key2 in keyedAddresses) {
                        keyedAddresses[key2] = PickListItem.createPickListDescription(keyedAddresses[key2]);
                    }

                    if (keyedAddresses["index_" + ind2].Type == "locators") {

                        //deduplicate and merge based on overall descriptions
                        //Create reverse dictionary of description with postcodes
                        descriptions = {};
                        for (key3 in keyedAddresses) {
                            if (descriptions.hasOwnProperty(keyedAddresses[key3].PickListDescription))
                                descriptions[keyedAddresses[key3].PickListDescription].push(key3);
                            else
                                descriptions[keyedAddresses[key3].PickListDescription] = [key3];
                        }

                        //using reverse dictionary manipulate postcode dict
                        for (descKey in descriptions) {
                            if (descriptions[descKey].length > 1) {
                                //need to merge and delete key
                                for (i = 1; i < descriptions[descKey].length; i++) {
                                    addressesMerge = keyedAddresses[descriptions[descKey][0]].Addresses;
                                    addressesMerge.concat(keyedAddresses[descriptions[descKey][i]].Addresses);
                                    keyedAddresses[descriptions[descKey][0]].Addresses = addressesMerge;
                                    delete keyedAddresses[descriptions[descKey][i]];
                                }
                            }
                        }
                    }
                }

                suggestDiv = document.getElementsByClassName('searchMenu suggestionsMenu');
                suggestDiv[0].innerHTML = "<div id='addrAccordCont'></div>";
                _this.pickListItems = keyedAddrArray;
                _this._createAccordian();
            })
        },

        _createAccordian: function () {
            var _this = this, opened = true, pickKey, listDiv, list, addresses, addrList, listItem, ind, itemInd,
                        pickListItems, addrAccordCont, titleBar, accordionDiv, itemIndex = 0, listItemClicked;

            require(["dijit/layout/AccordionContainer", "dijit/layout/ContentPane", "dijit/TitlePane", "dojox/widget/TitleGroup"],
            function (AccordionContainer, ContentPane, TitlePane, TitleGroup) {

                listItemClicked= function () {
                    var searchObj, splitValue;
                    splitValue = _this.listItemIndexes[this.value].split(',');
                    searchObj = _this.pickListItems[splitValue[0]][splitValue[1]];
                    _this.search(searchObj);
                };
                                
                if (_this.aContainer != null) {
                    _this.aContainer.destroyRecursive();
                }

                _this.listItemIndexes = {};
                addrAccordCont = suggestDiv = document.getElementById("addrAccordCont");
                for (itemInd = 0; itemInd < _this.pickListItems.length; itemInd++) {

                    pickListItems = _this.pickListItems[itemInd];
                    
                    titleBar = dojo.create("div", { title: pickListItems["index_" + itemInd].Source, class: 'menuHeader', innerHTML: pickListItems["index_" + itemInd].Source });
                    addrAccordCont.appendChild(titleBar);

                    if (pickListItems["index_" + itemInd].Type == "locator") {
                        accordionDiv = dojo.create("div", { id: "addressAccordion_" + itemInd });
                        addrAccordCont.appendChild(accordionDiv);

                        _this.aContainer = new TitleGroup(null, "addressAccordion_" + itemInd);

                        for (pickKey in pickListItems) {
                            if (pickKey.indexOf("index_") < 0) {
                                addresses = pickListItems[pickKey].Addresses;

                                list = dojo.create("ul");
                                for (ind = 0; ind < addresses.length; ind++) {
                                    _this.listItemIndexes[itemIndex] = itemInd + "," + pickKey;
                                    listItem = dojo.create("li", { innerHTML: addresses[ind], value: itemIndex });
                                    listItem.onclick = listItemClicked;
                                    list.appendChild(listItem);
                                    itemIndex++;
                                }

                                _this.aContainer.addChild(new TitlePane({
                                    title: pickListItems[pickKey].PickListDescription,
                                    content: list,
                                    open: opened
                                }));
                                opened = false;
                            }
                        }
                        _this.aContainer.startup();
                    }
                    else {
                        listDiv = dojo.create("div");
                        list = dojo.create("ul");
                        for (pickKey in pickListItems) {
                            if (pickKey.indexOf("index_") < 0) {
                                val = itemInd + "," + pickKey;
                                _this.listItemIndexes[itemIndex] = itemInd + "," + pickKey;
                                listItem = dojo.create("li", { innerHTML: pickListItems[pickKey].PickListDescription, value: itemIndex });
                                listItem.onclick = listItemClicked;
                                list.appendChild(listItem);
                                itemIndex++;
                            }
                        }
                        listDiv.appendChild(list);
                        addrAccordCont.appendChild(listDiv);
                    }
                }
            });
        },       
       
        _toggleItem: function (h2) {
            var _this = this, itemClass, i;

            itemClass = h2.parentNode.className;

            // Hide all items
            for ( i = 0; i < _this.accordionItems.length; i++ ) {
                _this.accordionItems[i].className = 'accordionItem collapsed';
            }

            // Show this item if it was previously hidden
            if ( itemClass == 'accordionItem collapsed' ) {
                h2.parentNode.className = 'accordionItem';
            }
        },

        _getFirstChildWithTagName: function( element, tagName ) {
            var i;
            for ( i = 0; i < element.childNodes.length; i++ ) {
                if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
            }
        },

        /* ---------------- */
        /* Private Functions */
        /* ---------------- */


        _init: function () {
            var _this = this;

        }

    });
});