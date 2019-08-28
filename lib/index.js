"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _subscribedBefore = [];
var _subscribedAfter = [];
var _actionsSubscribedBefore = [];
var _actionsSubscribedAfter = [];
var _subscribe = function (listener, listenerContainer) {
    if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
    }
    listenerContainer.push(listener);
    return function () {
        var index = listenerContainer.indexOf(listener);
        listenerContainer.splice(index, 1);
    };
};
exports.subscribeBefore = function (listener) {
    return _subscribe(listener, _subscribedBefore);
};
exports.subscribeAfter = function (listener) {
    return _subscribe(listener, _subscribedAfter);
};
var _subscribeAction = function (actionListenerContainer, listenerContainer) {
    if (!actionListenerContainer.action) {
        throw new Error('Expected the action to be a string.');
    }
    if (typeof actionListenerContainer.listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
    }
    listenerContainer.push(actionListenerContainer);
    return function () {
        var index = listenerContainer.indexOf(actionListenerContainer);
        listenerContainer.splice(index, 1);
    };
};
exports.subscribeActionBefore = function (action, listener) {
    var actionListenerContainer = { action: action, listener: listener };
    return _subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};
exports.subscribeActionAfter = function (action, listener) {
    var actionListenerContainer = { action: action, listener: listener };
    return _subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};
exports.unsubscribeBefore = function () {
    _subscribedBefore.length = 0;
};
exports.unsubscribeActionsBefore = function () {
    _actionsSubscribedBefore.length = 0;
};
exports.unsubscribeAfter = function () {
    _subscribedAfter.length = 0;
};
exports.unsubscribeActionsAfter = function () {
    _actionsSubscribedAfter.length = 0;
};
exports.unsubscribeAll = function () {
    exports.unsubscribeBefore();
    exports.unsubscribeActionsBefore();
    exports.unsubscribeAfter();
    exports.unsubscribeActionsAfter();
};
var _callListeners = function (action, listenerContainer) {
    for (var i = listenerContainer.length - 1; i >= 0; i--) {
        var listener = listenerContainer[i];
        if (typeof action === 'object') {
            listener(action);
        }
    }
};
var _callActionListeners = function (action, listenerContainer) {
    for (var i = listenerContainer.length - 1; i >= 0; i--) {
        var listener = listenerContainer[i];
        if (typeof action === 'object' && listener.action === action.type) {
            listener.listener(action);
        }
    }
};
exports.subscribeActionMiddleware = function (api) { return function (next) { return function (action) {
    _callListeners(action, _subscribedBefore);
    _callActionListeners(action, _actionsSubscribedBefore);
    var result = next(action);
    _callListeners(action, _subscribedAfter);
    _callActionListeners(action, _actionsSubscribedAfter);
    return result;
}; }; };
exports.default = exports.subscribeActionMiddleware;
