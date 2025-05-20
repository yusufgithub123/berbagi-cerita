class AppFooter extends HTMLElement {
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.innerHTML = `
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} StoryShare. Dibuat dengan <i class="fas fa-heart" aria-hidden="true"></i> dan ☕</p>
          <div class="footer__socials">
            <a href="https://github.com" target="_blank" aria-label="GitHub">
              <i class="fab fa-github" aria-hidden="true"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://twitter.com" target="_blank" aria-label="Twitter">
              <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('app-footer', AppFooter);
  export default AppFooter;