/*
    Generics 

    A major part of software engineering is building components that 
    not only have well-defined and consistent APIs, but are also resusable. 

    Components that are capable of working on then data of today as well as 
    the data of tomorrow will give you the most flexible capabilities for
    building up large software systems.

    In languages like C# and Java, one of the main tools in the toolbox 
    for creating reusable components is Generics, that is, being 
    able to create a component that can work over a variety of types 
    rather than a single one. 

    This allows users to consume those components and use their own types.
*/

/*
    Hello World of Generics

    To start off, let's do the "hello world" of Generics:
    The Identity Function

    The Identity Function is a function that will return back 
    whatever is passed in. You can think of this in a similar way 
    to the `echo` command.

    Without Generics, we would either have to give the identity 
    function a specific type:
*/

function numberIdentity(arg: number): number {
    return arg;
}

// Or, we could describe the identity function using the any type:
function anyIdentity(arg: any): any {
    return arg;
}

/*
    Hello World of Generics Cont'd

    While using `any` is certainly generic in that it will cause the 
    function to accept any and all types for the type of `arg`, we actually 
    are losing the information about what that type was when the function returns.

    If we passed in a number, the only information we have is that any type 
    could be returned. 

    Instead, we need a way of capturing the type of the argument in such a 
    way that we can also use it to denote what is being returned. Here, we will 
    use a Type Variable, a special kind of variable that works on types rather 
    than values.
*/

function genericIdentity<Type>(arg: Type): Type {
    return arg;
}

/*
    Hello World of Generics Cont'd

    We've now added a type varaible 'Type' to the genericIdentity function. 
    This 'Type' allows us to capture the type the user provides (e.g., `number`), 
    so that we can use that information later.

    Here, we use `Type` again as the return type. On inspection, we can now see 
    the same type is used for the argument and the return type. This allows us 
    to traffic that type information in one side of the function and out the other.

    We say that this version of the identity function is generic, as it works over 
    a range of types. Unlike using any, it's also just as precise (i.e., it doesn't 
    lose any information) as the first identity function that used numbers for their 
    argument and return type.

    Once we've written the generic identity function, we can call it in one of two
    ways. The first way is to pass all of the arguments, including the type argument, 
    to the function:
*/

let output = genericIdentity<string>("myString");

/*
    Hello World of Generics Cont'd

    Notice that we didn't have to explicitly pass the type in 
    the angle brackets (<>); the compiler just looked at the value 
    "myString", and set `Type` to its type. While type argument inference 
    can be a helpful tool to keep code shorter and more readable, you may 
    need to explicitly pass in the type arguments as we did in the previous
    example when the compiler fails to infer the type, as may happen in more 
    complex examples.
*/

/*
    Working with Generic Type Variables

    When you begin to use generics, you'll notice that when you 
    create generic functions like `identity`, the compiler will enforce 
    that you use any generically typed parameters in the body of the function 
    correctly. 

    That is, that you actually treat these parameters as if they could be any 
    and all types.

    Let's take our `identity` function from earlier:

        function identity<Type>(args: Type): Type {
            return arg;
        }

    What if we want to also log the length of the arguement `arg` to the 
    console with each call? 

    We might be tempted to write this:

        function loggingIdentity<Type>(arg: Type): Type {
            // Error: Property 'length' does not exist on type 'Type'
            console.log(arg.length);
            return arg;
        }

    When we do, the compiler will give us an error that we're using the 
    `.length` memeber of `arg`, but nowhere have we said that `arg` has 
    this member. Remember, we said earlier that these type variables stand in 
    for any and all types, so someone using this function could have passed in a 
    number instead, which does not have a `.length` member.

    Let's say that we've actually intended this function to work on arrays of 
    `Type` rather than `Type` directly. Since we're working with arrays, the 
    `.length` member should be available.

    We can describe this just like we would create arrays of other types:

        function loggingIdentity<Type>(arg: Type[]): Type[] {
            console.log(arg.length);
            return arg;
        }

    You can read the type of `loggingIdentity` as "the generic function `loggingIdentity` 
    takes a type parameter `Type`, and an argument `arg` which is an array of `Type`s and 
    returns an array of `Type`s." If we passed in an array of numbers, we'd get an array of 
    number back out, as `Type` would bind to `number`. This allows us to use our 
    generic type variable `Type` as part of the types we're working with, 
    rather than the whole type, giving us greater flexibility.

    We can alternatively write the sample example this way:
*/

function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}

/*
    Working with Generic Type Variables Cont'd

    You may already be familiar with this style of type from other 
    languages. In the next section, we'll cover how you can create your
    own generic types like Array<Type>.
*/