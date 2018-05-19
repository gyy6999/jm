"use strict";

(function () {
    var JM = function JM() {
        if (!(this instanceof JM)) return new JM();
        var s = this;
        s.Tab = function () {};
    };

    window.JM = new JM();
})();