import { Action, Dispatch, Middleware, MiddlewareAPI } from 'redux';

export type Listener = (action: Action) => void;

// tslint:disable-next-line:interface-over-type-literal
type ActionListenerContainer = {
  action: string;
  listener: Listener;
};

const _subscribedBefore: Listener[] = [];
const _subscribedAfter: Listener[] = [];
const _actionsSubscribedBefore: ActionListenerContainer[] = [];
const _actionsSubscribedAfter: ActionListenerContainer[] = [];

const _subscribe = (listener: Listener, listenerContainer: Listener[]) => {
  if (typeof listener !== 'function') {
    throw new Error('Expected the listener to be a function.');
  }
  listenerContainer.push(listener);
  return () => {
    const index = listenerContainer.indexOf(listener);
    listenerContainer.splice(index, 1);
  };
};

export const subscribeBefore = (listener: Listener) => {
  return _subscribe(listener, _subscribedBefore);
};

export const subscribeAfter = (listener: Listener) => {
  return _subscribe(listener, _subscribedAfter);
};

const _subscribeAction = (
  actionListenerContainer: ActionListenerContainer,
  listenerContainer: ActionListenerContainer[]
) => {
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

export const subscribeActionBefore = (action: string, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  _subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};

export const subscribeActionAfter = (action: string, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  _subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};

const _callListeners = (action: Action, listenerContainer: Listener[]) => {
  for (const listener of listenerContainer) {
    if (typeof action === 'object') {
      listener(action);
    }
  }
};

const _callActionListeners = (
  action: Action,
  listenerContainer: ActionListenerContainer[]
) => {
  for (const listener of listenerContainer) {
    if (typeof action === 'object' && listener.action === action.type) {
      listener.listener(action);
    }
  }
};

export const subscribeActionMiddleware: Middleware = (api: MiddlewareAPI) => (
  next: Dispatch
) => <A extends Action>(action: A) => {
  _callListeners(action, _subscribedBefore);
  _callActionListeners(action, _actionsSubscribedBefore);
  const result = next(action);
  _callListeners(action, _subscribedAfter);
  _callActionListeners(action, _actionsSubscribedAfter);
  return result;
};

export default subscribeActionMiddleware;
