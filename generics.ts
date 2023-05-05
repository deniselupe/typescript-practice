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

/*
    Generic Types

    Exploring the types of functions themselves. In the examples below 
    we wille explore the types of generic functions themselves.

    In previous sections, we created generic identity functions 
    that worked over a range of types. In this section, we'll explore 
    the type of the functions themselves and how to create generic interfaces.

    The type of generic functions is just like those non-generic functions, with the 
    type parameters listed first, similarly to function declarations:

        function identity<Type>(arg: Type): Type {
            return arg;
        }

        let myIdentity: <Type>(arg: Type) => Type = identity;


    We could have also used a different name for the generic type parameter 
    in the type, so long as the number of type variables and how the type 
    variables are used line up.

        function identity<Type>(arg: Type): Type {
            return arg;
        }

        let myIdentity: <Input>(arg: Input) => Input = identity;


    We can also write the generic type as a call signature of an object literal type:

        function identity<Type>(arg: Type): Type {
            return arg;
        }

        let myIdentity: { <Type>(arg: Type): Type } = identity;


    Which leads us to writing our first generic interface. Let's make the object 
    literal from the previous example and move it to an interface:
*/

interface GenericIdentityFn {
    <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;

/*
    Generic Types Cont'd

    In a similar example, we may want to move the generic parameter to be 
    a parameter of the whole interface. This lets us see what type(s) we're
    generic over (e.g., Dictionary<string> rather than just Dictionary). 
    
    This makes the type parameter visible to all the other members of the interface.
*/

interface GenericIdentityFnTwo<Type> {
    (arg: Type): Type;
}

function identityTwo<Type>(arg: Type): Type {
    return arg;
}

let myIdentityTwo: GenericIdentityFnTwo<number> = identity;

/*
    Generic Types Cont'd

    Notice that our example has changed to be something slightly different.
    Instead of describing a generic function, we now have a non-generic function 
    signature that is a part of a generic type. 

    When we use `GenericIdentityFnTwo`, we now will also need to specify the 
    corresponding type argument (here: `number`), effectively locking in what the 
    underlying call signature will use.

    Understanding when to put the type parameter directly on the call signature 
    and when to put it on the interface itself will be helpful in describing what aspects of 
    a type are generic.

    In addition to generic interfaces, we can also create generic classes. Note 
    that it is not possible to create generic enums and namespaces.

    
    Q & A

    Why am I able to assign the identity() function to myIdentity, if 
    myIdentity is looking for a function that accepts a number as the argument 
    and returns a number?

        interface GenericIdentityFn<Type> {
        (arg: Type): Type;
        }
        
        function identity<Type>(arg: Type): Type {
        return arg;
        }
        
        let myIdentity: GenericIdentityFn<number> = identity;


    You are able to assign the identity function `identity<Type>` to `myIdentity` 
    because `identity` is a function that accepts any type of argument and returns 
    the same type of argument, including a number.

    In this case, the `GenericIdentityFn` interface is a generic interface 
    that describes a function type that accepts an argument of a specified 
    type `Type` and returns a value of the same type. When you declare `myIdentity`
    as a variable of type `GenericIdentityFn<number>`, you are specifying that it is 
    a function that takes a number argument and returns a number value.

    Since the `identity` function also confirms to the `GenericFunctionFn` 
    interface and returns a value of the same type as its argument, it can 
    be assigned to `myIdentity`. 

    The generic type parameter `Type` of the `identity` function is inferred to 
    be `number` based on the type of `myIdentity`. '

    Therefore, `myIdentity` can be used as a function that takes a number 
    argument and returns a number value, just like the `identity` function.
*/

/*
    Generic Classes

    A generic class has a similar shape to a generic function. 

    Generic classes have a generic type parameter list in angle brackets
    (<>) following the name of the class:
*/

class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
    return x + y;
};

/*
    Generic Classes Cont'd

    This is a pretty literal use of the GenericNumber class, but 
    you may have noticed that nothing is restricting it to only use the 
    `number` type. 

    We could have instead used `string` or even more complex objects.
*/

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
    return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));

/*
    Generic Classes Cont'd

    Just as with interface, putting the type parameter on the class itself 
    lets us make sure all of the properties of the class are working with the 
    same type.

    A class has two sides to its type: the static side and the instance side.

    Generic classes are only generic over their instance side rather than 
    their static side, so when working with classes, static members can not 
    use the class's type parameter.
*/

/*
    Generic Classes Examples

    In the example below, we created a generic class named 
    `KeyValuePair` witha  type variable in the angle brackets `<T, U>`.

    They `KeyValuePair` class includes two private generic member 
    variables and a generic function `setKeyValue` that takes two 
    input arguments of type  `T` and `U`. This allows us to create 
    an object of `KeyValuePair` with any type of key and value.
*/

class KeyValuePair<T, U> {
    private key: T;
    private val: U;

    setKeyValue(key: T, val: U): void {
        this.key = key;
        this.val = val;
    }

    display(): void {
        console.log(`Key = ${this.key}, Val = ${this.val}`);
    }
}

let kvp1 = new KeyValuePair<number, string>();
kvp1.setKeyValue(1, "Steve");
kvp1.display(); // Output: Key = 1, Val = Steve

let kvp2 = new KeyValuePair<string, string>();
kvp2.setKeyValue("CEO", "Bill");
kvp2.display(); // Output: Key = CEO, Val = Bill

/*
    Generic Classes Examples Cont'd

    The generic class can also implement a generic interface.

    In the example below, the generic class `KVProcessor` implements 
    the generic interface `IKeyValueProcessor`. It does not specify the 
    type parameter `<T, U>`, instead it allows users to set them themselves.

    Thus, `KVProcessor` class can be used with any type of key and value. 

    A variable is defined as generic interface type with underlying 
    types for `T` and `U`. So, you don't need to set the generic types for 
    `KVProcessor`.
*/

interface IKeyValueProcessor<T, U> {
    process(key: T, val: U): void;
}

class KVProcessor<T, U> implements IKeyValueProcessor<T, U> {
    process(key: T, val: U): void {
        console.log(`Key = ${key}, Val = ${val}`);
    }
}

let proc: IKeyValueProcessor<number, string> = new KVProcessor();
proc.process(1, "Bill"); // Output: Key = 1, Val = Bill

/*
    Generic Constraints

    If you remember from an earlier example, you may sometimes want to 
    write a generic function that works on a set of types where you have some 
    knowledge about what capabilities that set of types will have. 

    In our loggingIdentity example, we wanted to be able to access the `.length` 
    property of `arg`, but the compiler could not prove that every type had a 
    `.length` property, so it warns us that we can't make this assumption.
*/

function loggingIdentityRecap<Type>(arg: Type): Type {
    // Error: Property 'length' does not exist on type 'Type'.
    console.log(arg.length);
    return arg;
}

/*
    Generic Constraints Cont'd

    Instead of working with any and all types, we'd like to constain this function 
    to work with any and all types that also have the `.length` property. 

    As long as the type has this member, we'll allow it, but it's required to have at
    least this member.

    To do so, we must list out requirement as a constraint on what `Type` can be.

    To do so, we'll create an interface that describes our constraint. Here, we'll 
    create an interface that has a single `.length` property and then 
    we'll use this interface and the `extends` keyword to denote our constraint:
*/

interface Lengthwise {
    length: number;
}

function loggingIdentityLengthOnly<Type extends Lengthwise>(arg: Type): Type {
    console.log(arg.length); // NO ERROR! <3
    return arg;
}

/*
    Generic Constraints Cont'd

    Because the generic function loggingIdentityLengthOnly is now constrained, it 
    will no longer work over any and all types:

        // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
        loggingIdentityLengthOnly(3); 

    Instead, we need to pass in values whose type has all the required properties:

        loggingIdentityLengthOnly({ length: 10, value: 3 }); // No error!
*/

/*
    Using Type Parameters in Generic Constraints

    You can declare a type parameter that is constrained by another type 
    parameter. For example, here we'd like to get a property 
    from an object given its name. We'd like to ensure that we're not 
    accidentally grabbing a property that does not exist on the `obj`, 
    so we'll place a constraint between the two types:
*/

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

let myObj = { a: 1, b: 2, c: 3, d: 4 };

// This is OK
getProperty(myObj, "a");

// Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
getProperty(myObj, "m");

/*
    Using Class Types in Generics

    When creating factories in TypeScript using generics, it is 
    necessary to refer to class types by their constructor functions. 

    For example:
*/

function create<Type>(c: { new(): Type }): Type {
    return new c();
}

class Duck {
    quack: string;

    constructor() {
        this.quack = "quack!";
    }
}

let duck1 = create<Duck>(Duck);

/*
    Using Class Types in Generics Cont'd

    A more advanced example uses the prototype property to infer 
    and constrain relationships between the constructor function 
    and the instance side of class types.

    The pattern below is used to power the mixins design pattern.
*/

class BeeKeeper {
    hasMask: boolean = true;
}

class ZooKeeper {
    nametag: string = "Mikle";
}

class Animal {
    numLegs: number = 4;
}

class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new() => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;