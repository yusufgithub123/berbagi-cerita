import StoryItem from '../../components/story-item';
import { getSavedStories, removeSavedStory } from '../../utils/idb-helper';
import { isOnline } from '../../utils/network-helper';

class SavedStoriesPage {
  constructor() {
    this._stories = [];
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Cerita Tersimpan</h2>
        ${!isOnline() ? `
          <div class="offline-notice">
            <i class="fas fa-wifi"></i> Anda sedang offline. Hanya menampilkan cerita tersimpan.
          </div>
        ` : ''}
        <div id="stories" class="stories">
          <div class="stories__placeholder">Memuat cerita tersimpan...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._storiesContainer = document.querySelector('#stories');
    await this._loadSavedStories();
    
    // Add event listeners for save/unsave buttons
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('save-story-btn')) {
        const storyId = event.target.dataset.id;
        await this._toggleSaveStory(storyId);
      }
    });
  }

  async _loadSavedStories() {
    try {
      this.showLoading();
      
      const stories = await getSavedStories();
      
      if (stories && stories.length > 0) {
        this.showStories(stories);
      } else {
        this._storiesContainer.innerHTML = `
          <div class="story-item__not-found">
            <i class="fas fa-bookmark"></i> Belum ada cerita yang disimpan
          </div>
        `;
      }
    } catch (error) {
      this.showError('Gagal memuat cerita tersimpan');
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
        
        // Add unsave button
        const unsaveBtn = document.createElement('button');
        unsaveBtn.classList.add('save-story-btn', 'unsave');
        unsaveBtn.dataset.id = story.id;
        unsaveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Hapus dari Tersimpan';
        
        storyItemEl.querySelector('.story-item__content').appendChild(unsaveBtn);
        this._storiesContainer.appendChild(storyItemEl);
      });
    } else {
      this._storiesContainer.innerHTML = `
        <div class="story-item__not-found">
          <i class="fas fa-bookmark"></i> Belum ada cerita yang disimpan
        </div>
      `;
    }
  }
  
  async _toggleSaveStory(storyId) {
    try {
      await removeSavedStory(storyId);
      await this._loadSavedStories();
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = 'Cerita dihapus dari tersimpan';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error('Error removing saved story:', error);
      alert('Gagal menghapus cerita dari tersimpan');
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

export default SavedStoriesPage;