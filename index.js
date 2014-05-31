var util = require('util');

var lewd = require('./src/lewd'),
    utils = require('./src/utils');

//try {
    var condition = lewd.object({
        s: String,
        b: lewd.optional(Boolean)
    }, { byDefault: 'required' })({ s: 'hello' });
//    condition.because('yo!')({ $k: 'foo', abc: true });
//} catch (e) {
//    console.warn(e.name + ': ' + e.message);
//    console.dir(e);
//}
