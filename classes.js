// TypeScript offers full support for the class keywords introduced in ES2015.
/*
    Fields
    
    A field declaration creates a pubic writeable property on a class.
    Now you can set the value for x and y, but it will have to be of type number.

    You could declare the x and y values without doing type annotation, but
    it will be implicitly set to type any which we don't want.
*/
var Point = /** @class */ (function () {
    function Point() {
    }
    return Point;
}());
var pt = new Point();
pt.x = 0;
pt.y = 'hello';
/*
    Fields

    If we initialize what the default value of the x and y properties
    TypeScript will infer what values x and y can be updated to, and will
    only allow them to updated to number values.
*/
var Point1 = /** @class */ (function () {
    function Point1() {
        this.x = 0;
        this.y = 0;
    }
    return Point1;
}());
var pt1 = new Point1();
pt1.x = 1;
pt1.y = '1';
/*
    readonly modifier

    Fields may be prefixed with the readonly modifier. This prevents
    assignments to the field outside of the constructor.
*/
var Greeter = /** @class */ (function () {
    function Greeter(otherName) {
        this.name = "world";
        if (otherName !== undefined) {
            this.name = otherName;
        }
    }
    Greeter.prototype.err = function () {
        this.name = "not ok";
    };
    return Greeter;
}());
var g = new Greeter();
g.name = "also not ok";
