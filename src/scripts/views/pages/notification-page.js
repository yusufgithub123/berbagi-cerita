import { registerServiceWorker, requestNotificationPermission, subscribeUserToPush, unsubscribeFromPush } from '../../utils/notification-helper';

class NotificationPage {
  constructor() {
    this._serviceWorkerRegistration = null;
    this._isSubscribed = false;
  }

  async render() {
    return `
    
      <section class="content">
        <h2 class="content__heading">Notifikasi</h2>
        <div class="notification-container">
          <div class="notification-info">
            <p>Aktifkan notifikasi untuk mendapatkan info cerita baru secara langsung!</p>
          </div>
          <div class="form-group">
            <button id="notificationToggleBtn" class="button">Memuat...</button>
          </div>
          <div id="notificationStatus" class="notification-status"></div>
        </div>
      </section>
      
    `;
  }

  async afterRender() {
    const notificationToggleBtn = document.querySelector('#notificationToggleBtn');
    const notificationStatus = document.querySelector('#notificationStatus');
    
    // Check if notification is supported
    if (!('Notification' in window)) {
      notificationToggleBtn.textContent = 'Notifikasi tidak didukung di browser ini';
      notificationToggleBtn.disabled = true;
      notificationStatus.textContent = 'Browser Anda tidak mendukung notifikasi push';
      notificationStatus.classList.add('error');
      return;
    }
    
    // Register service worker
    this._serviceWorkerRegistration = await registerServiceWorker();
    
    if (!this._serviceWorkerRegistration) {
      notificationToggleBtn.textContent = 'Service Worker gagal diregistrasi';
      notificationToggleBtn.disabled = true;
      notificationStatus.textContent = 'Service Worker tidak dapat diregistrasi';
      notificationStatus.classList.add('error');
      return;
    }
    
    // Check subscription status
    this._checkSubscriptionStatus();
    
    notificationToggleBtn.addEventListener('click', async () => {
      notificationToggleBtn.disabled = true;
      
      if (this._isSubscribed) {
        await this._unsubscribeFromPushNotification();
      } else {
        await this._subscribeToPushNotification();
      }
      
      notificationToggleBtn.disabled = false;
    });
  }
  
  async _checkSubscriptionStatus() {
    const notificationToggleBtn = document.querySelector('#notificationToggleBtn');
    const notificationStatus = document.querySelector('#notificationStatus');
    
    try {
      const subscription = await this._serviceWorkerRegistration.pushManager.getSubscription();
      this._isSubscribed = !!subscription;
      
      if (this._isSubscribed) {
        notificationToggleBtn.textContent = 'Nonaktifkan Notifikasi';
        notificationStatus.textContent = 'Notifikasi aktif';
        notificationStatus.classList.remove('error');
        notificationStatus.classList.add('success');
      } else {
        notificationToggleBtn.textContent = 'Aktifkan Notifikasi';
        notificationStatus.textContent = 'Notifikasi tidak aktif';
        notificationStatus.classList.remove('success');
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      notificationToggleBtn.textContent = 'Error: Periksa konsol';
      notificationStatus.textContent = 'Terjadi kesalahan';
      notificationStatus.classList.add('error');
    }
  }
  
  async _subscribeToPushNotification() {
    const notificationStatus = document.querySelector('#notificationStatus');
    
    try {
      // Request notification permission
      const permissionGranted = await requestNotificationPermission();
      
      if (!permissionGranted) {
        notificationStatus.textContent = 'Akses notifikasi ditolak';
        notificationStatus.classList.add('error');
        return;
      }
      
      // Subscribe to push
      const subscribed = await subscribeUserToPush(this._serviceWorkerRegistration);
      
      if (subscribed) {
        this._isSubscribed = true;
        notificationStatus.textContent = 'Notifikasi berhasil diaktifkan';
        notificationStatus.classList.remove('error');
        notificationStatus.classList.add('success');
        document.querySelector('#notificationToggleBtn').textContent = 'Nonaktifkan Notifikasi';
      } else {
        notificationStatus.textContent = 'Gagal mengaktifkan notifikasi';
        notificationStatus.classList.add('error');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
      notificationStatus.textContent = 'Terjadi kesalahan saat mengaktifkan notifikasi';
      notificationStatus.classList.add('error');
    }
  }
  
  async _unsubscribeFromPushNotification() {
    const notificationStatus = document.querySelector('#notificationStatus');
    
    try {
      const unsubscribed = await unsubscribeFromPush(this._serviceWorkerRegistration);
      
      if (unsubscribed) {
        this._isSubscribed = false;
        notificationStatus.textContent = 'Notifikasi berhasil dinonaktifkan';
        notificationStatus.classList.remove('success');
        document.querySelector('#notificationToggleBtn').textContent = 'Aktifkan Notifikasi';
      } else {
        notificationStatus.textContent = 'Gagal menonaktifkan notifikasi';
        notificationStatus.classList.add('error');
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      notificationStatus.textContent = 'Terjadi kesalahan saat menonaktifkan notifikasi';
      notificationStatus.classList.add('error');
    }
  }
}

export default NotificationPage;