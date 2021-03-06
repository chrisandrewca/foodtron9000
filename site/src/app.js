import { matchLocation, onLocationChanged } from './utils/location';

const App = async () => {

  const pages = [
    { path: /^[/]$/, load: async () => (await import('./home')) },
    { path: /^[/]login$/, load: async () => (await import('./login')) },
    { path: /^[/]terms$/, load: async () => (await import('./terms')) },
    { path: /^[/]blog$/, load: async () => (await import('./blog')) },
    { path: /^[/]manage-product$/, load: async () => (await import('./manage-product')) },
    { path: /^[/]manage-profile$/, load: async () => (await import('./manage-profile')) },
    { path: /^[/]profile-product$/, load: async () => (await import('./profile-product')) },
    { path: /^[/][A-Za-z0-9-_~]+$/, load: async () => (await import('./profile')) } // warning: scheme used by profile.js
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