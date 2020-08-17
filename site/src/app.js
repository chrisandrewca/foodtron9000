import { matchLocation, onLocationChanged } from './utils/location';
import { update } from './utils/render';

const App = async () => {

  const pages = [
    { path: /^[/]$/, load: async () => (await import('./home')).default },
    { path: /^[/]product$/, load: async () => (await import('./product')).default }
  ];

  const renderPage = async () => {
    const location = matchLocation(pages);
    const content = await location.page.load();
    update(content());
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