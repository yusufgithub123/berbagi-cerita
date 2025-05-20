import StoryApi from '../data/api-source';

class AddStoryPresenter {
  constructor(view) {
    this._view = view;
  }
  
  async addStory(formData) {
    try {
      this._view.showLoading();
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      const response = await StoryApi.addNewStory(token, formData);
      
      if (!response.error) {
        this._view.showSuccess('Cerita berhasil ditambahkan');
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat menambahkan cerita');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default AddStoryPresenter;