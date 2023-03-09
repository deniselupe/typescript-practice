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
