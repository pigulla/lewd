## 0.2.0 (2014-??-??)

Breaking changes:

 - `lewd.Array`'s behaviour changed from wrapping its arguments into `lewd.some` to `lewd.all`. So `[String, /^\d+$/]` now requires all elements to be strings *and* match the regular expression (instead of needing to only match either).

## 0.1.0 (2014-05-28)

Initial release
