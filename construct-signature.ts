interface PersonObject {
    name: string;
    age: number;
};

interface PersonConstructor {
    new (name: string, age: number): PersonObject;
};

class PersonClass implements PersonObject {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// Person is a constructor function of type PersonConstructor with value of PersonClass
// Basically, Person and PersonClass are the same thing, but I need a function of type PersonConstructor I can pass in to createPerson() 
const Person: PersonConstructor = PersonClass;

// Creating a person object by calling new Person() directly
const person1 = new Person('Denise', 28);
console.log(person1);

// This function creates a object instance of the class passed in
function createPerson(constructor: PersonConstructor) {
    return new constructor('Alex', 29)
}

// Creating a person object by calling createPerson and passing Person as the parameter
const person2 = createPerson(Person);
console.log(person2);