/*
    Optional Paramaters in Callbacks

    Reference: 
    https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
    https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-with-fewer-parameters-assignable-to-functions-that-take-more-parameters
*/

/* 
    SCENARIO 1

    We write some code and expect to receive an error that tells us that
    doSomething() expected a callback with parameters but only received a callback
    with one parameter..

    What really happens though is, nothing. We don't get an error.

    Why is this? We specified that doSomething's callback would be a function
    that accepted two parameters, and the handler() function only accepts 1 parameter.

    According to TypeScript's FAQ, this is expected and desired behavior. They rely on the 
    "substitutability" primer to evaluate handler() as a valid argument for callback() because 
    it can safely ignore the extra parameters. 

    In JavaScript, if you call a function with more arguments than there are parameters, the extra 
    arguments are simply ignored. TypeScript also follows this example. 
    
    For this reason, the handler() function that takes in only 1 parameter can be a valid argument for 
    doSomething()'s callback parameter, even though that callback parameter is defined as a function that 
    takes in 2 parameters. 
    
    Again, the reason for this is because you can then call
    callback() with all the necessary arguments you wanna pass in, and handler() can accept
    all those arguments, but will only use the first argument passed in, and ignore all the rest
    of the arguments that handler() was invoked with.
*/

// This function only accepts 1 parameter, if it gets invoked with additional arguments, those additional arguments are ignored
function handler(arg: string) {
    console.log(arg);
}

function doSomething(callback: (arg1: string, arg2: number) => void) {
    // When doSomething(handler) gets called, handler will be invoked as handler('hello', 42)
    // And only accept the 'hello' argument, and ignore the 42 argument.
    callback('hello', 42);
}

// The result of this is a console.log for just 'hello'
doSomething(handler);


/*
    SCENARIO 2:

    We want to create a custom forEach() function called myForEach().

    We want our myForEach() function to accept an array as its first parameter, and 
    a callback for the second parameter. The callback will accept two parameters, the first
    one being the element that being iterated, and the second parameter being the index of that
    array element currently being iterated. 
*/

function myForEach(arr: any[], callback: (elem: any, index: number) => void) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i);
    }
}

myForEach([1, 2, 3], (elem, index) => console.log(index.toFixed()));

/*
    SCENARIO 2 CONT'D

    We do however want the myForEach()'s callback function to behave similar to 
    Array.prototype.forEach()'s callback function. We want to give the user the 
    option to specify whether they want the callback function to accept 1 parameter (elem)
    or both parameters (elem, index).

    Does this mean then that we have to re-write our myForEach() function to look like this?

    function myForEach(arr: any[], callback: (elem: any, index?: number) => void) {
        for (let i = 0; i < arr.length; i++) {
            callback(arr[i], i);
        }
    }

    No, and if anything, making the callback's index parameter optional will be unnecessary.
    The function defined in like 64 will allow users to customize whether they want their callback
    function to accept 1 parameter or 2.
*/

myForEach([1, 2, 3], (elem) => console.log(elem));
myForEach([1, 2, 3], (elem, index) => console.log(elem, index));