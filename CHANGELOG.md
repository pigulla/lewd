## 0.2.0 (2014-??-??)

###### Breaking changes:

 - `lewd.Array`'s behaviour changed from wrapping its arguments into `lewd.some` to `lewd.all`. So `[String, /^\d+$/]` now requires all elements to be strings *and* match the regular expression (instead of needing to only match either).
 - `lewd.object` no longer accepts `required` and `optional` config options, use `lewd.required()` and `lewd.optional()` instead.
 
###### New features:

 - Custom conditions can now be inlined more easily
 - New option for validating objects: set `removeExtra` to silently remove invalid and unexpected keys.

###### Changes:

 - In preparation to coercion support conditions now return the validated value (so `lewd(Number)(42) === 42`).

###### Improvements:

 - The `range` and `len` conditions have more fine-grained error messages.
 - Better schema validation for `range` and `len`.

## 0.1.0 (2014-05-28)

Initial release
