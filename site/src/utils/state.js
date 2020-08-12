export const setState = (update) => {

  if (typeof setState.state === 'undefined') {
    setState.state = {};
  }

  setState.state = update(setState.state);
  return setState.state;
};