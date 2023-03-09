export {};

// The simplest way to describe a function with a function type expression which looks like an arrow function
// The syntax (a: string) => void means "a function with one parameter, named a, of type string, that doesn't have a return value"
function greeter(fn: (a: string) => void) {
    fn("Hello world!");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter(printToConsole);

// We can use a type alias to name a function type
type GreetFunction = (a: string) => void;

function greeter1(fn: GreetFunction) {
    // ...
}

/*
    Call Signatures

    In JavaScript, functions are considered as objects, which means they can (if you wanted to) also play the role of 
    key-value storage.

    function greet(s: string) {
        console.log(s);
    }

    greet.idk = 'This is my idk property';

    If we WANTED to describe something callable with properties (you don't have to specify the properties unless you need
    to use them for something), we can write a call signature in an object type.

    Node that the syntax is slightly different compared to a function type expression - use : between 
    the parameter list and the return type rather than =>
*/

interface DescribableFunction {
    description: string;
    (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
    console.log(`${fn.description} returned ${fn(6)}`);
}

function theDescribableFunc(n: number) {
    return true;
}

theDescribableFunc.description = 'The Describable Function';

doSomething(theDescribableFunc);


/*
    Construct Signatures

    JavaScript functions can also be invoked with the 'new' operator. TypeScript refers to these 
    as constructors because they usually create a new object. You can write a construct signature by adding 
    the 'new' keyword in front of a call signature. 
*/

type SomeConstructor {
    new (s: string): SomeObject;
}

function
