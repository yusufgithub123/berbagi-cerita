import StoryItem from '../../components/story-item';
import { getFavoriteStories, removeFromFavorites } from '../../utils/idb-helper';
import { isOnline } from '../../utils/network-helper';

class FavoritesPage {
  constructor() {
    this._stories = [];
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Cerita Favorit</h2>
        ${!isOnline() ? `
          <div class="offline-notice">
            <i class="fas fa-wifi"></i> Anda sedang offline. Hanya menampilkan cerita tersimpan.
          </div>
        ` : ''}
        <div id="stories" class="stories">
          <div class="stories__placeholder">Memuat cerita favorit...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._storiesContainer = document.querySelector('#stories');
    await this._loadFavoriteStories();

    // Add event listeners for favorite buttons
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('favorite-btn')) {
        const storyId = event.target.dataset.id;
        await this._toggleFavorite(storyId);
      }
    });
  }

  async _loadFavoriteStories() {
    try {
      this.showLoading();

      const stories = await getFavoriteStories();

      if (stories && stories.length > 0) {
        this.showStories(stories);
      } else {
        this._storiesContainer.innerHTML = `
          <div class="story-item__not-found">
            <i class="fas fa-heart"></i> Belum ada cerita favorit
          </div>
        `;
      }
    } catch (error) {
      this.showError('Gagal memuat cerita favorit');
      console.error(error);
    }
  }

  showStories(stories) {
    this._stories = stories;
    this._storiesContainer.innerHTML = '';

    if (stories.length > 0) {
      stories.forEach((story) => {
        const storyElement = new StoryItem(story);
        const storyItemEl = storyElement.render();

        // Add unfavorite button
        const unfavoriteBtn = document.createElement('button');
        unfavoriteBtn.classList.add('favorite-btn', 'unfavorite');
        unfavoriteBtn.dataset.id = story.id;
        unfavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Hapus dari Favorit';

        storyItemEl.querySelector('.story-item__content').appendChild(unfavoriteBtn);
        this._storiesContainer.appendChild(storyItemEl);
      });
    } else {
      this._storiesContainer.innerHTML = `
        <div class="story-item__not-found">
          <i class="fas fa-heart"></i> Belum ada cerita favorit
        </div>
      `;
    }
  }

  async _toggleFavorite(storyId) {
    try {
      await removeFromFavorites(storyId);
      await this._loadFavoriteStories();

      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = 'Cerita dihapus dari favorit';
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error('Error removing favorite story:', error);
      alert('Gagal menghapus cerita dari favorit');
    }
  }

  showLoading() {
    this._storiesContainer.innerHTML = '<div class="stories__placeholder">Memuat...</div>';
  }

  showError(message) {
    this._storiesContainer.innerHTML = `
      <div class="stories__placeholder error">
        <i class="fas fa-exclamation-circle"></i> ${message}
      </div>
    `;
  }
}

export default FavoritesPage;
