class AppBar extends HTMLElement {
    constructor() {
      super();
      this._renderAppBar = this._renderAppBar.bind(this);
    }
  
    connectedCallback() {
      this._renderAppBar();
      this._attachEventListeners();
    }
  
    _renderAppBar() {
      const isLoggedIn = localStorage.getItem('token') !== null;
      
      this.innerHTML = `
        <div class="app-bar">
          <div class="app-bar__logo">
            <a href="#/">StoryShare</a>
          </div>
          <nav class="app-bar__nav">
            <a href="#/" aria-label="Halaman utama">
              <i class="fas fa-home" aria-hidden="true"></i> Beranda
            </a>
            ${isLoggedIn ? `
              <a href="#/add-story" aria-label="Tambah cerita baru">
                <i class="fas fa-plus" aria-hidden="true"></i> Tambah Cerita
              </a>
              <a href="#/saved-stories" aria-label="Cerita tersimpan">
                <i class="fas fa-bookmark" aria-hidden="true"></i> Tersimpan
              </a>
              <a href="#/favorites" aria-label="Cerita favorit">
                <i class="fas fa-heart" aria-hidden="true"></i> Favorit
              </a>
              <a href="#/notifications" aria-label="Notifikasi">
                <i class="fas fa-bell" aria-hidden="true"></i> Notifikasi
              </a>
              <a href="#" id="logoutButton" aria-label="Logout">
                <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
              </a>
            ` : `
              <a href="#/login" aria-label="Login">
                <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login
              </a>
              <a href="#/register" aria-label="Daftar">
                <i class="fas fa-user-plus" aria-hidden="true"></i> Daftar
              </a>
            `}
          </nav>
        </div>
      `;
    }
  
    _attachEventListeners() {
      const logoutButton = this.querySelector('#logoutButton');
      
      if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
          event.preventDefault();
          
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('name');
          
          alert('Berhasil logout');
          window.location.hash = '#/';
          this._renderAppBar();
        });
      }
    }
  }
  
  customElements.define('app-bar', AppBar);
  export default AppBar;