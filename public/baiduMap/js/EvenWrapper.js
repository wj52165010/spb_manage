 var BMapLib = window.BMapLib || {};

 BMapLib.EventWrapper = window.BMapLib.EventWrapper || {};
 (function(){

 BMapLib.EventWrapper.addDomListener = function(instance, eventName, handler) {
     if (instance.addEventListener) {
         instance.addEventListener(eventName, handler, false);
     }
     else if (instance.attachEvent) {
         instance.attachEvent('on' + eventName, handler);
     }
     else {
         instance['on' + eventName] = handler;
     }
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.DOM_EVENT);
 };

BMapLib.EventWrapper.addDomListenerOnce = function(instance, eventName, handler) {
     var eventListener = EventWrapper['addDomListener'](instance, eventName, function(){
         // 移除
         EventWrapper['removeListener'](eventListener);
         return handler.apply(this, arguments);
     });
     return eventListener;
 };

 BMapLib.EventWrapper.addListener = function(instance, eventName, handler) {
     instance.addEventListener(eventName, handler);
     return new MapsEventListener(instance, eventName, handler, MapsEventListener.MAP_EVENT);
 };

 BMapLib.EventWrapper.addListenerOnce = function(instance, eventName, handler){
     var eventListener = EventWrapper['addListener'](instance, eventName, function(){
         // 移除
        EventWrapper['removeListener'](eventListener);
         return handler.apply(this, arguments);
     });
     return eventListener;
 };

 BMapLib.EventWrapper.clearInstanceListeners = function(instance) {
     var listeners = instance._e_ || {};
     for (var i in listeners) {
         EventWrapper['removeListener'](listeners[i]);
     }
    instance._e_ = {};
 };

BMapLib.EventWrapper.clearListeners = function(instance, eventName) {
     var listeners = instance._e_ || {};
     for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
             EventWrapper['removeListener'](listeners[i]);
         }
    }
 };

BMapLib.EventWrapper.removeListener = function(listener) {
    var instance = listener._instance;
    var eventName = listener._eventName;
    var handler = listener._handler;
     var listeners = instance._e_ || {};
     for (var i in listeners) {
         if (listeners[i]._guid == listener._guid) {
            if (listener._eventType == MapsEventListener.DOM_EVENT) {
                 // DOM事件
                if (instance.removeEventListener) {
                     instance.removeEventListener(eventName, handler, false);
                 }
                else if (instance.detachEvent) {
                   instance.detachEvent('on' + eventName, handler);
                }
                else {
                   instance['on' + eventName] = null;
                }
            }
            else if (listener._eventType == MapsEventListener.MAP_EVENT) {
                // 地图事件
               instance.removeEventListener(eventName, handler);
           }
            delete listeners[i];
       }
    }
 };

BMapLib.EventWrapper.trigger = function(instance, eventName) {
     var listeners = instance._e_ || {};
     for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            var args = Array.prototype.slice.call(arguments, 2);
             listeners[i]._handler.apply(instance, args);
       }
    }
};

function MapsEventListener(instance, eventName, handler, eventType){
    this._instance = instance;
     this._eventName = eventName;
    this._handler = handler;
    this._eventType = eventType;
     this._guid = MapsEventListener._guid ++;
    this._instance._e_ = this._instance._e_ || {};
    this._instance._e_[this._guid] = this;
}
MapsEventListener._guid = 1;

 MapsEventListener.DOM_EVENT = 1;
MapsEventListener.MAP_EVENT = 2;
 })();