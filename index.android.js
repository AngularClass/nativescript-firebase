var ref_1 = require('./android/ref');
var app = require('application');
var $Firebase = com.firebase.client.Firebase;
$Firebase.setAndroidContext(app.android.context);
function Firebase(path) {
    return new ref_1.Ref(new $Firebase(path));
}
exports.Firebase = Firebase;
