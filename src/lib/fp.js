var curry = (function(){
    function _curry() {
        let func = arguments[0]
        let base_args = Array.prototype.slice.call(arguments, 1);
        return function () {
            let real_args = base_args.map((i) => {
                switch (i) {
                    case _curry.args_this: return this;
                    case _curry.args[0]: return arguments[0];
                    case _curry.args[1]: return arguments[1];
                    case _curry.args[2]: return arguments[2];
                    case _curry.args[3]: return arguments[3];
                    case _curry.args[4]: return arguments[4];
                    case _curry.args[5]: return arguments[5];
                    case _curry.args[6]: return arguments[6];
                    case _curry.args[7]: return arguments[7];
                    case _curry.args[8]: return arguments[8];
                    case _curry.args[9]: return arguments[9];
                    default: return i
                }
            })
            return func.apply(this, real_args)
        }
    }
    _curry.args_this = {}
    _curry.args = []
    for (let i = 0; i < 10; i = i + 1) {
        _curry.args[i] = {}
    }
    return _curry
})()

exports.curry = curry