var fireLibs = com.firebase.client;
var Firebase = com.firebase.client.Firebase;
var Ref = (function () {
    function Ref(ref) {
        this._fireRef = ref;
    }
    Ref.prototype._setValues = function (method, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._fireRef[method](value, new Firebase.CompletionListener({
                onComplete: function (error, firebase) {
                    error ? reject(error.getMessage()) : resolve(firebase);
                }
            }));
        });
    };
    Ref.prototype._init = function (ref) {
        return new Ref(ref);
    };
    Ref.prototype.set = function (value) {
        return this._setValues('setValue', value);
    };
    Ref.prototype.update = function (value) {
        return this._setValues('updateChildren', value);
    };
    Ref.prototype.push = function () {
        return this._init(this._fireRef.push());
    };
    Ref.prototype.child = function (path) {
        return this._init(this._fireRef.child(path));
    };
    Ref.prototype.transaction = function (update) {
    };
    Ref.prototype._onValue = function (event, cb, errCb) {
        var callbacks = {
            onCancelled: errCb,
            onDataChange: function (snapshot, extra) {
                snapshot.val = function () {
                    return snapshot.getValue();
                };
                cb.call(null, snapshot, extra);
            }
        };
        var listener = new fireLibs.ValueEventListenr(callbacks);
        this._fireRef.addValueEventListener(listener);
        return listener;
    };
    Ref.prototype._onChildEvent = function (event, cb, errCb) {
        var eventMaps = {
            child_changed: 'onChildChanged',
            child_moved: 'onChildMoved',
            child_removed: 'onChildRemoved',
            child_added: 'onChildRemoved'
        };
        var callbacks = {
            onCancelled: errCb
        };
        callbacks[eventMaps[event]] = function (snapshot, extra) {
            snapshot.val = function () {
                return snapshot.getValue();
            };
            cb.call(null, snapshot, extra);
        };
        var listener = new fireLibs.ChildEventListener(callbacks);
        this._fireRef.addChildEventListener(listener);
        return listener;
    };
    Ref.prototype.on = function (event, cb, errCb) {
        var eventMaps = {
            'value': this._onValue,
            'child_added': this._onChildEvent,
            'child_moved': this._onChildEvent,
            'child_removed': this._onChildEvent,
            'child_changed': this._onChildEvent
        };
        eventMaps[event].call(this, event, cb, errCb);
    };
    Ref.prototype.off = function (listener) {
        this._fireRef.removeEventListener(listener);
    };
    Ref.prototype.once = function (event, cb, errCb) {
        this._fireRef.addListenerForSingleValueEvent(new fireLibs.ValueEventListener({
            onDataChange: cb,
            onCancelled: errCb
        }));
    };
    return Ref;
})();
exports.Ref = Ref;
