import StoryApi from '../data/api-source';
import { isOnline } from '../utils/network-helper';
import { getStory, saveStory, deleteStory as deleteStoryFromIdb } from '../utils/idb-helper';

class DetailPresenter {
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
      
      if (isOnline()) {
        // Online mode - fetch from API
        try {
          const response = await StoryApi.getDetailStory(token, id);
          
          if (!response.error) {
            // Save to IndexedDB
            await saveStory(response.story);
            this._view.showStoryDetail(response.story);
          } else {
            this._view.showError(response.message);
          }
        } catch (error) {
          throw error;
        }
      } else {
        // Offline mode - fetch from IndexedDB
        const story = await getStory(id);
        
        if (story) {
          this._view.showStoryDetail(story);
          this._view.showOfflineNotification(true);
        } else {
          this._view.showError('Cerita tidak tersedia dalam mode offline');
          this._view.showOfflineNotification(true);
        }
      }
    } catch (error) {
      this._view.showError('Error saat memuat detail cerita');
      console.error(error);
      
      // Try to get from indexed DB if API call fails
      try {
        const story = await getStory(id);
        
        if (story) {
          this._view.showStoryDetail(story);
          this._view.showOfflineNotification(true);
        }
      } catch (dbError) {
        console.error('Error accessing IndexedDB:', dbError);
      }
    }
  }
  
  async deleteStory(id) {
    try {
      this._view.showLoading();
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      if (isOnline()) {
        // Online mode - delete from API
        const response = await StoryApi.deleteStory(token, id);
        
        if (!response.error) {
          // Delete from IndexedDB
          await deleteStoryFromIdb(id);
          this._view.showSuccess('Cerita berhasil dihapus');
        } else {
          this._view.showError(response.message);
        }
      } else {
        // Cannot delete in offline mode
        this._view.showError('Tidak dapat menghapus cerita dalam mode offline');
        this._view.showOfflineNotification(true);
      }
    } catch (error) {
      this._view.showError('Error saat menghapus cerita');
      console.error(error);
    }
  }
}

export default DetailPresenter;