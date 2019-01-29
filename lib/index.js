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
    _subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};
exports.subscribeActionAfter = function (action, listener) {
    var actionListenerContainer = { action: action, listener: listener };
    _subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};
var _callListeners = function (action, listenerContainer) {
    for (var _i = 0, listenerContainer_1 = listenerContainer; _i < listenerContainer_1.length; _i++) {
        var listener = listenerContainer_1[_i];
        if (typeof action === 'object') {
            listener(action);
        }
    }
};
var _callActionListeners = function (action, listenerContainer) {
    for (var _i = 0, listenerContainer_2 = listenerContainer; _i < listenerContainer_2.length; _i++) {
        var listener = listenerContainer_2[_i];
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
