//https://stackoverflow.com/questions/6129952/javascript-sort-array-by-two-fields
Array.prototype.sortBy = function (propertyName, sortDirection) {

    var sortArguments = arguments;
    this.sort(function (objA, objB) {

        var result = 0;
        for (var argIndex = 0; argIndex < sortArguments.length && result === 0; argIndex += 2) {

            var propertyName = sortArguments[argIndex];
            result = (objA[propertyName] < objB[propertyName]) ? -1 : (objA[propertyName] > objB[propertyName]) ? 1 : 0;

            //Reverse if sort order is false (DESC)
            result *= !sortArguments[argIndex + 1] ? 1 : -1;
        }
        return result;
    });

}