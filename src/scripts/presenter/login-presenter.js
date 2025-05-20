import StoryApi from '../data/api-source';
import { registerServiceWorker, requestNotificationPermission, subscribeUserToPush } from '../utils/notification-helper';

class LoginPresenter {
  constructor(view) {
    this._view = view;
  }
  
  async login(email, password) {
    try {
      this._view.showLoading();
      
      const response = await StoryApi.login(email, password);
      
      if (!response.error) {
        // Save login data to localStorage
        localStorage.setItem('token', response.loginResult.token);
        localStorage.setItem('userId', response.loginResult.userId);
        localStorage.setItem('name', response.loginResult.name);
        
        // Register for notifications
        try {
          const swRegistration = await registerServiceWorker();
          const notificationPermission = await requestNotificationPermission();
          
          if (notificationPermission && swRegistration) {
            await subscribeUserToPush(swRegistration);
          }
        } catch (notificationError) {
          console.error('Error setting up notifications:', notificationError);
        }
        
        this._view.showSuccess('Login berhasil');
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat login');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default LoginPresenter;