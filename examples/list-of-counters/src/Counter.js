// @flow

import React from 'react';
import type {Dispatch} from './dispatch';
import view from './view';

// MODEL
export type Model = number;

const init = (count: number = 0): Model => count;

// UPDATE
export type Action
  = { type: 'Increment' }
  | { type: 'Decrement' }
;

const update = (model: Model, action: Action): Model => {
  switch (action.type) {
  case 'Increment': return model + 1;
  case 'Decrement': return model - 1;
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

// VIEW
const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
};

type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

export const View: Class<React$Component<void, Props, void>> = view(({ model, dispatch }: Props) => (
  <div>
    <button onClick={() => dispatch({ type: 'Decrement' })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => dispatch({ type: 'Increment' })}>+</button>
  </div>
));

export default { init, update };
