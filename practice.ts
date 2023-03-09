export {};

// type Alias
type Point = {
    x: number;
    y: number;
};

function printCoordWithoutAlias(pt: {x: number, y: number}) {
    console.log(`The coordinate's x value is ${pt.x}`);
    console.log(`The coordinate's y value is ${pt.y}`);
}

printCoordWithoutAlias({x: 3, y: 7});

function printCoordWithAlias(pt: Point) {
    console.log(`The coordinate's x value is ${pt.x}`);
    console.log(`The coordinate's y value is ${pt.y}`);
}

printCoordWithAlias({x: 100, y: 100});

// You can use a type alias to give a name to any type at all, not just an object type
// A type alias can name a union type
type ID = number | string

// Note that aliases are only aliases -- you cannot use type aliases to create different/distinct "versions" of the same type
// When you use the alias, it's exactly as if you had written the aliased type. In other words, this code might look illegal but is OK according to TypeScript
// This is because both types are aliases for the same type

// An Interface is another way to name an object type
interface Pointt {
    x: number;
    y: number;
}

function printCoordWithInterface(pt: Pointt) {
    console.log(`The coordinate's x value is ${pt.x}`);
    console.log(`The coordinate's y value is ${pt.y}`);
}

printCoordWithInterface({x: 100, y:100});


// Differences between Type Aliases and Interfaces
// They're very similar, and in most cases you can choose between them freely
// Almost all features of an interface are available in a type
// The key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable

// Extending an Interface
interface Animal {
    name: string;
};

interface Bear extends Animal {
    honey: boolean;
};

// Extending a Type Alias via insertions
type Animall = {
    name: string;
};

type Bearr = Animall & {
    honey: boolean;
};

// Adding new fields to an existing Interface
interface Window {
    title: string;
};

interface Window {
    ts: number;
};

// A type cannot be changed after being created
// You'd get an error that say: Duplicate identifier 'Window'
type Windoww = {
    title: string;
};


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

// This function takes in a url parameter which needs to be of type string
// And takes a method parameter that needs to be of literal values "GET" or "POST"
function handleRequest(url: string, method: "GET" | "POST") {
    console.log('Making request!');
}

const req = {url: "https://example.com", method: "GET"};

// req.method is incorrect because TypeScript assumes that req.method is type string, and not literal string "GET"
handleRequest(req.url, req.method);

// You would need to pass it in like this instead
handleRequest(req.url, "GET");

const url = "https://example.com";
const method = "GET"

handleRequest(url, method);


// null & undefined

/* strictNullChecks on

    With strictNullChecks on, when a value is null or undefined, you will need to test for those values
    before using methods or properties on that value. Just like checking for undefined before using an optional 
    property, we can use narrowing to check for alues that might be null:
*/

function doSomething(x: string | null) {
    if (x === null) {
        // do nothing
    }  else {
        console.log(`Hello, ${x.toUpperCase()}`);
    }
}

/* Non-null Assertion Operator (Postfix !)

    TypeScript also has a special syntax for removing null and undefined from a type without
    doing any explicit checking. Writing ! after any expression is effectively a type assertion 
    that the value isn't null or undefined.

    TLDR: Using ! after an expression tells TypeScript "Hey this isn't null or undefined, run it",
    which can potentially result in your code crashing at runtime if you're not using this operator 
    wisely.

    It's import to only use ! when you know that the value can't be null or undefined.
*/

function liveDangerously(x?: number | null) {
    // no error
    console.log(x!.toFixed());
}