import RegisterPresenter from '../../presenter/register-presenter';

class RegisterPage {
  constructor() {
    this._presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <section class="content">
        <h2 class="content__heading">Daftar Akun</h2>
        <div class="form-container">
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password (min. 8 karakter)</label>
              <input type="password" id="password" name="password" minlength="8" required>
            </div>
            
            <div class="form-group">
              <button type="submit" id="submitBtn">Daftar</button>
            </div>
            
            <p class="form-info">
              Sudah punya akun? <a href="#/login">Login di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#registerForm');
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      
      await this._presenter.register(name, email, password);
    });
  }
  
  showLoading() {
    document.querySelector('#submitBtn').textContent = 'Loading...';
    document.querySelector('#submitBtn').disabled = true;
  }
  
  hideLoading() {
    document.querySelector('#submitBtn').textContent = 'Daftar';
    document.querySelector('#submitBtn').disabled = false;
  }
  
  showSuccess(message) {
    alert(message);
    window.location.hash = '#/login';
  }
  
  showError(message) {
    alert(`Error: ${message}`);
  }
}

export default RegisterPage;