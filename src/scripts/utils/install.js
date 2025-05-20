let deferredPrompt;

export const initInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installContainer = document.createElement('div');
    installContainer.className = 'install-prompt';
    installContainer.innerHTML = `
      <div class="install-prompt__content">
        <p>Install StoryShare untuk pengalaman yang lebih baik</p>
        <div class="install-prompt__buttons">
          <button id="installButton">Install</button>
          <button id="dismissInstall">Nanti</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(installContainer);
    
    document.getElementById('installButton').addEventListener('click', () => {
      installContainer.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        } else {
          console.log('User dismissed install');
        }
        deferredPrompt = null;
      });
    });
    
    document.getElementById('dismissInstall').addEventListener('click', () => {
      installContainer.style.display = 'none';
    });
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    const installContainer = document.querySelector('.install-prompt');
    if (installContainer) {
      installContainer.style.display = 'none';
    }
  });
};

export const showInstallPrompt = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  }
};