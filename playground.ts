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