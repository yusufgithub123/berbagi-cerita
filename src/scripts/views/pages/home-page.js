import StoryItem from '../../components/story-item';
import HomePresenter from '../../presenter/home-presenter';
import { initMap, addMarkers } from '../../utils/map-helper';

class HomePage {
  constructor() {
    this._stories = [];
    this._presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Cerita Terbaru</h2>
        <div id="stories" class="stories">
          <div class="stories__placeholder">Loading...</div>
        </div>
        <div id="map" class="map-container" aria-label="Peta lokasi cerita" tabindex="0"></div>
      </section>
    `;
  }

  async afterRender() {
    this._storiesContainer = document.querySelector('#stories');
    this._mapContainer = document.querySelector('#map');
    
    this._map = initMap(this._mapContainer);
    
    await this._presenter.getStories();
  }

  showStories(stories) {
    this._stories = stories;
    this._storiesContainer.innerHTML = '';
    
    if (stories.length > 0) {
      stories.forEach((story) => {
        try {
          const storyElement = new StoryItem(story);
          this._storiesContainer.appendChild(storyElement);
        } catch (error) {
          console.error('Error rendering story:', error);
        }
      });

      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon,
      );

      if (storiesWithLocation.length > 0) {
        addMarkers(this._map, storiesWithLocation);
      }
    } else {
      this._storiesContainer.innerHTML = '<div class="story-item__not-found">Tidak ada cerita yang ditemukan</div>';
    }
  }

  showLoading() {
    this._storiesContainer.innerHTML = '<div class="stories__placeholder">Loading...</div>';
  }

  showError(message) {
    this._storiesContainer.innerHTML = `<div class="stories__placeholder error">${message}</div>`;
  }

  showOfflineNotification(show) {
    if (show) {
      alert('Anda sedang offline. Menampilkan cerita dari penyimpanan lokal.');
    }
  }
}

export default HomePage;
