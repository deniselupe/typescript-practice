"use strict";
exports.__esModule = true;
function printCoordWithoutAlias(pt) {
    console.log("The coordinate's x value is ".concat(pt.x));
    console.log("The coordinate's y value is ".concat(pt.y));
}
printCoordWithoutAlias({ x: 3, y: 7 });
function printCoordWithAlias(pt) {
    console.log("The coordinate's x value is ".concat(pt.x));
    console.log("The coordinate's y value is ".concat(pt.y));
}
printCoordWithAlias({ x: 100, y: 100 });
function printCoordWithInterface(pt) {
    console.log("The coordinate's x value is ".concat(pt.x));
    console.log("The coordinate's y value is ".concat(pt.y));
}
printCoordWithInterface({ x: 100, y: 100 });
;
;
;
;
/* Scenario
    In most cases you can choose between Type Alias or Interface.... but for object type...

    Example:
    type UserInputSanitizedString = string;

    You can create an alias for the string type.

    function sanitizeInput(str: string): UserInputSanitizedString {
        return sanitize(str);
    }

    HOWEVER, you cannot use interface to do the same thing:
    interface UserInputSanitizedString = string;

    If you try to use interface, you'll get an error that says:
    " 'string' only refers to a type, but is being used as a value here. "
*/
