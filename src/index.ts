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
  return _subscribeAction(actionListenerContainer, _actionsSubscribedBefore);
};

export const subscribeActionAfter = (action: string, listener: Listener) => {
  const actionListenerContainer = { action, listener };
  return _subscribeAction(actionListenerContainer, _actionsSubscribedAfter);
};

export const unsubscribeBefore = () => {
  _subscribedBefore.length = 0;
};

export const unsubscribeActionsBefore = () => {
  _actionsSubscribedBefore.length = 0;
};

export const unsubscribeAfter = () => {
  _subscribedAfter.length = 0;
};

export const unsubscribeActionsAfter = () => {
  _actionsSubscribedAfter.length = 0;
};

export const unsubscribeAll = () => {
  unsubscribeBefore();
  unsubscribeActionsBefore();
  unsubscribeAfter();
  unsubscribeActionsAfter();
};

const _unsubscribeAction = (listenerContainer: ActionListenerContainer[], filterAction: string) => {
  const filteredListenerContainer = listenerContainer.filter(({ action })  => action !== filterAction)
  listenerContainer.length = 0
  listenerContainer.concat(filteredListenerContainer)
}

export const unsubscribeActionBefore = (action: string) => {
  _unsubscribeAction(_actionsSubscribedBefore, action);
};

export const unsubscribeActionAfter = (action: string) => {
  _unsubscribeAction(_actionsSubscribedAfter, action);
};

export const unsubscribeActionAll = (action: string) => {
  unsubscribeActionBefore(action);
  unsubscribeActionAfter(action);
};

const _callListeners = (action: Action, listenerContainer: Listener[]) => {
  for (let i = listenerContainer.length - 1; i >= 0; i--) {
    const listener = listenerContainer[i]
    if (typeof action === 'object') {
      listener(action);
    }
  }
};

const _callActionListeners = (
  action: Action,
  listenerContainer: ActionListenerContainer[]
) => {
  for (let i = listenerContainer.length - 1; i >= 0; i--) {
    const listener = listenerContainer[i]
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
