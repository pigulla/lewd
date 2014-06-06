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
