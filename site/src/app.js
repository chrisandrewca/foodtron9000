import { matchLocation, onLocationChanged } from './utils/location';
import { update } from './utils/render';

const App = async () => {

  const pages = [
    { path: /^[/]$/, load: async () => (await import('./home')).default },
    { path: /^[/]manage-product$/, load: async () => (await import('./manage-product')).default },
    { path: /^[/]profile$/, load: async () => (await import('./profile')).default }
  ];

  const renderPage = async () => {
    const location = matchLocation(pages);
    const content = await location.page.load();
    await update(content());
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