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

interface PersonObject {
    name: string;
};

interface PersonConstructor {
    new (name: string): PersonObject;
};

function createPerson(constructor: PersonConstructor) {
    return new constructor("Denise");
}

class PersonClass implements PersonObject {
    constructor(public name: string) {
        this.name = name;
    }
}

const Person: PersonConstructor = PersonClass;

createPerson(Person);

/*
    Generic Functions

    It's common to write a function where the types of the input relate to the 
    type of the output, or where the types of the two inputs are related in 
    some way. Let's consider for a moment a function that returns the first element
    of an array.

    This function does its job, but unfortunately has the return type any. It'd be 
    better if the function returned the type of the array element. 

    In TypeScript, generics are used when we want to describe a correspondence between 
    two values. We do this by declaring a type parameter in the function signature of
    a similar function, firstElementTyped(). By adding a type parameter Type to this function
    and using it in two places, we've created a link between the input of the function (the array) 
    and the output (the return value). Now when we call it, a more specific type comes out.
*/

function firstElement(arr: any[]) {
    return arr[0];
}

function firstElementTyped<Type>(arr: Type[]) {
    return arr[0];
}

const s = firstElementTyped(["a", "b", "c"]);
const n = firstElementTyped([1, 2, 3]);
const u = firstElementTyped([]);

/*
    Inference

    Note that we didn't ahve to specify Type in this sample. The type was inferred - 
    chosen automatically - by TypeScript. 

    We can use multiple type parameters as well. For example, a standalone 
    version of map would look like below.

    Note that in this example below, TypeScript could infer both the type of the Input 
    type parameter (from the given string array), as well as the Output type 
    parameter based on the return value of the function expression (number).
*/

function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

// Parameter 'n' is os type 'string'
// 'parsed' is of type number[]
const parsed = map(["1", "2", "3"], (n) => parseInt(n));

/*
    Constraints

    We've written some generic functions that can work on any kind of value. 
    Sometimes we want to relate two values, but can only operate on a certain subset of
    values. In this case, we can use a constraint to limit the kinds of types that a
    type parameter can accept. 

    Let's write a function that return the longer of two values. To do this, we need a 
    length property that's a number. We constrain the type parameter to that type by 
    writing an extends clause.
*/

function longest<Type extends { length: number }>(a: Type, b: Type): Type {
    if (a.length >= b.length) {
        return a;
    } else {
        return b;
    }
}

// longerArray is of type number[]
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOk = longest(10, 100);

/*
    Constraints Cont'd

    There are a few intersting things to note in this example.
    We allowed TypeScript to infer the return type of longest. Return 
    type inference also works on generic functions. 

    Because we constrained Type to { length: number }, we were allowed to
    access the .length property of the a and b parameters. Without the 
    type constraint, we wouldn't be able to access those properties because 
    the values might have been some other type without a length property.

    The types of longerArray and longerString were inferred based on the 
    arguments. Remember, generics are all about relating two or more values 
    with the same type!

    Finally, just as we'd like, the call to longest(0, 100) is rejected 
    because the number type doesn't have a .length property. 
*/

/*
    Working with Constrained Values

    Here's a common error when working with Generic Constraints:
*/

function minimumLength<Type extends { length: number }>(obj: Type, minimum: number): Type {
    if (obj.length >= minimum) {
        return obj;
    } else {
        return { length: minimum };
    }
}

/*
    Working with Constrained Values Cont'd

    It might look like this function is OK - Type is constrained to 
    { length: number }, and the function either returns Type or a value
    matching that constraint. 

    The problem is that the function promises to return the same kind of object
    as was passed in, not just some object matching the constraint. 

    If this code were legal, you could write code that deifinitely wouldn't work:
*/

// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have a 'slice' method, but not the returned object!
console.log(arr.slice(0));

/*
    Specifying Type Arguments

    TypeScript can usually infer the intended type arguments in a generic call, 
    but not always. For example, let's say you wrote a function to combine 
    two arrays.

    Normally it would be an error to call this function with mismatched arrays:
*/

function combine<Type>(arr1: Type[], arr2: Type[]): Type {
    return arr1.concat(arr2);
}

const arrOne = combine([1, 2, 3], ["hello"]);

/*
    Specifying Type Arguments Cont'd

    If you intended to do this, however, you could manually specify Type:
*/

const arrTwo = combine<string | number>([1, 2, 3], ["hello"]);

/*
    Guidelines for Writing Good Generic Functions

    Writing Generic functions is fun, and it can be easy to get carried away
    with type parameters. Having too many type parameters or using constraints where
    they aren't needed can make inference less successful, frustrating callers of your function.

    Push Type Parameters Down

    Here are two ways of writing a function that appear similar:
*/

function firstElement1<Type>(arr: Type[]) {
    return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
    return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);

/*
    Guidelines for Writing Good Generic Functions Cont'd

    Push Type Parameters Down Cont'd

    These might seem identical at first glance, but firstElement1 
    is a much better way to write this function. Its inferred return
    type is Type, but firstElement2's inferred return type is any because TypeScript
    has to resolve the arr[0] expression during the constraint type, rather than 
    "waiting" to resolve the element during a call.

    Rule: When possible, use the type parameter itself rather than constraining it



    Use Fewer Type Parameters
    Here's another pair of similar functions:
*/

function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
    return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(arr: Type[], func: Func): Type[] {
    return arr.filter(func);
}

/*
    Guidelines for Writing Good Generic Functions Cont'd
    Use Fewer Type Parameters Cont'd

    We've created a type parameter Func that doesn't relate two values. That's always a 
    red flag, because it means callers wanting to specify type arguments have to manually
    specify an extra type argument for no reason. Func doesn't do anything but 
    make the function harder to read and reason about!

    Rule: Always use as few type parameters as possible.


    Type Parameters Should Appear Twice
    Sometimes we forget that a function might not need to be generic:
*/

function greetOne<Str extends string>(s: Str) {
    console.log("Hello, " + s);
}

/*
    Guidelines for Writing Good Generic Functions Cont'd
    Type Parameters Should Appear Twice Cont'd

    We could have just as easily have written a simpler version
    like below. 

    Remember, type parameters are for relating the types of multiple values. 
    If a type parameter is only used once in the function signature, it's not
    relating anything.

    Rule: If a typed parameter only appears in one location, strongly reconsider
    if you actually need it.
*/

function greetTwo(s: string) {
    console.log("Hello, " + s);
}

/*
    Optional Parameters

    Functions in JavaScript often take a variable number of arguments. 

    For example, the toFixed method of number takes an optional digit count:
*/

function fOne(n: number) {
    console.log(n.toFixed()); // 0 arguments
    console.log(n.toFixed(3)); // 1 argument
}

/*
    Optional Parameters Cont'd

    We can model this in TypeScript by marking the parameter as optional 
    with ?:
*/

function fTwo(x?: number) {
    // ...
}

fTwo(); // OK
fTwo(10); // OK

/*
    Optional Parameters Cont'd

    Although the parameter is specified as type number, 
    the x parameter will actually have the type number | undefined
    because unspecified parameters in JavaScript get the value undefined.

    You can also provide a parameter default:
*/

function fThree(x = 10) {
    // ...
}

/*
    Optional Parameters Cont'd

    Now in the body of fThree, x will have type number because any 
    undefined argument will be replaced with 10. Note that when a 
    parameter is optional, callers can always pass undefined, as this simply 
    simulates a "missing" argument:
*/

declare function fFour(x?: number): void;
// cut
// All OK
fFour();
fFour(10);
fFour(undefined);


/*
    Optional Parameters in Callbacks 

    This will have its own file as it's kinda a tricky 
    lesson to understand. Refer to optionalParamsInCallbacks.ts
*/