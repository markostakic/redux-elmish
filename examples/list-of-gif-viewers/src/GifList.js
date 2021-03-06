// @flow

import React from 'react';
import type {Dispatch, Effect, PureView} from 'redux-elmish';
import {view, Effects, forwardTo, assertNever} from 'redux-elmish';
import _unzip from 'lodash.unzip';

import type {Model as GifModel, Action as GifAction} from './Gif';
import Gif, {View as GifView} from './Gif';

// MODEL
export type Model = {
  topic: string,
  gifs: IndexedGif[],
  uid: number
};

type IndexedGif = {
  id: number,
  model: GifModel
};

export const init = (): [Model, Effect<Action>] => {
  return [
    {
      topic: '',
      gifs: [],
      uid: 0
    },
    Effects.none()
  ];
}

// UPDATE
export type Action
  = { type: 'Topic', topic: string }
  | { type: 'Create' }
  | { type: 'Modify', id: number, gifAction: GifAction }
;

const updateHelp = (id: number, action: GifAction) => {
  return (gif: IndexedGif): [IndexedGif, Effect<Action>] => {
    if (gif.id !== id) {
      return [gif, Effects.none()];
    }

    const [newGif, gifFx] = Gif.update(gif.model, action);
    return [
      { id, model: newGif },
      Effects.map(gifFx, gifAction => ({ type: 'Modify', id, gifAction }))
    ];
  }
}

export const update = (model: Model, action: Action): [Model, Effect<Action>] => {
  switch(action.type) {
  case 'Topic': return [
    { ...model, topic: action.topic },
    Effects.none()
  ];
  case 'Create': {
    const id = model.uid;
    const [newGif, gifFx] = Gif.init(model.topic);
    return [
      {
        ...model,
        topic: '',
        gifs: [...model.gifs, { model: newGif, id }],
        uid: id + 1
      },
      Effects.map(gifFx, gifAction => ({ type: 'Modify', id, gifAction }))
    ];
  }
  case 'Modify': {
    const [newGifs, gifFxs] = _unzip(model.gifs.map(updateHelp(action.id, action.gifAction)));
    return [
      { ...model, gifs: newGifs },
      Effects.batch(gifFxs)
    ]
  }
  default: return assertNever(action.type);
  }
}

// VIEW
const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

type Props = {
  model: Model,
  dispatch: Dispatch<Action>
};

const GifItem = ({id, model, dispatch}) => (
  <GifView
    model={model}
    dispatch={forwardTo(dispatch, gifAction => ({ type: 'Modify', id, gifAction }))}
  />
);

export const View: PureView<Props> = view(({ model, dispatch }) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={model.topic}
      onKeyDown={({keyCode}) => keyCode === 13 && dispatch({ type: 'Create' })}
      onChange={({target}) => dispatch({ type: 'Topic', topic: target.value })}
      style={inputStyle}
    />
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      {model.gifs.map(gif => <GifItem key={gif.id} id={gif.id} model={gif.model} dispatch={dispatch} />)}
    </div>
  </div>
));

export default { init, update };
