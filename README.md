# lewd

lewd is an intuitive and simple to use validation library. It is inspired by Python's [voluptuous](https://github.com/alecthomas/voluptuous), blame them for the silly name.

#### What does it do?
It validates plain data, which typically comes from a call to `JSON.parse`. You can use it for other purposes but you need to be careful (see the following section).

The purpose of this library is to do syntactic validation, i.e. to determine whether some value *looks* right. If the validator finds something that smells funny, it will throw an exception and tell you what the problem was and where it occurred.

You can think of lewd as a less powerful but much more concise and simpler to use version of [json-schema](http://json-schema.org/).

#### What does it *not* do?
lewd is not meant to validate your data semantically, so non-local validations that require cross-referencing other parts of the input data are not supported. For instance, validations like "the value of property x must be larger than the value of property y" are beyond the scope of lewd.

Also, we only validate primitive types, arrays and plain objects. If you feed lewd anything else (for example date objects, regular expressions, or Objects with a non-empty prototype) it will probably behave unexpectedly or just break (although we do try to throw error messages that are actually helpful).


##### Examples

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
Validation is done in two steps. First, a condition is generated. That scheme can then be used to validate values against.

```javascript
var condition = lewd.Boolean();
conditoin(true);  // validates successfully
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

###### Using lewd()
For a number of conditions you can avoid using schemas explicitly and simply invoke the overloaded `lewd` function directly. This allows for a slightly more concise syntax:

```javascript
lewd(String); // lewd.String()
lewd(Number); // lewd.Number()
```


#### Combined and Nested Conditions

#### Shortcut Notations


## Condition Factories

### Type Conditions

#### lewd.Array
Ensure that a value is an array.

```javascript
lewd.Array()([1, 2, 3]);  // validates successfully
lewd.Array()(42);         // throws a ConditionViolationException
```    

#### lewd.Boolean
Ensure that a value is of type `boolean`.

```javascript
lewd.Boolean()(true);  // validates successfully
lewd.Boolean()(42);    // throws a ConditionViolationException
```

#### lewd.null
Ensure that a value is `null`.

```javascript
lewd.null()(null);  // validates successfully
lewd.null()('');    // throws a ConditionViolationException
```

#### lewd.Number
Ensure that a value is of type `number`.

```javascript
lewd.Number()(42.13);  // validates successfully
lewd.Number()('42);    // throws a ConditionViolationException
```

#### lewd.Object
Ensure that a value is of type `object`.

```javascript
lewd.Object()({});    // validates successfully
lewd.Object()(null);  // throws a ConditionViolationException
```
    
Keep in mind that this condition only accepts plain JavaScript objects, i.e. objects created via the `Object` constructor (as is the case with objects created from deserialized JSON data).


#### lewd.String
Ensure that a value is of type `string`.

```javascript
lewd.String()('hello');  // validates successfully
lewd.String()(42);       // throws a ConditionViolationException
```
    
#### lewd.undefined
An "accept anything" condition that never refutes a value.

```javascript
lewd.undefined()('hey');  // validates successfully
lewd.undefined()(null);   // validates successfully
```

This condition is useful if you want to want to make sure an object has a specific key but don't care about its value:

```javascript
lewd({ myKey: undefined });
```

### Content Conditions

#### lewd.regex
Ensures that a value matches a given regular expression.
 
```javascript
lewd.regex(/^[A-Z]/)('Hello?');  // validates successfully
lewd.regex(/^[A-Z]/)('hello!');  // throws a ConditionViolationException
```
     
Remember that any value validated by the regex condition will automatically be cast to a string. Thus, it only makes sense to be used on strings and numbers.

#### lewd.range
Ensures that a value is within a certain numeric range.

```javascript
lewd.range({ max: 8 })
```

Available options are:

  - `min` (number): the minimum allowed value (defaults to `0`)
  - `max` (number): the maximum allowed value
  - `minInclusive` (boolean): if `false`, do not allow the `min` value itself (defaults to `true`)
  - `maxInclusive` (boolean): if `false`, do not allow the `max` value itself (defaults to `true`)

Remember that the range condition will be evaluated using the `>` and `<` operators. Thus, it only makes sense to be used on numbers and strings.

#### lewd.len
Ensures the minimum or maximum length of a value. The checked value must be of type `string` or `array`.

```javascript
lewd.len({ min: 0, minInclusive: false })('x');  // validates successfully
lewd.len({ min: 0, minInclusive: false })('');   // throws a ConditionViolationException
```
    
Available options are:

  - `min` (number): the minimum allowed value (defaults to `0`)
  - `max` (number): the maximum allowed value
  - `minInclusive` (boolean): if `false`, do not allow the `min` value itself (defaults to `true`)
  - `maxInclusive` (boolean): if `false`, do not allow the `max` value itself (defaults to `true`)
  
#### lewd.dict
Ensures that the value is an object with the specified keys and values.

Available options are:

  - `allowExtra` (boolean): if `true` the value may contain keys that are not explicitly defined 
  - `byDefault` (string): can be either `required` or `optional` (defaults to `required`)
  - `optional` (string[]): list of keys that are optional (if `byDefault` is set to `required`)
  - `required` (string[]): list of keys that are required (if `byDefault` is set to `optional`)
  - `keys` (mixed): a condition each (not explicitly defined) key must satisfy
  - `values` (mixed): a condition each (not explicitly defined) value must satisfy

Instead of the `keys` and `values` option the shortcut notation `$k` and `$v` can be used within the specification itself.
For instance, if you want to specify an object that only accepts lowercase alphanumeric keys, the following are equivalent:

```javascript
lewd.dict({}, { keys: /^[a-z]+$/ });
lewd.dict({ $k: /^[a-z]+$/ });
```
    
Remember that setting if either the `keys` or `values` option (or their shortcut counterparts) are used, the `allowExtra` option automatically defaults to `true` (instead if `false`).

#### lewd.set
#### lewd.isoDateTime
#### lewd.literal

### Custom Error Messages
    
### Custom Conditions
```javascript
function (value:*[, path:Array.<string>]) throws ConditionViolationException
```


# FAQ

##### Why not simply use node-validator?
[node-validator](https://github.com/chriso/validator.js) is a great library but it scratches a different itch. It only works with strings, which is great for URLs and query parameters but doesn't really help you validating the JSON payload of your run-of-the-mill AJAX request.

##### How can I do asynchronous validation?
You can't. lewd is meant to do syntactic validation of your data, which can practically always be done synchronously. Support of asynchronous conditions is something we would like to support at some point, but there are no concrete plans as of now.

##### Can conditions coerce values?
No, they can not. Yet. This certainly is a useful feature and we are hoping to add it in one of the next releases. 

##### Can I use lewd in a browser environment?
No, lewd is currently only available as a Node.JS module. We are not aware of any technical limitation that prevents it from running in a browser, we simply haven't gotten around to implementing it yet.
