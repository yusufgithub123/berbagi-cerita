import LoginPresenter from '../../presenter/login-presenter';

class LoginPage {
  constructor() {
    this._presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Login</h2>
        <div class="form-container">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
              <button type="submit" id="submitBtn">Login</button>
            </div>
            
            <p class="form-info">
              Belum punya akun? <a href="#/register">Daftar di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#loginForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      
      await this._presenter.login(email, password);
    });
  }
  
  showLoading() {
    document.querySelector('#submitBtn').textContent = 'Loading...';
    document.querySelector('#submitBtn').disabled = true;
  }
  
  hideLoading() {
    document.querySelector('#submitBtn').textContent = 'Login';
    document.querySelector('#submitBtn').disabled = false;
  }
  
  showSuccess(message) {
    alert(message);
    window.location.hash = '#/';
  }
  
  showError(message) {
    alert(`Error: ${message}`);
  }
}

export default LoginPage;