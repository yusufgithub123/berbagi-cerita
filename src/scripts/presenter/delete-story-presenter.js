import StoryApi from '../data/api-source';

class DeleteStoryPresenter {
  constructor(view) {
    this._view = view;
  }
  
  async deleteStory(id) {
    try {
      this._view.showLoading();
      

      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      const response = await StoryApi.deleteStory(token, id);
      
      if (!response.error) {
        this._view.showSuccess('Cerita berhasil dihapus');
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat menghapus cerita');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default DeleteStoryPresenter;