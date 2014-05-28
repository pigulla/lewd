# lewd
lewd is an intuitive and simple to use validation library. It is inspired by Python's [voluptuous](https://github.com/alecthomas/voluptuous), blame them for the silly name.

### Getting Started
Typically, your validations will look something like this:
```javascript
var addressValidator = lewd({
    name: String,
    street: String,
    zip: Number,
    city: String
});
```
Please take a look at our [wiki](https://github.com/pigulla/lewd/wiki) for a thorough introduction how to use lewd.

### Contributing
You found a bug, fixed a typo or came up with a cool new feature? Feel free to open issues or send pull requests and I'll merge them. Please make sure you add tests as needed and reference the issue number in your commit (please open one if necessary). Bonus points are awarded for not breaking any jshint rules.

### License
lewd is licensed under the BSD 2-Clause License. You can find it in the [LICENSE.md](LICENSE.md) file.
