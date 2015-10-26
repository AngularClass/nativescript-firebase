import {Ref} from './android/ref';
var app = require('application');

const $Firebase = com.firebase.client.Firebase;
$Firebase.setAndroidContext(app.android.context);

function Firebase(path) {
  return new Ref(new $Firebase(path));
}

export {Firebase};
