import AddStoryPresenter from '../../presenter/add-story-presenter';
import { initCamera, takePicture, stopCameraStream } from '../../utils/camera-helper';
import { initMap, setupMapClick } from '../../utils/map-helper';

class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter(this);
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Tambah Cerita Baru</h2>
        <div class="form-container">
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="camera">Ambil Foto</label>
              <div class="camera-container">
                <video id="camera" autoplay></video>
                <button id="takePictureBtn" type="button">Ambil Foto</button>
                <canvas id="canvas" style="display:none;"></canvas>
              </div>
              <div class="preview-container">
                <img id="photoPreview" alt="Preview foto" style="display:none;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="map">Pilih Lokasi (klik pada peta)</label>
              <div id="map" class="map-container"></div>
              <div class="location-info">
                <input type="hidden" id="lat" name="lat">
                <input type="hidden" id="lon" name="lon">
                <p id="locationText">Belum memilih lokasi</p>
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" id="submitBtn">Kirim Cerita</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
      const videoElement = document.querySelector('#camera');
    const canvas = document.querySelector('#canvas');
    const takePictureButton = document.querySelector('#takePictureBtn');
    const photoPreview = document.querySelector('#photoPreview');
    
    this._cameraStream = await initCamera(videoElement);
    
    takePictureButton.addEventListener('click', async () => {
      const photoBlob = await takePicture(videoElement, canvas);
      this._photoBlob = photoBlob;
      
       const photoUrl = URL.createObjectURL(photoBlob);
      photoPreview.src = photoUrl;
      photoPreview.style.display = 'block';
    });
    
    const mapElement = document.querySelector('#map');
    const latInput = document.querySelector('#lat');
    const lonInput = document.querySelector('#lon');
    const locationText = document.querySelector('#locationText');
    
    this._map = initMap(mapElement);
    
      setupMapClick(this._map, (lat, lon) => {
      latInput.value = lat;
      lonInput.value = lon;
      locationText.textContent = `Lokasi dipilih: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
    });
    
    const form = document.querySelector('#addStoryForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.querySelector('#description').value;
      const lat = latInput.value ? parseFloat(latInput.value) : null;
      const lon = lonInput.value ? parseFloat(lonInput.value) : null;
      
      if (!this._photoBlob) {
        alert('Silakan ambil foto terlebih dahulu');
        return;
      }
      
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', this._photoBlob, 'photo.jpg');
      
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }
      
      await this._presenter.addStory(formData);
    });
  }
  
  clearForm() {
    document.querySelector('#description').value = '';
    document.querySelector('#lat').value = '';
    document.querySelector('#lon').value = '';
    document.querySelector('#locationText').textContent = 'Belum memilih lokasi';
    document.querySelector('#photoPreview').style.display = 'none';
  }
  
  showLoading() {
    document.querySelector('#submitBtn').textContent = 'Mengirim...';
    document.querySelector('#submitBtn').disabled = true;
  }
  
  hideLoading() {
    document.querySelector('#submitBtn').textContent = 'Kirim Cerita';
    document.querySelector('#submitBtn').disabled = false;
  }
  
  showSuccess(message) {
    alert(message);
    this.clearForm();
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

export default AddStoryPage;