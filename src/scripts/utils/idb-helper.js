const DB_NAME = 'storyshare-db';
const DB_VERSION = 3; // Update version
const STORE_NAME = 'stories';
const SAVED_STORIES_STORE = 'saved_stories';
const FAVORITE_STORIES_STORE = 'favorite_stories'; // New store for favorites

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(SAVED_STORIES_STORE)) {
        db.createObjectStore(SAVED_STORIES_STORE, { keyPath: 'id' });
      }
      
      // Create new store for favorites
      if (!db.objectStoreNames.contains(FAVORITE_STORIES_STORE)) {
        db.createObjectStore(FAVORITE_STORIES_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
  });
};

const getFavoriteStories = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITE_STORIES_STORE, 'readonly');
    const store = tx.objectStore(FAVORITE_STORIES_STORE);
    const request = store.getAll();

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const addToFavorites = async (story) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITE_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(FAVORITE_STORIES_STORE);
    const request = store.put(story);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const removeFromFavorites = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITE_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(FAVORITE_STORIES_STORE);
    const request = store.delete(id);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(true);
  });
};

const isFavorite = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITE_STORIES_STORE, 'readonly');
    const store = tx.objectStore(FAVORITE_STORIES_STORE);
    const request = store.get(id);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(!!e.target.result);
  });
};

// Story CRUD Operations
const getStories = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const getStory = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const saveStory = async (story) => {
  // Periksa dan ubah photoUrl jika berupa Blob
  if (story.photoUrl instanceof Blob) {
    story.photoUrl = URL.createObjectURL(story.photoUrl);
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(story);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const deleteStory = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(true);
  });
};

// Saved Stories Operations
const getSavedStories = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SAVED_STORIES_STORE, 'readonly');
    const store = tx.objectStore(SAVED_STORIES_STORE);
    const request = store.getAll();

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const saveStoryToSaved = async (story) => {
  // Periksa dan ubah photoUrl jika berupa Blob
  if (story.photoUrl instanceof Blob) {
    story.photoUrl = URL.createObjectURL(story.photoUrl);
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SAVED_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(SAVED_STORIES_STORE);
    const request = store.put(story);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
  });
};

const removeSavedStory = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SAVED_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(SAVED_STORIES_STORE);
    const request = store.delete(id);

    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(true);
  });
};

export {
  openDB,
  getStories,
  getStory,
  saveStory,
  deleteStory,
  getSavedStories,
  saveStoryToSaved,
  removeSavedStory,
  getFavoriteStories,
  addToFavorites,
  removeFromFavorites,
  isFavorite
};