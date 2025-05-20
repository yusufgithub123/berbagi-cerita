import StoryApi from '../data/api-source';
import { isOnline } from '../utils/network-helper';
import {
  getStories,
  saveStory,
  deleteStory as deleteStoryFromIdb,
  getSavedStories,
} from '../utils/idb-helper';
const API_ENDPOINT = 'https://story-api.dicoding.dev/v1';

class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async getStories() {
    try {
      this._view.showLoading();

      if (isOnline()) {
        try {
          const token = localStorage.getItem('token');

          if (!token) {
            window.location.hash = '#/login';
            return;
          }

          const response = await StoryApi.getAllStories(token, 1, 15, 1);

          if (!response.error) {
            // Sync with IndexedDB
            const oldStories = await getStories();

            if (oldStories && oldStories.length > 0) {
              await Promise.all(
                oldStories.map((story) => {
                  // Revoke blob URL jika ada
                  if (story.photoUrl && story.photoUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(story.photoUrl);
                  }
                  return deleteStoryFromIdb(story.id);
                })
              );
            }

            // Save new stories dengan validasi URL gambar
            const stories = response.listStory;

            await Promise.all(
              stories.map((story) => {
                if (
                  story.photoUrl &&
                  !story.photoUrl.startsWith('http') &&
                  !story.photoUrl.startsWith('blob:')
                ) {
                  story.photoUrl = `${CONFIG.API_ENDPOINT}/${story.photoUrl}`;
                }
                return saveStory(story);
              })
            );

            this._view.showStories(stories);
          } else {
            // Fallback: load dari IndexedDB
            const stories = await getStories();
            if (stories && stories.length > 0) {
              this._view.showStories(stories);
              this._view.showOfflineNotification(true);
            } else {
              this._view.showError(response.message);
            }
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          const stories = await getStories();
          if (stories && stories.length > 0) {
            this._view.showStories(stories);
            this._view.showOfflineNotification(true);
          } else {
            this._view.showError('Gagal memuat cerita. Coba lagi nanti.');
          }
        }
      } else {
        // Offline mode
        const stories = await getStories();

        if (stories && stories.length > 0) {
          this._view.showStories(stories);
          this._view.showOfflineNotification(true);
        } else {
          this._view.showError('Tidak ada cerita tersimpan. Harap sambungkan ke internet.');
          this._view.showOfflineNotification(true);
        }
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      this._view.showError('Error saat memuat cerita');

      try {
        const stories = await getStories();
        if (stories && stories.length > 0) {
          this._view.showStories(stories);
          this._view.showOfflineNotification(true);
        }
      } catch (dbError) {
        console.error('IndexedDB Error:', dbError);
      }
    }
  }
}

export default HomePresenter;
