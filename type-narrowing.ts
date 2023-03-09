export {};

const req1 = {url: "https://example.com", method: "GET"};

const handleRequest1 = (url: string, method: "GET" | "POST" => {
    console.log(`Request is being sent to ${url}`);
};

// Even though req.method is "GET", TypeScript assumes that object properties are always changing
// Therefore it will inference req.method as a type of 'string', instead of the literal word 'GET'
handleRequest1(req1.url, req1.method);

// In this case the word "GET" is being manually entered as the method argument
handleRequest1(req1.url, "GET");

interface Request {
    url: string,
    method: "GET" | "POST"
};

const req2: Request = {url: "https://example.com", method: "GET"};

// req2.method doesn't break because req2 was defined as type Request, and Request's method was defined as literals "GET" | "POST" and not type string
handleRequest1(req2.url, req2.method);

const handleRequest2 = (request: Request) => {
    console.log(`Request is being sent to ${request.url}`);
};

// While req1 has the same properties as the Request interface, req1 is not assigned to type Request
// And handleRequest2 requires that the argument passed in is of type Request interface
handleRequest2(req1);

// type Dog = {
//     numberOfLegs: number;
//     collar: {
//         name: string;
//         material: "leather" | "plastic"
//     };
// };

// type Cat = {
//     numberOfLegs: number;
//     microchip: {
//         id: string;
//         name: string;
//     };
// };

// type Pet = Dog | Cat;

// function numberOfLegs(pet: Pet): number {
//     return pet.numberOfLegs;
//     // This is fine as all pets share a common property
// }

// function getName(pet: Pet): string {
//     // If it's a dog, read the collar
//     // If it's a cat, read the microchip
//     // ^-- Figuring this out is type narrowing
// }

// // Approaches for Type Narrowing
// // How do we go about implementing the getName function?

// // Inline checks
// // To do an inline check here, we need to use the in operator
// // You cannot simply do if (pet.collar) because TypeScript wont let you read a property unless it knows it exists
// // Advantages: Quick to implement, cannot do it wrong, no need to change your existing data or types
// // Disadvantages: Slightly messy and noisy, not reusable, checks can get complex
// function getName(pet: Pet): string {
//     if ("collar" in pet) {
//         // TypeScript knows that pet is a Dog now
//         return pet.collar.name;
//     }

//     // TypeScript knows that i can only be a Cat now
//     return pet.microchip.name;
// }

// // Type Predicates
// // A type predicate is a specially-defined function that returns a boolean when a specified arg returns true
// // Advantages: no need to change existing data or types, encapsulates the logic of checking type away from using the type
// // Disadvantages: Requires multiple if/else blocks, when we use them it's not clear that Cat and Dog are disjoint, our checks can go wrong without us knowing
// function isCat(pet: Pet): pet is Cat {
//     return "microchip" in pet;
// }

// function isDog(pet: Pet): pet is Dog {
//     return "collar" in pet;
// }

// function getName(pet: Pet): string {
//     if (isDog(pet)) return pet.collar.name;
//     if (isCat(pet)) return pet.microchip.name;
// }

// // Disadvantage of Type Predicate: It can go wrong without us knowing, further explanation
// // First way this could fail is that we just make a mistake in our predicate
// // TypeScript will not warn us about this! 
// // Whenever we assert a type like this, we're telling the compiler that we know best and to trust us.
// // In this case where you mispelled "microchip", the trust is misplaced!
// // Mistakes with Type Predicates can happen even with correct spelling, but with incorrect case (case sensitivity!)
// // For example, if you type "microChip" and not "microchip" when checking for pet properties
// function isCat(pet: Pet): pet is Cat {
//     // Spelling mistake! - not cats ever!
//     return "mcirochip" in pet; 
// }

// // The second way that type predicates can go wring is evne more pernicious!
// // Let's say we now add another type of pet to our union
// type Hamster = {
//     microchip: {
//         id: string;
//         name: string;
//     };
// };

// type Pet = Dog | Cat | Hamster;

// Now, our type predicate for "is Cat" is wrong because cats don't know about the existence of hamsters.
// This is going to cause crashes at some point.
// How can we get the benefits of keeping our code clean, modeling our distinct types correctly, and making sure TS helps us with anything that changes?

// Discriminated Unions
// Add a property to each type that says what type it is
// That property is called a discriminant and its often called 'type' or 'kind' but that is merely a convention.
// There are cases where other names are more suitable
// In our pets example we're adding a discriminant called 'kind', and it looks like this
// Advantages: Our checks become dead simple, autocomplete hints, forced to model our domain more carefully
// Disadvantages: We need to change our types if we are applying this to existing code
// type Dog = {
//     kind: "dog";
//     numberOfLegs: number;
//     collar: {
//         name: string;
//         material: "leather" | "plastic";
//     };
// };

// type Cat = {
//     kind: "cat";
//     numberOfLegs: number;
//     microchip: {
//         id: string;
//         name: string;
//     };
// };

// type Pet = Dog | Cat;

// function getName(pet: Pet): string {
//     switch(pet.kind) {
//         case "dog": return pet.collar.name;
//         case "cat": return pet.microchip.name;
//     }
// }

// // Example: Let's imagine we're trying to encode shapes like cirles and squares
// // Circles keep track of their radiuses and squares keep track of their side lengths
// // We'll use a field called 'kind' to tell which shape we're dealing with
// interface Shape {
//     kind: "circle" | "square";
//     radius?: number;
//     sideLength?: number;
// };

// // Notice that we're using a unionof string literal types: "circle" and "square" to tell us whether we should treat the shape as a circle or square
// // By using "circle" | "square" instead of string, we can avoid misspelling issues
// const handleShape = (shape: Shape) => {
//     // oops!
//     if (shape.kind === "rect") {
//         // This considtion will always return 'false' since the types "circle" | "square" and "rect" have no overlap
//     }
// };

// // We can write a getArea function that applies to the right logic based on if it's dealing with a circle or square
// const getArea = (shape: Shape) => {
//     if (shape.kind === "circle") {
//         return Math.PI * shape.radius! ** 2;
//         // Object is possibly undefined
//     }
// };

// The problem with this encoding of Shape is that the type-checker doesn't have any way to know whether or not
// 'radius' or 'sideLength' are present based on the 'kind' property. We need to communicate what we know to the type checker.
// With that in mind, let's take another swing at defining shape

interface Circle {
    kind: "circle";
    radius: number;    
};

interface Square {
    kind: "square";
    sideLength: number;
};

type Shape = Circle | Square;

// Here we have properly separated Shape out into two types with different values for the 'kind' property
// But radius and sideLength are declared as required properties in their respective types

// const getArea = (shape: Shape) => {
//     return Math.PI * shape.radius ** 2;
//     // Property 'radius' does not exist on type 'Shape'
//     // Property 'radius' does not exist on type 'Square'
// };

// This is still an error. When radius was optional, we got an error (with strictNullChecks enabled) because TypeScript
// couldn't tell whether the property was present. Now that 'Shape' is a union, TypeScript is telling us that 'shape' might be a 
// 'Square', and 'Square's don't have 'radius' defined on them! Both interpretations are correct, but only the union encoding of Shape 
// will cause an error regardless of how strictNullChecks is configured
// But what if we tried checking the 'kind' property again?
const getArea = (shape: Shape) => {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
    }
};

// The same checking works with 'switch' statements as well. Now we can try to write ut complete
// getArea without any pesky ! non-null assertions
const getArea = (shape: Shape) => {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
    }
};


// The never Type
// When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have
// nothing left. In those cases, TypeScript will use a 'never' type to represent a state which shouldn't exist.

// Exhaustiveness Checking
// The 'never' type is assignable to every type; however, no type is assignable to 'never' (except 'never' itself).
// This means you can use narrowing and rely on 'never' turning up to do exhaustive checking in a switch statement.
// For example, adding a default to our 'getArea' function which tries to assign the shape to 'never' will raise 
// when every possible case has not been handled

type Shape = Circle | Square;

const getArea = (shape: Shape) => {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
};

// Adding a new member to the Shape union, will cause a TypeScript error
interface Triangle {
    kind: "triangle";
    sideLength: number;
};

type Shape = Circle | Square | Triangle;

const getArea = (shape: Shape) => {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            // Type 'Triangle' is not assignable to type 'never'
            return _exhaustiveCheck;
    }
};

// TypeScript's 'never' type is a type that contains no values. Because of this, you cannot assign
// any value to a variable with a never type
// Typically, you use the 'never' type to represent the return type of a function that always throws and error
// For example
function raiseError(message: string): never {
    throw new Error(message);
}

// The return type of the following function is inferred to the never type
function reject() {
    return raiseError('Rejected');
}

// If you have a function expression that contains and indefinite loop, its return type is also the 'never' type.
// For example, the type of the return type of forever() function is 'never'
let loop = function forever() {
    while (true) {
        console.log('Hello');
    }
}

// If you see that the return type of a function is 'never', then you should ensure that it is not what you intended to do
// Variables can also acquire the 'never' type when you narrow its type by a type guard that can never be true
// For example, without the 'never' type, the following function causes an error because not all code paths return a value
function fn(a: string | number): boolean {
    if (typeof a === "string") {
        return true;
    } else if (typeof a === "number") {
        return false;
    }
}

// To make the code valid, you can return a function whose return type is the 'never' type
function fn(a: string | number): boolean {
    if (typeof a === "string") {
        return true;
    } else if (typeof a === "string") {
        return false;
    }

    // make the function valid
    return neverOccur();
}

const neverOccur = () => {
    throw new Error('Never!');
};