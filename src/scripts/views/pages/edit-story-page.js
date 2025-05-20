import EditStoryPresenter from '../../presenter/edit-story-presenter';
import { initCamera, takePicture, stopCameraStream } from '../../utils/camera-helper';
import { initMap, setupMapClick } from '../../utils/map-helper';

class EditStoryPage {
  constructor() {
    this._presenter = new EditStoryPresenter(this);
    this._photoChanged = false;
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Edit Cerita</h2>
        <div class="form-container">
          <form id="editStoryForm">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="camera">Ambil Foto Baru (opsional)</label>
              <div class="camera-container">
                <video id="camera" autoplay></video>
                <button id="takePictureBtn" type="button">Ambil Foto</button>
                <canvas id="canvas" style="display:none;"></canvas>
              </div>
              <div class="preview-container">
                <p>Foto Saat Ini:</p>
                <img id="currentPhoto" alt="Foto saat ini">
                <p>Foto Baru (jika diubah):</p>
                <img id="photoPreview" alt="Preview foto" style="display:none;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="map">Pilih Lokasi (klik pada peta)</label>
              <div id="map" class="map-container"></div>
              <div class="location-info">
                <input type="hidden" id="lat" name="lat">
                <input type="hidden" id="lon" name="lon">
                <p id="locationText">Memuat lokasi...</p>
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" id="submitBtn">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const url = window.location.hash;
    const id = url.substring(url.lastIndexOf('/') + 1);
    this._storyId = id;
    
    await this._presenter.getStoryDetail(id);
    
    const videoElement = document.querySelector('#camera');
    const canvas = document.querySelector('#canvas');
    const takePictureButton = document.querySelector('#takePictureBtn');
    const photoPreview = document.querySelector('#photoPreview');
    
    this._cameraStream = await initCamera(videoElement);
    
    takePictureButton.addEventListener('click', async () => {
      const photoBlob = await takePicture(videoElement, canvas);
      this._photoBlob = photoBlob;
      this._photoChanged = true;

      const photoUrl = URL.createObjectURL(photoBlob);
      photoPreview.src = photoUrl;
      photoPreview.style.display = 'block';
    });
    
    const mapElement = document.querySelector('#map');
    this._map = initMap(mapElement);
    
    const form = document.querySelector('#editStoryForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.querySelector('#description').value;
      const lat = document.querySelector('#lat').value ? parseFloat(document.querySelector('#lat').value) : null;
      const lon = document.querySelector('#lon').value ? parseFloat(document.querySelector('#lon').value) : null;
      
      const formData = new FormData();
      formData.append('description', description);
      
      if (this._photoChanged && this._photoBlob) {
        formData.append('photo', this._photoBlob, 'photo.jpg');
      }
      
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }
      
      await this._presenter.updateStory(this._storyId, formData);
    });
  }
  
  showStoryDetail(story) {
     document.querySelector('#description').value = story.description;

    document.querySelector('#currentPhoto').src = story.photoUrl;

    if (story.lat && story.lon) {
      document.querySelector('#lat').value = story.lat;
      document.querySelector('#lon').value = story.lon;
      document.querySelector('#locationText').textContent = `Lokasi saat ini: Lat ${story.lat.toFixed(4)}, Lon ${story.lon.toFixed(4)}`;

      const marker = L.marker([story.lat, story.lon]).addTo(this._map);
      this._map.setView([story.lat, story.lon], 13);
      
       setupMapClick(this._map, (lat, lon) => {
        document.querySelector('#lat').value = lat;
        document.querySelector('#lon').value = lon;
        document.querySelector('#locationText').textContent = `Lokasi dipilih: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
      });
    } else {
      document.querySelector('#locationText').textContent = 'Cerita ini tidak memiliki lokasi';
      
      setupMapClick(this._map, (lat, lon) => {
        document.querySelector('#lat').value = lat;
        document.querySelector('#lon').value = lon;
        document.querySelector('#locationText').textContent = `Lokasi dipilih: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
      });
    }
  }
  
  showLoading() {
    document.querySelector('#submitBtn').textContent = 'Menyimpan...';
    document.querySelector('#submitBtn').disabled = true;
  }
  
  hideLoading() {
    document.querySelector('#submitBtn').textContent = 'Simpan Perubahan';
    document.querySelector('#submitBtn').disabled = false;
  }
  
  showSuccess(message) {
    alert(message);
    window.location.hash = '#/';
  }
  
  showError(message) {
    alert(`Error: ${message}`);
  }
  
   onLeave() {
    if (this._cameraStream) {
      stopCameraStream(this._cameraStream);
    }
  }
}

export default EditStoryPage;