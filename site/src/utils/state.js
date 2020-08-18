export const setState = (updateState) => {

  if (typeof setState.state === 'undefined') {
    setState.state = {};
  }

  setState.state = updateState(setState.state);
  return setState.state;
};