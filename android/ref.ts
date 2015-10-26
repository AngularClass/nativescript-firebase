const fireLibs = com.firebase.client;
const Firebase = com.firebase.client.Firebase;

class Ref {
  public _fireRef;
  constructor(ref: Firebase) {
    this._fireRef = ref;
  }
  
  private _setValues(method: string, value: any): Promise {
    return new Promise((resolve, reject) => {
      this._fireRef[method](
        value,
        new Firebase.CompletionListener({
          onComplete: (error, firebase) => {
            error ? reject(error.getMessage()) : resolve(firebase);
          }
        })
      );
    });
  }
  
  private _init(ref) {
    return new Ref(ref);
  }
  
  set(value: any): Promise {
    return this._setValues('setValue', value);
  }

  update(value: any): Promise {
    return this._setValues('updateChildren', value);
  }
  
  push() {
    return this._init(this._fireRef.push());
  }

  child(path: string) {
    return this._init(this._fireRef.child(path));
  }

  transaction(update): Promise {

  }
  
  private _onValue(event: string, cb, errCb) {
    const callbacks = {
      onCancelled: errCb,
      onDataChange(snapshot, extra) {
        snapshot.val = () => {
          return snapshot.getValue();
        };
        cb.call(null, snapshot, extra);
      }
    };
    const listener = new fireLibs.ValueEventListenr(callbacks)
    this._fireRef.addValueEventListener(listener);
    return listener;
  }
  
  private _onChildEvent(event: string, cb, errCb) {
    const eventMaps = {
      child_changed: 'onChildChanged',
      child_moved: 'onChildMoved',
      child_removed: 'onChildRemoved',
      child_added: 'onChildRemoved'
    };
    const callbacks = {
      onCancelled: errCb
    };
    
    callbacks[eventMaps[event]] = (snapshot, extra) => {
      snapshot.val = () => {
        return snapshot.getValue();
      };
      cb.call(null, snapshot, extra);
    };
    const listener = new fireLibs.ChildEventListener(callbacks)
    this._fireRef.addChildEventListener(listener);
    return listener;
  }
  
  on(event: string, cb, errCb) {
    const eventMaps = {
      'value': this._onValue,
      'child_added': this._onChildEvent,
      'child_moved': this._onChildEvent,
      'child_removed': this._onChildEvent,
      'child_changed': this._onChildEvent
    };
    eventMaps[event].call(this, event, cb, errCb);
  }
  
  off(listener) {
    this._fireRef.removeEventListener(listener);
  }
  
  once(event: string, cb, errCb) {
    this._fireRef.addListenerForSingleValueEvent(
      new fireLibs.ValueEventListener({
        onDataChange: cb,
        onCancelled: errCb
      })
    );
  }
  
}

export {Ref};
