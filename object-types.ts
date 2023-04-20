/*
    In JavaScript, the fundamental way that we group and pass
    around data is through objects. 

    In TypeScript, we represent those through object types.

    As we've seen, object types can be anonymous, or they can be
    named by using either an interface or a type alias.

    In all three examples below, we've written functions that take 
    objects that contain the property 'name' (which must be a 'string')
    and 'age' (which must be a 'number').
*/

function greet1(person: { name: string; age: number }) {
    return "Hello " + person.name;
}

interface PersonInterface {
    name: string;
    age: number;
}

function greet2(person: PersonInterface) {
    return "Hello " + person.name;
}

type PersonType = {
    name: string;
    age: number;
};

function greet3(person: PersonType) {
    return "Hello " + person.name;
}

/*
    Property Modifiers

    Each property in an object type can specify a couple things:
        - the type
        - whether the property is optional 
        - whether the property can be written to


    
    Optional Properties

    Much of the time, we'll find ourselves dealing with objects 
    that might have a property set. In those cases, we can mark those
    properties as optional by adding a question mark (?) to the end of
    their names.

    In the example below, both xPos and yPos are considered optional. We can 
    choose to provide either of them, so every call above to paintShape 
    is valid. All optionality really says is that if the property is set, 
    it better have a specific type.
*/

type Shape = 'Square' | 'Circle' | 'Triangle';

function getShape(): Shape {
    const shapes: Shape[] = ['Square', 'Circle', 'Triangle'];
    const index = Math.floor(Math.random() * 3);
    
    return shapes[index];
}

interface PaintOptions {
    shape: Shape;
    xPos?: number;
    yPos?: number;
}

function paintShape(opts: PaintOptions) {
    //...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });

/*
    Optional Properties Cont'd

    We can also read from those properties - but when we do under
    strictNullChecks, TypeScript will tell us they're potentially
    undefined.
*/

function paintShape2(opts: PaintOptions) {
    let xPos = opts.xPos;
    let yPos = opts.yPos;

    //...
}

/*
    Optional Properties Cont'd

    In JavaScript, even if the property has never been set, we can still
    access it - it's just going to give us the value 'undefined'. We can 
    just handle 'undefined' specially.
*/

function paintShape3(opts: PaintOptions) {
    let xPos = opts.xPos === undefined ? 0 : opts.xPos;
    let yPos = opts.yPos === undefined ? 0 : opts.yPos;

    //...
}

/*
    Optional Properties Cont'd

    Not that this pattern of setting defaults for unspecified values 
    is so common that JavaScript has syntax to support it.

    Here we used a destruturing pattern for paintShape5's parameter,
    and provided default values for xPos and yPos. Now xPos and yPos are both
    definitely present within the body of paintShape5, but optional for any 
    callers to paintShape5.
*/

function paintShape4({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
    console.log("x coordinate at", xPos);
    console.log("y coordinate at", yPos);

    //...
}

/*
    Optional Properties Cont'd

    Note: There is currently no way to place type annotations within 
    destructuring patterns. This is because the following syntax already
    means something different in JavaScript.

    In an object destructuring pattern, 'shape: Shape' means, "grab the property
    'shape' and redefine it locally as a variable named 'Shape'". Likewise 'xPos: number'
    creates a variable named 'number' whose value is based on the parameter's 'xPox'.

    Using mapping modifiers, you can remove optional attributes.
*/

function paintShape5({ shape: Shape, xPos: number = 100 /*...*/ }) {
    render(shape);
    render(xPos);
}

/*
    readonly Properties

    Properties can also be marked as 'readonly' for TypeScript. While it 
    won't change any behavior at runtime, a property marked as 'readonly'
    can't be written to during type-checking.
*/

interface SomeType {
    readonly prop: string;
}

function doSomething(obj: SomeType) {
    // We can read from 'obj.prop'
    console.log(`prop has the value '${obj.prop}'.`);

    // But we can't re-assign it
    obj.prop = "hello";
}

/*
    readonly Properties Cont'd

    Using the 'readonly' modifier doesn't necessarily imply 
    that a value is totally immutable - or in other words, that its
    internal contents can't be changed. It just means the property 
    itself can't be re-written to.
*/

interface Home {
    readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
    // We can read and update properties from 'home.resident'
    console.log(`Happy birthday ${home.resident.name}!`);
    home.resident.age++;
}

function evict(home: Home) {
    // But we can't write to the 'resident' property itself on a 'Home'

    home.resident = {
        name: "Victor the Evictor",
        age: 42
    };
}


/*
    readonly Properties Cont'd

    It's important to manage expectations of what 'readonly' implies.
    It's useful to signal intent during development time for TypeScript 
    on how an object should be used. TypeScript doesn't factor in whether 
    properties on two types are 'readonly' when checking whether those types
    are compatible, so 'readonly' properties can also change via aliasing.

    Using mapping modifiers, you can remove 'readonly' attributes.
*/

interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42
};

let readonlyPerson: ReadonlyPerson = writablePerson; // works

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'

/*
    Index Signatures

    Sometimes you don't know all the names of a type's properties 
    ahead of time, but you do know the shape of the values. 

    In those cases you can use an index signature to describe the types
    of possible values, for example:
*/

interface StringArray {
    [index: number]: string;
}

function getStringArray() {
    return ['one', 'two', 'three'];
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];

/*
    Index Signatures Cont'd

    Above, we have a StringArray interface which has an index signature.
    This index signature states that when a StringArray is indexed with a 
    'number', it will return a 'string'.

    Only some types are allowed for index signature properties: 'string',
    'number', 'symbol', template string patterns, and union types consisting
    only of these.



    It is possible to support both types of indexers, but the type returned 
    from a numeric indexer must be a subtype of the type returned from the 
    string indexer. This is because when indexing with a 'number', JavaScript
    will actually convert that to a 'string' before indexing into an object. 

    That means that indexing with 100 (a number) is the same thing as indexing
    '100' (a string), so the two need to be consistent.
*/

interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

// Error: indexing with a numeric string might get you a completely seperate type of Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

/*
    Index Signatures Cont'd

    While string index signatures are a powerful way to describe the 
    dictionary pattern, they also enforce that all properties match
    their return type. 

    This is because a string index declares that 'obj.property' is
    also available as 'obj["property"]'. In the following example, 
    name's type does not match the string index's type, and the 
    type checker gives an error:
*/

interface NumberDictionary {
    [index: string]: number;
    length: number; // ok
    name: string;
}

/*
    Index Signatures Cont'd

    However, properties of different types are acceptable if the index
    signature is a union of the property types:
*/

interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number; // ok, length is a number
    name: string; // ok, name is a string
}

/*
    Index Signatures Cont'd

    Finally, you can make index signatures 'readonly' in order to prevent
    assignment to their indices.

    In the example below, you can't set myArray2[1] because the index
    signature is readonly.
*/

interface ReadonlyStringArray {
    readonly [index: number]: string;
}

function getReadOnlyStringArray() {
    return ['hello', 'world'];
}

let myArray2: ReadonlyStringArray = getReadOnlyStringArray();
myArray2[1] = 'friend';

/*
    Extending Types
    
    It's pretty common to have types that might be more specific versions
    of other types. For example, we might have a BasicAddress type that 
    describes the fields necessary for sending letters and packages in 
    the U.S.
*/

interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

/*
    Extending Types Cont'd

    In some situations that's enough, but addresses often have a unit
    number associated with them if the building at an address has multiple
    units. We can then describe an AddressWithUnit type.
*/

interface AddressWithUnit {
    name?: string;
    unit: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

/*
    Extending Types Cont'd

    The 'extends' keyword on an interface allows us to effectively copy members
    from other named types, and add whatever new members we want. This can be 
    useful for cutting down the amount of type declaration boilerplate 
    we have to write, and for signaling intent that several different declarations
    of the same property might be related. For example, AddressWithUnit didn't
    need to repeat the 'street' property, and because 'street' originates 
    from BasicAddress, a reader will know that those two types are related in
    some way.

    'interface' s can also extend from multiple types.
*/

interface Colorful {
    color: string;
}

interface Circle {
    radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
    color: "red",
    radius: 42
};

/*
    Intersection Types Cont'd

    'interface' s allowed us to build up new types from types by extending them.
    TypeScript provides another construct called intersection types that is mainly 
    used to combine existing object types.

    An intersection type is defined using the & operator.
*/

interface ColorfulTwo {
    color: string;
}

interface CircleTwo {
    radius: number;
}

type ColorfulCircleTwo = ColorfulTwo & CircleTwo;

/*
    Intersection Types Cont'd

    In the example below, we intersected ColorfulTwo and CircleTwo to produce a 
    new type that has all the members of ColorfulTwo and CircleTwo.
*/

function draw(circle: ColorfulTwo & CircleTwo) {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: "blue", radius: 42 });

// oops
draw({ color: "red", raidus: 42 });

/*
    Intefaces Versus Intersections

    We just looked at two ways to combine types which are similar, but are
    actually subtly different. With interfaces, we could use an 'extends' 
    clause to extend from other types, and we were able to do something
    similar with intersections and name the result with a type alias. 

    The principle difference between the two is how conflicts are handled,
    and that difference is typically one of the main reasons why you'd 
    pick one over the other between an interface and a type alias 
    of an intersection type.
*/

/*
    Generic Object Types

    Let's imagine a 'Box' type that can contain any value - strings, numbers, 
    Giraffes (interface), whatever.

    Right now, the 'contents' property is typed as 'any', which works, but 
    can lead to accidents down the line.

    We could instead use 'unknown', but that would mean that in cases where 
    we already know the type of contents, we'd need to do precautionary checks, 
    or use error-prone type assertions.
*/

interface Box {
    contents: unknown;
}

let x: Box = {
    contents: "Hello world!",
};

// we could check 'x.contents'
if (typeof x.contents === "string") {
    console.log(x.contents.toLowerCase());
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase());

/*
    Generic Object Types Cont'd

    One type safe approach would be to instead scaffold out different
    'Box' types for every type of 'contents'.

    But that means we'll have to create different functions, or overloads
    of functions, to operate on these types.

    That's a lot of boilerplate. Moreover, we might later need to introduce new
    types and overloads. This is frustrating, since our box types and overloads 
    are all effectively the same.
*/

interface NumberBox {
    contents: number;
}

interface StringBox {
    contents: string;
}

interface BooleanBox {
    contents: boolean;
}

function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
    box.contents = newContents;
}

/*
    Generic Object Types Cont'd

    Instead, we can make a generic 'Box' type which declares a type 
    parameter.
*/

interface GenericBox<Type> {
    contents: Type;
}

/*
    Generic Object Types Cont'd

    You might read this as "A GenericBox of Type is something whose contents
    have type Type". Later on, when we refer to GenericBox, we have to give a 
    type parameter in place of 'Type'.

    let box: GenericBox<string>;
    let box: GenericBox<number>;
    let box: GenericBox<boolean>;

    Think of GenericBox as a template for a real type, where 'Type' is a placeholder
    that will get replaced with some other type. When TypeScript sees GenericBox<string>, 
    it will replace every instance of 'Type' in GenericBox<Type> with 'string', and end 
    up working with something like { contents: string }. In other words, GenericBox<string>
    and our earlier StringBox types work identically.
*/

let boxA: GenericBox<string> = { contents: "hello" };
boxA.contents;

let boxB: StringBox = { contents: "world" };
boxB.contents;

/*
    Generic Object Types Cont'd 

    GenericBox<Type> is reusable in that 'Type' can be substituted with anything.
    That means that when we need a box for a new type, we don't need to declare a 
    new Box type at all (althought we certainly coult if we wanted to).
*/

interface Apple {
    // ...
}

// Same as '{ contents: Apple }'.
type AppleBox = GenericBox<Apple>;

/*
    Generic Object Types Cont'd 

    This also means that we can avoid overloads entirely by instead
    using generic functions.
*/

function setContents<Type>(box: GenericBox<Type>, newContents: Type) {
    box.contents = newContents;
}

/*
    Generic Object Types Cont'd 

    It is worth nothing that type aliases can also be generic. We could 
    have defined our new GenericBox<Type> interface by using a type alias
    instead.

    type GenericBox<Type> = {
        contents: Type;
    };

    Since type aliases, unlike interfaces, can describe more than just object 
    types, we can also use them to write other kinds of generic helper types.

    We'll circle back to type aliases in just a little bit.
*/

type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;

/*
    The Array Type

    Generic object types are often some sort of container type that work independently 
    of the type of elements they contain. It's ideal for data structures to work 
    this way so that they're re-usable across different data types.

    It turns out we've been working with a type just like that throughout this 
    handbook: the Array type. Whenever we write out types like `number[]` or `string[]`, 
    that's really just a shorthand for `Array<number>` or `Array<string>`.

    And much like the Box type above, Array itself is a generic type.

    Modern JavaScript also provides other data structures which are generic, like 
    Map<K, V>, Set<T>, and Promise<T>. All this really means is that because of how 
    Map, Set, and Promise behave, they can work with any sets of types.
*/

function doSomethingArray(value: Array<string>) {
    //...
}

let myArrayExample: string[] = ["hello", "world"];

// either of these work!
doSomethingArray(myArrayExample);
doSomethingArray(new Array("hello", "world"));

interface Array<Type> {
    // Gets or sets the length of the array
    length: number;

    // Removes the last element from an array and returns it
    pop(): Type | undefined;

    // Appends new elements to an array, and returns the new length of the array
    push(...items: Type[]): number;
}

/*
    The ReadonlyArray Type

    The ReadyonlyArray is a special type that describes arrays that shouldn't
    be changed.

    Much like the `readonly` modifier for properties, it's mainly a tool 
    we can use for intent. When we see a function that returns `ReadonlyArray`s, 
    it tells us we're not meant to change the contents at all, and when we 
    see a function that consumes `ReadonlyArray`s, it tells us that we can pass 
    any array into that fnction without worrying that it will change its contents.
*/

function doStuffReadonlyArray(values: ReadonlyArray<string>) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);

    // ...but we can't mutate 'values'.
    // Error: Property 'push' does not exist on type 'readonly string[]'.
    values.push("hello!");
}

/*
    The ReadonlyArray Type Cont'd

    Unlike `Array`, there isn't a `ReadonlyArray` constructor that we can use.

    Instead, we can assign regular `Array`s to `ReadonlyArrays`.
*/

// Error: 'ReadonlyArray' only refers to a type, but is being used as a value here.
new doStuffReadonlyArray("red", "green", "blue");

const roArray: ReadonlyArray<string> = ["red", "green", "blue"];

/*
    The ReadonlyArray Type Cont'd

    Just as TypeScript provides a shorthand syntax for `Array<Type>` with `Type[]`,
    it also provides a shorthand syntax for `ReadonlyArray<Type>` with `readonly Type[]`.
*/

function doStuffReadonlyArrayTwo(values: readonly string[]) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${value[0]}`);

    // ...but we can't mutate 'values'.
    // Error: Property 'push' does not exist on type 'readonly string[]'.
    values.push("hello!");
}

/*
    The ReadonlyArray Type Cont'd

    One last thing to note is that unlike the `readonly` property modifier, 
    assignability isn't bidirectional between regular `Array`s and `ReadonlyArray`s.
*/

let x: readonly string[] = [];
let y: string[] = [];

// Error: The type `readonly string[]` is `readonly` and cannot be assigned to the mutable type `string[]`.
x = y;
y = x;

/*
    Tuple Types

    A tuple type is another sort of `Array` type that knows exactly how many 
    elements it contains, and exactly which types it contains at specific positions.

    Here, `StringNumberPair` is a tuple type of `string` and `number`. Like `ReadonlyArray`, 
    it has no representation at runtime, but is significant to TypeScript. To the type 
    system, `StringNumberPair` describes arrays whose 0 index contains a `string`, and 
    whose 1 index contains a `number`.
*/

type StringNumberPair = [string, number];

function doSomethingTuple(pair: [string, number]) {
    // ...

    // Error: Tuple type `[string, number]` of length 2 has no element at index 2.
    const c = pair[2];
}

/*
    Tuple Types Cont'd

    We can also desctructure tuples using JavaScript's array destructuring.
*/

function doSomethingTupleTwo(stringHash: [string, number]) {
    const [inputString, hash] = stringHash;

    console.log(inputString);
    console.log(hash);
}

/*
    Tuple Types Cont'd

    Note:
    Tuple types are useful in heavily convention-based APIs, where each 
    element's meaning is "obvious". This gives us flexibility in whatever 
    we want to name our variables when we destructure them. In the above 
    example, we were able to name elements 0 and 1 to whatever we wanted. 

    However, since not ever user holds the same view of what's obvious, 
    it may be worth reconsidering whether using objects with descriptive 
    property names may be better for you API.


    Other than those length checks, simple tuple types like these equivalent 
    to types are versions of `Array`s that declare properties for specific 
    indexes, and that declare `length` with a numeric literal type. 
*/

interface StringNumberPairTwo {
    // specialized properties
    length: 2;
    0: string;
    1: number;

    // Other 'Array<string | number>' members...
    slice(start?: number, end?: number): Array<string | number>;
}

/*
    Tuple Types Cont'd

    Another thing you may be interested in is that tuples can have optional
    properties by writing out a question mark (? after an element's type).

    Optional tuple element can only come at the end, and also affect the type of 
    `length`.
*/

type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
    const [x, y, z] = coord;

    console.log(`Provided coordinates had ${coord.length} dimenstions`);
}

/*
    Tuple Types Cont'd

    Tuples can also have rest elements, which have to be an array/tuple type.

    Below:
    - StringNumberBooleans: Describes a tuple whose first two elements are `string` 
        and `number` respectively, but which may have any number of `boolean`s following.
    - StringBooleansNumber: Descrivbes a tuple whose first element is a `string` and 
        then any number of `boolean`s, and ending with a `number`.
    - BooleansStringNumber: Describes a tuple whose starting elements are any number of 
        `boolean`s, and ending with a `string` then a `number`.


    A tuple with a rest element has no set 'length' - it only has a set of well-known 
    elements in different positions.
*/

type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleanStringNumber = [...boolean[], string, number];

const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];

/*
    Tuple Types Cont'd

    Why might optional and and rest elements be useful? Well, it allows TypeScript 
    to correspond tuples with parameter lists. Tuples types can be used in 
    rest parameter and arguments, so that the following two below are basically equivalent.

    This is handy when you want to take a variable name of arguments with a rest parameter, 
    and you need a minimum number of elements, but you don't want to introduce immediate 
    variables.
*/

function readButtonInput(...args: [string, number, ...boolean[]]) {
    const [name, version, ...input] = args;

    // ...
}

function readButtonInputTwo(name: string, version: number, ...input: boolean[]) {
    // ...
}

/*
    readonly Tuple Types

    One final notes about tuple types - tuple types have `readonly` variants, 
    and can be specified by sticking a `readonly` modifier in front of them - 
    just like with array shorthand syntax.
*/

function doSomething(pair: readonly [string, number]) {
    // As you might expect, writing to any property of a `readonly` tuple isn't allowed in TypeScript
    // Error: Cannot assign to '0' because it is a read-only property.
    pair[0] = "hello!";
}

/*
    readonly Tuple Types Cont'd

    Tuples tend to be created and left un-modified in most code, so 
    annotating types as `readonly` tuples when possible is a good 
    default. This is also important given that array literals with `const`
    assertions will be inferred with `readonly` tuple type.

    Below, `distanceFromOrigin` never modifies its elements, but expects a 
    mutable tuple. Since `point` type was inferred as a `readonly [3, 4]`, 
    it won't be compatible with `[number, number`] since that type can't 
    guarantee `point` elements won't be mutated. 
*/

let point = [3, 4] as const;

function distanceFromOrigin([x, y]: readonly [number, number]) {
    return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);