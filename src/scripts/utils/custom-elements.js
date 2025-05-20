class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <nav class="app-bar">
        <div class="app-bar__brand">
          <h1>StoryShare</h1>
        </div>
        <div class="app-bar__menu">
          <button id="hamburgerButton" aria-label="Toggle navigation">☰</button>
        </div>
        <div class="app-bar__navigation">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/add-story">Tambah Cerita</a></li>
            <li id="loginMenuItem"><a href="#/login">Login</a></li>
            <li id="logoutMenuItem" style="display:none;"><a href="#" id="logoutButton">Logout</a></li>
          </ul>
        </div>
      </nav>
    `;

    const hamburgerButton = this.querySelector('#hamburgerButton');
    const navigationMenu = this.querySelector('.app-bar__navigation');
    
    hamburgerButton.addEventListener('click', (event) => {
      navigationMenu.classList.toggle('open');
      event.stopPropagation();
    });

    const token = localStorage.getItem('token');
    const loginMenuItem = this.querySelector('#loginMenuItem');
    const logoutMenuItem = this.querySelector('#logoutMenuItem');
    
    if (token) {
      loginMenuItem.style.display = 'none';
      logoutMenuItem.style.display = 'block';
      
      const logoutButton = this.querySelector('#logoutButton');
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        window.location.hash = '#/login';
      });
    }
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="footer">
        <p>StoryShare &copy; 2025 - Aplikasi berbagi cerita dengan gambar dan lokasi</p>
      </div>
    `;
  }
}

class SkipContent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <a href="#content" class="skip-link">Langsung ke konten</a>
    `;
  }
}

class StoryItem extends HTMLElement {
constructor(story) {
  super();
  this._story = story;
}

render() {
  const userId = localStorage.getItem('userId');
  const isCurrentUserStory = this._story.userId === userId;
  
  const storyElement = document.createElement('div');
  storyElement.classList.add('story-item');
  
  storyElement.innerHTML = `
    <div class="story-item__content">
      <h3 class="story-item__title">${this._story.name}</h3>
      <p class="story-item__date">${new Date(this._story.createdAt).toLocaleDateString()}</p>
      <div class="story-item__thumbnail">
        <img class="story-item__image" src="${this._story.photoUrl}" alt="Foto cerita dari ${this._story.name}">
      </div>
      <p class="story-item__description">${this._story.description.substring(0, 100)}...</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <a href="#/detail/${this._story.id}" class="story-item__link">Baca selengkapnya</a>
        ${isCurrentUserStory ? `
          <div>
            <a href="#/edit-story/${this._story.id}" style="color: #28a745; margin-right: 0.5rem;">
              <i class="fa fa-edit"></i> Edit
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  return storyElement;
}
}

customElements.define('app-bar', AppBar);
customElements.define('app-footer', AppFooter);
customElements.define('skip-content', SkipContent);

export { StoryItem };