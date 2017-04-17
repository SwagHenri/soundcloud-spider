module.exports = {
    sleep: function(s, callback) {
        console.log("Sleep " + s + "s");

        setTimeout(callback, s*1000);
    },

    usleep: function(s) {
        var e = new Date().getTime() + (s / 1000);

        while (new Date().getTime() <= e) {
            ;
        }
    }
};
