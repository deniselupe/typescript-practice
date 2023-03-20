"use strict";
exports.__esModule = true;
// The simplest way to describe a function with a function type expression which looks like an arrow function
// The syntax (a: string) => void means "a function with one parameter, named a, of type string, that doesn't have a return value"
function greeter(fn) {
    fn("Hello world!");
}
function printToConsole(s) {
    console.log(s);
}
greeter(printToConsole);
function greeter1(fn) {
    // ...
}
;
function doSomething(fn) {
    console.log("".concat(fn.description, " returned ").concat(fn(6)));
}
function theDescribableFunc(n) {
    return true;
}
theDescribableFunc.description = 'The Describable Function';
doSomething(theDescribableFunc);
;
;
function createPerson(constructor) {
    return new constructor("Denise");
}
var PersonClass = /** @class */ (function () {
    function PersonClass(name) {
        this.name = name;
        this.name = name;
    }
    return PersonClass;
}());
var Person = PersonClass;
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
function firstElement(arr) {
    return arr[0];
}
function firstElementTyped(arr) {
    return arr[0];
}
var s = firstElementTyped(["a", "b", "c"]);
var n = firstElementTyped([1, 2, 3]);
var u = firstElementTyped([]);
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
function map(arr, func) {
    return arr.map(func);
}
// Parameter 'n' is os type 'string'
// 'parsed' is of type number[]
var parsed = map(["1", "2", "3"], function (n) { return parseInt(n); });
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
function longest(a, b) {
    if (a.length >= b.length) {
        return a;
    }
    else {
        return b;
    }
}
// longerArray is of type number[]
var longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
var longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
var notOk = longest(10, 100);
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
function minimumLength(obj, minimum) {
    if (obj.length >= minimum) {
        return obj;
    }
    else {
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
var arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have a 'slice' method, but not the returned object!
console.log(arr.slice(0));
/*
    Specifying Type Arguments

    TypeScript can usually infer the intended type arguments in a generic call,
    but not always. For example, let's say you wrote a function to combine
    two arrays.

    Normally it would be an error to call this function with mismatched arrays:
*/
function combine(arr1, arr2) {
    return arr1.concat(arr2);
}
var arrOne = combine([1, 2, 3], ["hello"]);
/*
    Specifying Type Arguments Cont'd

    If you intended to do this, however, you could manually specify Type:
*/
var arrTwo = combine([1, 2, 3], ["hello"]);
/*
    Guidelines for Writing Good Generic Functions

    Writing Generic functions is fun, and it can be easy to get carried away
    with type parameters. Having too many type parameters or using constraints where
    they aren't needed can make inference less successful, frustrating callers of your function.

    Push Type Parameters Down

    Here are two ways of writing a function that appear similar:
*/
function firstElement1(arr) {
    return arr[0];
}
function firstElement2(arr) {
    return arr[0];
}
// a: number (good)
var a = firstElement1([1, 2, 3]);
// b: any (bad)
var b = firstElement2([1, 2, 3]);
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
function filter1(arr, func) {
    return arr.filter(func);
}
function filter2(arr, func) {
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
function greetOne(s) {
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
function greetTwo(s) {
    console.log("Hello, " + s);
}
/*
    Optional Parameters

    Functions in JavaScript often take a variable number of arguments.

    For example, the toFixed method of number takes an optional digit count:
*/
function fOne(n) {
    console.log(n.toFixed()); // 0 arguments
    console.log(n.toFixed(3)); // 1 argument
}
/*
    Optional Parameters Cont'd

    We can model this in TypeScript by marking the parameter as optional
    with ?:
*/
function fTwo(x) {
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
function fThree(x) {
    if (x === void 0) { x = 10; }
    // ...
}
// cut
// All OK
fFour();
fFour(10);
fFour(undefined);
function makeDate(mOrTimestamp, d, y) {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    }
    else {
        return new Date(mOrTimestamp);
    }
}
// You can invoke makeDate() with 1 argument or 3 arguments, but not 2 arguments
var d1 = makeDate(12345678);
var d2 = makeDate(5, 5, 5);
var d3 = makeDate(1, 3);
function fn() {
    // ...
}
// Expected to be able to call with zero arguments
fn();
function fnTwo(x) { }
function fnThree(x) {
    return "oops";
}
function len(x) {
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
function lenTwo(x) {
    return x.length;
}
lenTwo(Math.random() > 0.5 ? "hello" : [0]);
;
;
/*
    Declaring this in a Function

    TypeScript will infer what the 'this' should be in a function via code
    flow analysis, for example in the following:
*/
var user = {
    id: 123,
    admin: false,
    becomeAdmin: function () {
        this.admin = true;
    }
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
var element = document.querySelector('button');
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
function typedHandleClick() {
    // this = HTMLButtonElement
    console.log(this.innerText);
}
/*
    Declaring this in a Function Cont'd

    And that's it! You can of course specify more function parameters,
    for things like the 'event':
*/
function typedHandleClickTwo(event) {
    console.log(this.innerText); // Click me!
    console.log(event.target.innerText); // Click me!
}
;
;
function getDB() {
    var users = [
        { id: 1, name: 'Denise', email: 'denise@example.com', admin: false },
        { id: 2, name: 'Alex', email: 'alex@example.com', admin: true },
        { id: 3, name: 'Nigel', email: 'nigel@example.com', admin: false },
        { id: 4, name: 'Spooky', email: 'spooky@example.com', admin: true }
    ];
    return {
        filterUsers: function (filterCallback) {
            return users.filter(filterCallback);
        }
    };
}
var db = getDB();
var admins = db.filterUsers(function (user) {
    return user.admin;
});
/*
    Other Types to Know About

    There are some additional types you'll want to recognize that appear often when
    working with function types. Like all types, you can use them everywhere,
    but these are especially relevant in the context of functions.

    - void
    - object
    - unknown
    - never
    - Function
*/
/*
    Other Types to Know About: void

    'void' represents he return value of functions which don't return a value.
    It's the inferred type any time a function doesn't have any return
    statements, or doens't return any explicit value from those return statements.

    The inferred type for the function below is 'void'.

    In JavaScript, a function that doesn't return any value will implicitly return the
    value of undefined. However, void and undefined are not the same thing in TypeScript.

    There are further details at the end of the chapter.

    'void' is not the same as undefined.
*/
function noop() {
    return;
}
/*
    Other Types to Know About: object

    The special type 'object' refers to any value that isn't a primitive
    ('string', 'number', 'bigint', 'boolean', 'symbol', 'null', or 'undefined'). This is
    different from the empty object type { }, and also different from the global type
    'Object'. It's very likely you will never use 'Object'.

    'object' is not 'Object'. Always use 'object'!

    Note that in JavaScript, function values are objects: They have properties, have
    'Object.prototype' in their prototype chain, are 'instanceof Object', you can call 'Object.keys'
    on them, and so on. For this reason, function types are considered to be 'objects' in TypeScript.
*/
/*
    Other Types to Know About: unknown

    The 'unknown' type represents any value. This is similar to the 'any' type, but is
    safer because it's not legal to do anything with an 'unknown' value.

    This is useful when describing function types because you can describe functions
    that accept any value without having 'any' values in your function body.

    Conversely, you can describe a function that returns a value of 'unknown' type.
*/
function theAnyFunction(a) {
    a.b(); // OK
}
function theUnknownFunction(a) {
    a.b(); // Property 'b' does not exist on type 'unknown'
}
function safeParse(s) {
    return JSON.parse(s);
}
// Need to be careful with 'obj'!
var obj = safeParse(someRandomString);
/*
    Other Types to Know About: never

    Some functions never return a value.

    The 'never' type represents values which are never observed. In a return type,
    this means that the function throws an exception or terminates execution of the program.

    'never' also appears when TypeScript determines there's nothing left in a union.
*/
function fail(msg) {
    throw new Error(msg);
}
function fn(x) {
    if (typeof x === "string") {
        // do something
    }
    else if (typeof x === "number") {
        // do something else
    }
    else {
        x; // has type 'never'
    }
}
/*
    Other Types to Know About: Function

    The global type 'Function' describes properties like 'bind', 'call', 'apply', and others present
    on all function values in JavaScript.

    It also has the special property that values of type 'Function' can always be called; these calls
    return 'any'.

    This is an untyped function call and is generally best avoided because of the unsafe 'any'
    return type.

    If you need to accept any arbitrary function but don't intend to call it, the type
    '() => void' is generally safer.
*/
function doSomethingTwo(f) {
    return f(1, 2, 3);
}
/*
    Rest Parameters and Arguments

    In addition to using optional parameters or overloads to make functions that can accept
    a variety of fixed argument counts, we can also define functions that take an unbounded
    number of arguments using rest parameters.

    A rest parameter appears after all other parameters, and uses the ... syntax.

    In TypeScript, the type annotation on these parameters is implicitly 'any[]' instead of
    'any', and any type annotation given must be of the form 'Array<T>' or 'T[]', or a tuble type
    (which we'll learn about later).
*/
function multiple(n) {
    var m = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        m[_i - 1] = arguments[_i];
    }
    return m.map(function (x) { return n * x; });
}
// 'z' gets vlue [10, 20, 30, 40]
var z = multiple(10, 1, 2, 3, 4);
/*
    Rest Arguments

    Conversely, we can provide a variable number of arguments from an array
    using the spread syntax. For example, the 'push' method of arrays takes any
    number of arguments:
*/
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
arr1.push.apply(arr1, arr2);
/*
    Rest Arguments Cont'd

    Note that in general, TypeScript does not assume that arrays are immutable.
    This can lead to some surprising behavior:
*/
// Inferred type is number[] -- "an array with zero or more number"
// not specifically two number
var args = [8, 5];
var angle = Math.atan2.apply(Math, args);
/*
    Parameter Destructuring

    You can use parameter destructure to conveniently unpack objects provided
    as an argument into one or more local variables in the function body.
    In JavaScript, it looks like this:

        function sum({ a, b, c }) {
            console.log(a + b + c);
        }

        sum({ a: 10, b: 3, c: 9 });

    The Type Annotation for the object goes after the destructuring syntax:
*/
function sumOne(_a) {
    var a = _a.a, b = _a.b, c = _a.c;
    console.log(a + b + c);
}
sumOne({ a: 10, b: 3, c: 9 });
function sumTwo(_a) {
    var a = _a.a, b = _a.b, c = _a.c;
    console.log(a + b + c);
}
var f1 = function () {
    return true;
};
var f2 = function () { return true; };
var f3 = function () {
    return true;
};
/*
    Assignability of Functions: Return Type void Cont'd

    And when the return value of one of these functions is assigned to
    another variable, it will return the type of 'void'.
*/
var v1 = f1();
var v2 = f2();
var v3 = f3();
/*
    Assignability of Functions: Return Type void Cont'd

    This behavior exists so that the following code is valid even
    thought Array.prototype.push returns a number and the
    Array.prototype.forEach method expects a callback function with
    a return type of 'void'.
*/
var src = [1, 2, 3];
var dst = [0];
src.forEach(function (el) { return dst.push(el); });
/*
    Assignability of Functions: Return Type void Cont'd

    There is one special case to be aware of, when a literal function
    definition has a 'void' return type, that function must NOT
    return anything.
*/
function f4() {
    // @ts-expect-error
    return true;
}
var f5 = function () {
    // @ts-expect-error
    return true;
};
