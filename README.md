# lewd

lewd is an intuitive and simple to use validation library. It is inspired by Python's [voluptuous](https://github.com/alecthomas/voluptuous), blame them for the silly name.

#### What does it do?
It validates plain data, which typically comes from a call to `JSON.parse`. You can use it for other purposes but you need to be careful (see the following section).

The purpose of this library is to do syntactic validation, i.e. to determine whether some value *looks* right. If the validator finds something that smells funny, it will throw an exception and tell you what the problem was and where it occurred.

You can think of lewd as a less powerful but much more concise and simpler to use version of [json-schema](http://json-schema.org/).

#### What does it *not* do?
lewd is not meant to validate your data semantically, so non-local validations that require cross-referencing other parts of the input data are not supported. For instance, validations like "the value of property x must be larger than the value of property y" are beyond the scope of lewd.

Also, only primitive types, arrays and plain objects are validated. If you feed lewd anything else (for example date objects, regular expressions, or Objects with a non-empty prototype) it will probably behave unexpectedly or just break (although lewd tries its best to provide error messages that are actually helpful).


#### What does it look like?

Let's assume you want to make sure an object contains the properties `x` (which must be a number) and `y` (which must be an array of strings). With lewd you can simply write:
```javascript
var data = { x: 42, y: ['a', 42, 'b'] };
var validator = lewd({
    x: Number,
    y: [String]
});

// will throw an exception because 42 is not a string
validator(data);
```

You can also construct more complex validation structures. For instance, if you want to ensure a list only contains strings that start with "x" *or* booleans, you can do this:

```javascript
validator = lewd([lewd.all(String, /^x/), Boolean]);
```

## Installation
Simply install lewd like any other Node.JS module:

    npm install --save lewd
    
You can then simply require the module:

```javascript
var lewd = require('lewd');

var validator = lewd(Boolean);
validator(42); // fails because 42 is not a boolean value
```

## Getting Started
Validation is done in two steps. First, a condition is generated. Values can then be validated against that condition.

```javascript
var condition = lewd.Boolean();
condition(true);  // validates successfully
```

In the examples you will frequently see these two steps combined:
```javascript
lewd.Boolean()('not a boolean');  // validation will fail
```

#### Schemas and Conditions

The two most important concepts of lewd are _schemas_ and _conditions_.

A *condition* is a function that is used to validate input data. As a user of the lewd library you will usually never have to create (or invoke) conditions yourself. Instead, lewd provides a variety of *schemas* to do that for you.

A *schema* is a function that, when invoked, returns a condition. Whether such a function takes any arguments (and if so, what kind) varies from schema to schema.
For instance, `lewd.String` does not accept any arguments, `lewd.range` expects one parameter (a config object) and `lewd.some` can take any number of arguments.

#### Creating Conditions
A condition can be created in one of two ways. You can either use the schema function directly:

###### Using Schema Functions
You can create a condition by invoking its corresponding schema function:
```javascript
var condition = lewd.String();
```
A list of available schemas can be found in the corresponding section.


### Custom Error Messages
    
### Custom Conditions
```javascript
function (value:*[, path:Array.<string>]) throws ConditionViolationException
```

# Contributions
You found a bug, fixed a typo or implemented a cool new feature? Feel free to send pull requests and I'll merge them. Please make sure you add tets as needed and reference the issue number in your commit (please open one if necessary). Bonus points are awareded for not breaking any jshint rules.


# FAQ

##### Why not simply use node-validator?
[node-validator](https://github.com/chriso/validator.js) is a great library but it scratches a different itch. It only works with strings, which is great for URLs and query parameters but doesn't really help you validating the JSON payload of your run-of-the-mill AJAX request.

##### How can I do asynchronous validation?
You can't. lewd is meant to do syntactic validation of your data, which can practically always be done synchronously. Support of asynchronous conditions is something I would like to add at some point, but there are no concrete plans as of now.

##### Can conditions coerce values?
No, they can not - yet. This certainly is a useful feature and I am hoping to add it in one of the next releases. 

##### Can I use lewd in a browser environment?
No, lewd is currently only available as a Node.JS module. I'm not aware of any technical limitation that prevents it from running in a browser, I simply haven't gotten around to implementing it yet.
