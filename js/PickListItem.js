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
 */

define([],
function () {

    var pickListItem = {

        houseNumberRegex: null,

        init: function () {
            houseNumberRegex = "^([0-9]+[a-zA-Z]*-[0-9]+[a-zA-Z]*|[0-9]+[a-zA-Z]*)(.+)$";
        },

        createNewPickListItem: function (address) {
            var item = null, adjustedAddress, regexMatch;
            item = {
                "Type": "",
                "Source":"",
                "PickListDescription": "",
                "Addresses": [],
                "SplitAddresses": []
            }
            item.Addresses.push(address);
            //need to deal with numeric house numbers that aren't split from main address string

            adjustedAddress = address;
            regexMatch = address.match(houseNumberRegex);
            if (regexMatch != null) {
                adjustedAddress = regexMatch[1] + "," + regexMatch[regexMatch.length - 1];
            }

            item.SplitAddresses.push(adjustedAddress.split(','));
            return item;
        },

        createPickListDescription: function (item) {
            var shortestLength = 100, ind, match, counter, matchItem = null, splitaddress;

            //first work out the shortest length address so we don't get an index out of bounds            
            for(ind=0;ind<item.SplitAddresses.length;ind++)
            {
                if (item.SplitAddresses[ind].length < shortestLength)
                    shortestLength = item.SplitAddresses[ind].length;
            }

            match = true;
            counter = 2;
            while (match == true & counter < shortestLength) {
                //loop through addresses
                for(var ind2=0;ind2<item.SplitAddresses.length;ind2++)
                {
                    splitaddress = item.SplitAddresses[ind2];
                    if (matchItem == null)
                        matchItem = splitaddress[splitaddress.length - counter];
                    else if (splitaddress[splitaddress.length - counter] != matchItem) {
                        match = false;
                        break;
                    }
                }
                if (match == true) {
                    //this is a matching element - add to description
                    item.PickListDescription = item.SplitAddresses[0][item.SplitAddresses[0].length - counter] + "," + item.PickListDescription;
                }
                counter++;
            }

            //trim description
            item.PickListDescription = item.PickListDescription.substring(0, item.PickListDescription.length - 1).trim();
            if (item.PickListDescription.length == 0)
                if (item.Type == "locator")
                    item.PickListDescription = item.SplitAddresses[0][0].trim();
                else
                    item.PickListDescription = item.Addresses[0].trim();
            return item;
        }
    }
    return pickListItem;
});