import StoryApi from '../data/api-source';

class RegisterPresenter {
  constructor(view) {
    this._view = view;
  }
  
  async register(name, email, password) {
    try {
      this._view.showLoading();
      
      const response = await StoryApi.register(name, email, password);
      
      if (!response.error) {
        this._view.showSuccess('Registrasi berhasil. Silakan login.');
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      this._view.showError('Error saat registrasi');
      console.error(error);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default RegisterPresenter;