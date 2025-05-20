import DetailPresenter from '../../presenter/detail-presenter';
import { initMap } from '../../utils/map-helper';
import StoryApi from '../../data/api-source';
const API_ENDPOINT = 'https://story-api.dicoding.dev/v1';

class DetailPage {
  constructor() {
    this._presenter = new DetailPresenter(this);
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Detail Cerita</h2>
        <div id="storyDetail" class="story-detail">
          <div class="story-detail__placeholder">Loading...</div>
        </div>
        <div id="map" class="map-container" aria-label="Lokasi cerita" tabindex="0"></div>
      </section>
    `;
  }

  async afterRender() {
    this._storyDetailContainer = document.querySelector('#storyDetail');
    this._mapContainer = document.querySelector('#map');

    const url = window.location.hash;
    const id = url.substring(url.lastIndexOf('/') + 1);

    await this._presenter.getStoryDetail(id);
  }

  showStoryDetail(story) {
    const userId = localStorage.getItem('userId');
    const isCurrentUserStory = story.userId === userId;

    // Pastikan URL gambar valid
    let photoUrl = story.photoUrl;
    if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('blob:')) {
      photoUrl = `${API_ENDPOINT}/${photoUrl}`;
    }

    this._storyDetailContainer.innerHTML = `
      <div class="story-detail__content">
        <h3 class="story-detail__title">${story.name}</h3>
        <p class="story-detail__date">${new Date(story.createdAt).toLocaleDateString()}</p>

        ${isCurrentUserStory ? `
          <div class="story-detail__actions" style="margin-bottom: 1rem;">
            <a href="#/edit-story/${story.id}" class="form-group button" style="display: inline-block; background-color: #28a745; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; margin-right: 1rem;">
              <i class="fa fa-edit"></i> Edit Cerita
            </a>
            <button id="deleteStoryBtn" class="form-group button" style="background-color: #dc3545; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer;">
              <i class="fa fa-trash"></i> Hapus Cerita
            </button>
          </div>
        ` : ''}

        <div class="story-detail__image-container">
          <img class="story-detail__image" src="${photoUrl}" alt="Foto cerita dari ${story.name}" loading="lazy">
        </div>
        <p class="story-detail__description">${story.description}</p>
        ${story.lat && story.lon ? `
          <p class="story-detail__location">
            <i class="fa fa-map-marker" aria-hidden="true"></i> 
            Lokasi: Lat ${story.lat.toFixed(4)}, Lon ${story.lon.toFixed(4)}
          </p>
        ` : '<p class="story-detail__location">Tidak ada informasi lokasi</p>'}
      </div>
    `;

    if (isCurrentUserStory) {
      const deleteButton = document.querySelector('#deleteStoryBtn');
      deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Anda yakin ingin menghapus cerita ini?');
        if (confirmDelete) {
          this._deleteStory(story.id);
        }
      });
    }

    if (story.lat && story.lon) {
      const map = initMap(this._mapContainer);
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      map.setView([story.lat, story.lon], 13);

      marker.bindPopup(`
        <div class="map-popup">
          <h3>${story.name}</h3>
          <p>${story.description.substring(0, 100)}...</p>
        </div>
      `).openPopup();
    } else {
      this._mapContainer.innerHTML = '<div class="map-placeholder">Tidak ada informasi lokasi</div>';
    }
  }

  async _deleteStory(id) {
    try {
      this.showLoading();

      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }

      const response = await StoryApi.deleteStory(token, id);

      if (!response.error) {
        alert('Cerita berhasil dihapus');
        window.location.hash = '#/';
      } else {
        this.showError(response.message);
      }
    } catch (error) {
      this.showError('Error saat menghapus cerita');
      console.error(error);
    }
  }

  showLoading() {
    this._storyDetailContainer.innerHTML = '<div class="story-detail__placeholder">Loading...</div>';
  }

  showError(message) {
    this._storyDetailContainer.innerHTML = `<div class="story-detail__placeholder error">${message}</div>`;
  }
}

export default DetailPage;
