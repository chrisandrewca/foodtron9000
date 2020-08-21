import { matchLocation, onLocationChanged } from './utils/location';

const App = async () => {

  const pages = [
    { path: /^[/]$/, load: async () => (await import('./home')) },
    { path: /^[/]manage-product$/, load: async () => (await import('./manage-product')) },
    { path: /^[/]profile$/, load: async () => (await import('./profile')) },
    { path: /^[/]profile-product$/, load: async () => (await import('./profile-product')) }
    // TODO /chris - requires safe names
  ];

  const renderPage = async () => {
    const location = matchLocation(pages);
    const component = await location.page.load();
    await component.loadState();
    await component.loadEffect();
  };

  // TODO unsubscribe? check chrome event logger
  // but I think this is just one time, could use beforeUnload
  onLocationChanged(async () => {
    renderPage();
  });

  await renderPage(); // initial page load
};

export default App;

if (import.meta.hot) {
  import.meta.hot.accept();
}