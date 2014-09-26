## 0.8.0-dev (2014-??-??)

##### New features:

 - Conditions can now be prevented from being modified by calling `lock()`.
 
##### Breaking changes:

 - Custom conditions must now call `this.isCoercionEnabled()` instead of accessing `this.coerce` directly.
 - `lewd.Object()` and `lewd.object(9` now accept all kinds of objects with the exception of the built-in types `RegExp`, `Date` and `Array` (fixes #3).

##### Bug Fixes:

 - `lewd.object()` now properly checks all enumerable properties (including those in the prototype chain). 

## 0.7.1 (2014-09-20)

##### New features:

 - Added condition wrapper for validator.js' `isFQDN` check. 

## 0.7.0 (2014-09-19)

##### New features:

 - Object properties can now be marked in bulk as required or optional with `allRequired()` and `allOptional`, respectively.
 
##### Breaking changes:

 - A violation's `path` and `pathStr` properties are now using a JSON Pointer-esque syntax.
 
##### Bug fixes:

 - Fixed incorrect paths for failed key validations.

## 0.6.0 (2014-08-22)

##### New features:

 - Experimental browser support.
 - Added `lewd.version` property.

## 0.5.1 (2014-07-11)

 - Cleanup release, no code changes.

## 0.5.0 (2014-07-11)

##### New features:

 - Conditions can be named via `as` and then retrieved via `find` and `get`.
 - Object properties can explicitly be disallowed with `.forbidden()`.

## 0.4.0 (2014-06-06)

###### Breaking changes:

 - `lewd.integer` no longer coerces strings.
 
###### New features:

 - Check for distinct values in an array with `lewd.unique`.
 - Added condition wrappers for validator.js' `isCreditCard`, `isEmail`, `isIP`, `isISBN`, `isURL`, and `isUUID` checks. 
 
###### Improvements:

 - Support for an even more concise notation for all parameterless conditions.
 - Better error handling when using conditions with incorrect parameters.
 
###### Bug fixes:

 - Fixed coercion not working correctly for arrays.

## 0.3.0 (2014-06-03)

###### Breaking changes:

 - The Number validator no longer accepts `NaN` or `Infinity` (as those never were valid JSON data types anyway).

###### New features:

 - Coercion support added via `lewd.coerce(condition)` or `condition.coerce()` for `Boolean`, `String`, `integer` and `isoDateTime` conditions.
 - Object properties can now have default values, specified via `condition.default(value)`.

###### Improvements:

 - Major refactoring of the way conditions are implemented. The public API didn't change but the inner workings are now much cleaner and more easily extensible.

## 0.2.0 (2014-05-30)

###### Breaking changes:

 - `lewd.Array`'s behaviour changed from wrapping its arguments into `lewd.some` to `lewd.all`. So `[String, /^\d+$/]` now requires all elements to be strings *and* match the regular expression (instead of needing to only match either).
 - `lewd.object` no longer accepts `required` and `optional` config options, use `lewd.required()` and `lewd.optional()` instead.
 
###### New features:

 - Custom conditions can now be inlined more easily.
 - New option for validating objects: set `removeExtra` to silently remove invalid and unexpected keys.

###### Changes:

 - In preparation to coercion support conditions now return the validated value (so `lewd(Number)(42) === 42`).

###### Improvements:

 - The `range` and `len` conditions have more fine-grained error messages.
 - Better schema validation for `range` and `len`.

## 0.1.0 (2014-05-28)

Initial release
