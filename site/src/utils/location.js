export const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

export const matchLocation = (pages) => {

  const { hash, pathname } = window.location;

  for (const page of pages) {
    const { path: regex } = page;
    if (regex.exec(pathname)) {
      return { hash, page, pathname };
    }
  }
};

export const onLocationChanged = (handler) => {

  window.addEventListener('setLocation', async (e) => {
    await handler(e);
  });

  window.onpopstate = (e) => {
    dispatchSetLocation({
      state: e.state,
      title: 'TODO TITLE',
      path: e.currentTarget.location.pathname
    });
  };
};

export const replaceLocation = (path) => {

  const state = {};
  // TODO not needed? ignored less safari? what does that look like?
  const title = 'TODO TITLE';
  window.history.replaceState(state, title, path);
  dispatchSetLocation({ state, title, path });
};

export const setLocation = (path) => {

  const state = {};
  // TODO not needed? ignored less safari? what does that look like?
  const title = 'TODO TITLE';
  window.history.pushState(state, title, path);
  dispatchSetLocation({ state, title, path });
};

const dispatchSetLocation = ({ state, title, path }) => {

  window.dispatchEvent(new CustomEvent('setLocation', { state, title, path }));
};