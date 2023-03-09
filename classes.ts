// TypeScript offers full support for the class keywords introduced in ES2015.

/* 
    Fields 
    
    A field declaration creates a pubic writeable property on a class. 
    Now you can set the value for x and y, but it will have to be of type number.

    You could declare the x and y values without doing type annotation, but 
    it will be implicitly set to type any which we don't want.
*/
class Point {
    x: number;
    y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 'hello';

/*
    Fields

    If we initialize what the default value of the x and y properties
    TypeScript will infer what values x and y can be updated to, and will
    only allow them to updated to number values.
*/

class Point1 {
    x = 0;
    y = 0;
}

const pt1 = new Point1();
pt1.x = 1;
pt1.y = '1';


/*
    readonly modifier

    Fields may be prefixed with the readonly modifier. This prevents 
    assignments to the field outside of the constructor.
*/

class Greeter {
    readonly name: string = "world";

    constructor(otherName?: string) {
        if (otherName !== undefined) {
            this.name = otherName;
        }
    }

    err() {
        this.name = "not ok";
    }
}

const g = new Greeter();
g.name = "also not ok";

/*
    Constructors

    Class constructors are very similar to functions. You can add parameters with type 
    annotations, default values, and overloads.
*/

class Point {
    
}