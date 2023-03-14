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
    Function Overloads

    Some JavScript functions can be called in a variety of argument coutns and types.

    For example, you might write a function to produce a Date that takes either a timestamp
    (one argument) or a month/day/year specification (three arguments).

    In TypeScript, we can specify a function that can be called in different ways by writing 
    overload signatures. To do this, write some number of function signatures (usually two or more),
    followed by the body of the function.

    In the example below, we wrote two overloads: one accepting one argument, and another accepting
    three arguments. These first two signatures are called the overload signatures.

    Then, we wrote a function implementation with a compatible signature. Functions have an 
    implementation signature, but this signature can't be called directly. Even though we 
    wrote a function with two optional parameters after the required ones, it can't 
    be called with two parameters!
*/

function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);  
    }
}

// You can invoke makeDate() with 1 argument or 3 arguments, but not 2 arguments
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);


/*
    Overload Signatures and the Implementation Signature

    This is a common source of confusion. Often people will write code like this
    and not understand why there is an error.
*/

function fn(x: string): void;
function fn() {
    // ...
}

// Expected to be able to call with zero arguments
fn();

/*
    Overload Signatures and the Implementation Signature Cont'd

    Again, the signature used to write the function body can't be 
    "seen" from the outside.

    The signature of the implementation is not visible from the outside. When 
    writing an overloaded function, you should always have two or more
    signatures above the implementation of the function.

    The implementation signature must also be compatible with the overload signatures.
    For example, these functions have errors because the implementation signature doesn't
    match the overloads in a correct way:
*/

function fnTwo(x: boolean): void;
// Argument type isn't right
// This overload signature is not compatible with its implementation signature.
function fnTwo(x: string): void;
function fnTwo(x: boolean) {}

function fnThree(x: string): string;
// Return type isn't right
// This overload signature is not compatible with its implementation signature
function fnThree(x: number): boolean;
function fnThree(x: string | number) {
    return "oops";
}

/*
    Writing Good Overloads

    Like generics, there are a few guidelines you should follow when using 
    function overloads. Following these principles will make your function
    easier to call, easier to understand, and easier to implement.

    Let's consider a function that returns the length of a string or an array.

    This function is fine; we can invoke it with strings or arrays. However, 
    we can't invoke it with a value that might be a string or an array, 
    because TypeScript can only resolve a function call to a single overload.
*/

function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
    return x.length;
}

len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);

/*
    Writing Good Overloads Cont'd

    Because both overloads have the same argument count and same return type, 
    we can instead write a non-overloaded version of the function. 

    This is much better! Callers can invoke this with either sort of value, and 
    as an added bonus, we don't have to figure out a correct implementation 
    signature.

    Always prefer parameters with union types instead of overloads when possible.
*/

function lenTwo(x: any[] | string) {
    return x.length;
}

lenTwo(Math.random() > 0.5 ? "hello" : [0]);

/*
    Object Methods in TypeScript

    Both of the interfaces below define the samething. 

    In the PersonOne interface, the greet property is explicitly defined as a function 
    that takes no parameters and returns void. This syntax uses an arrow function to define 
    the function type.

    In the PersonTwo interface, the greet property is defined as a method using the regular 
    method syntax with parentheses after the method name to indicate that it takes no parameters. 
    The return type is still defined as void.

    Both syntaxes are valid ways to define object methods in TypeScript interfaces. The choice 
    between them is mostly a matter of personal preference or team style guide.
*/

interface PersonOne {
    name: string;
    age: number;
    greet: () => void;
};

interface PersonTwo {
    name: string;
    age: number;
    greet(): void;
};

/*
    Declaring this in a Function

    TypeScript will infer what the 'this' should be in a function via code 
    flow analysis, for example in the following:
*/

const user = {
    id: 123,
    admin: false,
    becomeAdmin: function() {
        this.admin = true;
    },
};

/*
    Declaring this in a Function Cont'd

    Using the 'this' keyword in JavaScript often trips developers up, whether
    they are a beginner or more experienced.

    If you're new to TypeScript, you'll likely encounter a scenario where you need
    to type the 'this' keyowrd to bulletproof a section of code.

    With thigns like the 'class' keyword, we don't need to worry too much. TypeScript 
    will infer the type. But what if we don't know the type?

    We need to be explicit in places where TypeScript is unaware of its surroundings.

    Let's take this simple example:
*/

const element = document.querySelector('button');

function handleClick() {
    console.log(this.innerText);
}

element.addEventListener('click', handleClick);

/*
    Declaring this in a Function Cont'd

    This is a fairly innocent looking example, and by default
    we may see no compiler errors depending on your tsconfig.json.

    Let's ensure we have "noImplicitThis" added to our tsconfig.json:

    {
        "compilerOptions": {
            "target": "esnext",
            "noImplicitThis": true
        }
    }

    At this point, you will definitely see an error:

    function handleClick() {
        // X 'this' implicitly has a type 'any' because it does not have a type annotation
        console.log(this.innerText);
    }

    Great! TypeScript is telling us of a weakspot in our code, let's fix it up.

    To add the 'this' type definition to our function, first we must be using a 
    function declaration syntax, and secondly the way we type 'this' is through the 
    function arguments (however it is not to be confused as a parameter):
*/

function typedHandleClick(this: HTMLButtonElement) {
    // this = HTMLButtonElement
    console.log(this.innerText);
}

/*
    Declaring this in a Function Cont'd

    And that's it! You can of course specify more function parameters, 
    for things like the 'event':
*/

function typedHandleClickTwo(this: HTMLButtonElement, event: Event) {
    console.log(this.innerText); // Click me!
    console.log(event.target.innerText) // Click me!
}

/*
    Declaring this in a Function Cont'd

    The TypeScript documentation for this lesson had the following code examples
    to explain a scenario in which 'this' had to be typed. 

        const user = {
            id: 123,

            admin: false,
            becomeAdmin: function () {
                this.admin = true;
            },
        };

        interface DB {
            filterUsers(filter: (this: User) => boolean): User[];
        }

        const db = getDB();

        const admins = db.filterUsers(function (this: User) {
            return this.admin;
        });

    There were gaps to this code, so I have went ahead and re-wrote it:

        interface User {
            id: number;
            name: string;
            email: string;
            admin: boolean;
        };

        interface DB {
            filterUsers(filterCallback: (this: User) => boolean): User[];
        };

        function getDB(): DB {
            const users: User[] = [
                { id: 1, name: 'Denise', email: 'denise@example.com', admin: false },
                { id: 2, name: 'Alex', email: 'alex@example.com', admin: true },
                { id: 3, name: 'Nigel', email: 'nigel@example.com', admin: false },
                { id: 4, name: 'Spooky', email: 'spooky@example.com', admin: true }
            ];

            return {
                filterUsers(filterCallback: (this: User) => boolean): User[] {
                    return users.filter(filterCallback);
                }
            };
        }

        const db = getDB();

        const admins = db.filterUsers(function (this: User) {
            return this.admin;
        });

        console.log(admins);

    However, I was receiving an error from the TypeScript's interpreter that said:
        "[ERR]: "Executed JavaScript Failed:" 
        "[ERR]: Cannot read properties of undefined (reading 'admin')"
    
    I'm not sure why this is giving my a hard time, looking into it, but in the meantime,
    it is better to re-write this example so that it does not require the use of 'this'. 

    The function below is just as good as you can still get access to the properties
    of each user object being iterated.
*/

interface User {
    id: number;
    name: string;
    email: string;
    admin: boolean;
};

interface DB {
    filterUsers(filterCallback: (user: User) => boolean): User[];
};

function getDB(): DB {
    const users: User[] = [
        { id: 1, name: 'Denise', email: 'denise@example.com', admin: false },
        { id: 2, name: 'Alex', email: 'alex@example.com', admin: true },
        { id: 3, name: 'Nigel', email: 'nigel@example.com', admin: false },
        { id: 4, name: 'Spooky', email: 'spooky@example.com', admin: true }
    ];

    return {
        filterUsers(filterCallback: (user: User) => boolean): User[] {
            return users.filter(filterCallback);
        }
    };
}

const db = getDB();

const admins = db.filterUsers(function (user: User) {
    return user.admin;
});

