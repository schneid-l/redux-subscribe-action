"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _subscribedBefore = [];
const _subscribedAfter = [];
const _actionsSubscribedBefore = [];
const _actionsSubscribedAfter = [];
const _subscribe = (listener, listenerContainer) => {
    if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
    }
    listenerContainer.push(listener);
    return () => {
        const index = listenerContainer.indexOf(listener);
        listenerContainer.splice(index, 1);
    };
};
exports.subscribeBefore = (listener) => {
    return _subscribe(listener, _subscribedBefore);
};
exports.subscribeAfter = (listener) => {
    return _subscribe(listener, _subscribedAfter);
};
const _subscribeAction = (actionListenerContainer, listenerContainer) => {
    if (!actionListenerContainer.action) {
        throw new Error('Expected the action to be a string.');
    }
    if (typeof actionListenerContainer.listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
    }
    listenerContainer.push(actionListenerContainer);
    return () => {
        const index = listenerContainer.indexOf(actionListenerContainer);
        listenerContainer.splice(index, 1);
    };
};
exports.subscribeActionBefore = (action, listener) => {
    const actionListenerContainer = { action, listener };
    return _subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};
exports.subscribeActionAfter = (action, listener) => {
    const actionListenerContainer = { action, listener };
    return _subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};
exports.unsubscribeBefore = () => {
    _subscribedBefore.length = 0;
};
exports.unsubscribeActionsBefore = () => {
    _actionsSubscribedBefore.length = 0;
};
exports.unsubscribeAfter = () => {
    _subscribedAfter.length = 0;
};
exports.unsubscribeActionsAfter = () => {
    _actionsSubscribedAfter.length = 0;
};
exports.unsubscribeAll = () => {
    exports.unsubscribeBefore();
    exports.unsubscribeActionsBefore();
    exports.unsubscribeAfter();
    exports.unsubscribeActionsAfter();
};
const _unsubscribeAction = (listenerContainer, filterAction) => {
    const filteredListenerContainer = listenerContainer.filter(({ action }) => action !== filterAction);
    listenerContainer.length = 0;
    listenerContainer.concat(filteredListenerContainer);
};
exports.unsubscribeActionBefore = (action) => {
    _unsubscribeAction(_actionsSubscribedBefore, action);
};
exports.unsubscribeActionAfter = (action) => {
    _unsubscribeAction(_actionsSubscribedAfter, action);
};
exports.unsubscribeActionAll = (action) => {
    exports.unsubscribeActionBefore(action);
    exports.unsubscribeActionAfter(action);
};
const _callListeners = (action, listenerContainer) => {
    for (let i = listenerContainer.length - 1; i >= 0; i--) {
        const listener = listenerContainer[i];
        if (typeof action === 'object') {
            listener(action);
        }
    }
};
const _callActionListeners = (action, listenerContainer) => {
    for (let i = listenerContainer.length - 1; i >= 0; i--) {
        const listener = listenerContainer[i];
        if (typeof action === 'object' && listener.action === action.type) {
            listener.listener(action);
        }
    }
};
exports.subscribeActionMiddleware = (api) => (next) => (action) => {
    _callListeners(action, _subscribedBefore);
    _callActionListeners(action, _actionsSubscribedBefore);
    const result = next(action);
    _callListeners(action, _subscribedAfter);
    _callActionListeners(action, _actionsSubscribedAfter);
    return result;
};
exports.default = exports.subscribeActionMiddleware;
