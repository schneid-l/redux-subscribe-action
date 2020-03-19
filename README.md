# redux-subscribe-action
Subscribe to dispatched [redux](https://redux.js.org/) actions

The motivation was to handle dispatched actions to dispatch other thanks to [redux-thunk](https://github.com/reduxjs/redux-thunk).

# Installation

To install `redux-subscribe-action`, run the following command:

```
npm install --save redux-subscribe-action
```

Or if you are using yarn:

```
yarn add redux-subscribe-action
```

# Setup with redux

To enable `redux-subscribe-action`, use `applyMiddleware()`:

```js
import { createStore, applyMiddleware } from 'redux';
import subscribeActionMiddleware from 'redux-subscribe-action';
import rootReducer from './reducers';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(subscribeActionMiddleware)
);
```

# Usage

## `subscribeBefore(listener)`

Adds a listener. It will be called every time an action is dispatched before the state changed.

It takes a callback as argument and returns a function that unsubscribe the listener.
The dispatched action is given to the callback.

__Example:__

```js
import { subscribeBefore } from 'redux-subscribe-action';

const unsubscribe = subscribeBefore((action) => console.log(`Before state change action ${action.type}`));

//...

unsubscribe();
```

## `subscribeAfter(listener)`

Adds a listener. It will be called every time an action is dispatched after the state changed.

It takes a callback as argument and returns a function that unsubscribe the listener.
The dispatched action is given to the callback.

__Example:__

```js
import { subscribeAfter } from 'redux-subscribe-action';

const unsubscribe = subscribeAfter((action) => console.log(`Before state change action ${action.type}`));

//...

unsubscribe();
```

## `subscribeActionBefore(action, listener)`

Adds a listener. It will be called when the given action is dispatched before the state changed.

It takes an action type and a callback as arguments and returns a function that unsubscribe the listener.
The dispatched action is given to the callback.

__Example:__

```js
import { subscribeActionBefore } from 'redux-subscribe-action';

const unsubscribe = subscribeActionBefore('MY_ACTION_TYPE', (action) => console.log(`Before state change action MY_ACTION_TYPE`));
// action.type === 'MY_ACTION_TYPE'

//...

unsubscribe();
```

## `subscribeActionAfter(action, listener)`

Adds a listener. It will be called when the given action is dispatched after the state changed.

It takes an action type and a callback as arguments and returns a function that unsubscribe the listener.
The dispatched action is given to the callback.

__Example:__

```js
import { subscribeActionAfter } from 'redux-subscribe-action';

const unsubscribe = subscribeActionAfter('MY_ACTION_TYPE', (action) => console.log(`After state change action MY_ACTION_TYPE`));
// action.type === 'MY_ACTION_TYPE'

//...

unsubscribe();
```

## Typescript `listener` type

Listener type is defined with TypeScript as `Listener`.

```ts
type Listener = (action: Action) => void;
```

*With `Action` as redux Action type (`import { Action } from 'redux'`).*

__Example:__

```ts
import { Listener } from 'redux-subscribe-action';
import { Action } from 'redux';

const myListener: Listener = (action: Action) => {
    //...
}
```

## unsubscripe methods

The package exposes following unsubscribe methods:

* `unsubscribeBefore()`: unsubscribe all general before listeners
* `unsubscribeActionsBefore()`: unsubscribe all before action listeners
* `unsubscribeAfter()`: unsubscribe all general after listeners
* `unsubscribeActionsAfter()`: unsubscribe all after action listeners
* `unsubscribeAll()`: unsubscribe from every listener

* `unsubscribeActionBefore(action: string)`: unsubscribe all before listeners corresponding to the passed action
* `unsubscribeActionAfter(action: string)`: unsubscribe all after listeners corresponding to the passed action
* `unsubscribeAction(action: string)`: unsubscribe all listeners corresponding to the passed action

# License

[MIT](https://github.com/si0ls/redux-subscribe-action/blob/master/LICENSE)
