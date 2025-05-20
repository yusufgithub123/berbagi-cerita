import routes from '../routes/routes';
import { setupCustomTransition, setupAnimationAPI } from '../utils/transition-helper';
import { isOnline } from '../utils/network-helper';

class App {
  constructor({ content }) {
    this._content = content;
    this._initialAppShell();
    
    setupCustomTransition();
    setupAnimationAPI();
    
    // Check network status
    window.addEventListener('online', () => this._handleOnlineStatus());
    window.addEventListener('offline', () => this._handleOfflineStatus());
  }

  _initialAppShell() {
    // Cache app shell components
  }

  _handleOnlineStatus() {
    console.log('Online - Syncing data');
    document.documentElement.classList.remove('offline');
  }

  _handleOfflineStatus() {
    console.log('Offline - Using cached data');
    document.documentElement.classList.add('offline');
  }

  async renderPage() {
    let url = window.location.hash.slice(1);
   
    if (url === '') {
      url = '/';
    }
    
    let page;
    
    if (url.startsWith('/detail/')) {
      page = routes['/detail/:id'];
    } else if (url.startsWith('/edit-story/')) {
      page = routes['/edit-story/:id'];
    } else {
      page = routes[url] || routes['/'];
    }
    
    // Show offline warning if needed
    if (!isOnline() && !['/saved-stories', '/'].includes(url)) {
      alert('Anda sedang offline. Beberapa fitur mungkin tidak tersedia.');
    }
    
    if (this._currentPage && this._currentPage.onLeave) {
      this._currentPage.onLeave();
    }
    
    this._currentPage = new page();
    this._content.innerHTML = await this._currentPage.render();
    
    await this._currentPage.afterRender();
    window.scrollTo(0, 0);
  }
}

export default App;