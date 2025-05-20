import StoryApi from '../data/api-source';

class EditStoryPresenter {
  constructor(view) {
    this._view = view;
  }
  
  async getStoryDetail(id) {
    try {
      this._view.showLoading();
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      const response = await StoryApi.getDetailStory(token, id);
      
      if (!response.error) {
        this._view.showStoryDetail(response.story);
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat memuat detail cerita');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
  
  async updateStory(id, formData) {
    try {
      this._view.showLoading();
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      const response = await StoryApi.updateStory(token, id, formData);
      
      if (!response.error) {
        this._view.showSuccess('Cerita berhasil diperbarui');
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat memperbarui cerita');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default EditStoryPresenter;