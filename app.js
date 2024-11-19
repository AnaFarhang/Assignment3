angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', function(MenuSearchService) {
    var vm = this;

    vm.found = [];
    vm.searchTerm = '';

    vm.narrowItDown = function() {
        console.log("Search term:", vm.searchTerm);
        if (!vm.searchTerm) {
            vm.found = [];
            console.log("No search term provided.");
            return;
        }

        MenuSearchService.getMatchedMenuItems(vm.searchTerm)
            .then(function(items) {
                vm.found = items;
                console.log("Found items:", items);
            });
    };

    // Function to remove an item from the found list
    vm.removeItem = function(index) {
        vm.found.splice(index, 1); // Removes item at the specified index
        console.log("Item removed at index:", index);
    };
})
.service('MenuSearchService', function($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
        return $http({
            method: "GET",
            url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function(response) {
            var foundItems = [];
            var menuItems = response.data;

            // Loop through each category
            for (var key in menuItems) {
                if (menuItems.hasOwnProperty(key)) {
                    var category = menuItems[key];
                    // Loop through menu items in each category
                    for (var i = 0; i < category.menu_items.length; i++) {
                        var menuItem = category.menu_items[i];
                        // Check if the description includes the search term
                        if (menuItem.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                            foundItems.push(menuItem);
                        }
                    }
                }
            }
            return foundItems;
        });
    };
})

.directive('foundItems', function() {
    return {
        restrict: 'E',
        scope: {
            found: '<',
            onRemove: '&'
        },
        template: `
            <ul>
                <li ng-repeat="item in found">
                    {{item.name}}, {{item.short_name}}, {{item.description}}
                    <button ng-click="onRemove({index: $index})">Don't want this one!</button>
                </li>
            </ul>
        `
    };
});
