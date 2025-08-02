import store, { rootReducer } from './store';

describe('rootReducer', () => {
  it('возвращает начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const initialState = store.getState();

    const nextState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
});
