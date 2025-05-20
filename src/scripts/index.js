import 'regenerator-runtime';
import '../styles/main.css';
import App from './views/app';
import { initViewTransition } from './utils/transition-helper';
import './utils/custom-elements';
import swRegister from './utils/sw-register';
import { initInstallPrompt } from './utils/install';

const app = new App({
  content: document.querySelector('#content'),
});

window.addEventListener('hashchange', () => {
  initViewTransition(() => app.renderPage());
});

window.addEventListener('load', () => {
  app.renderPage();
  swRegister();
  initInstallPrompt();
  
  // Check if app is running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.documentElement.classList.add('standalone');
  }
});