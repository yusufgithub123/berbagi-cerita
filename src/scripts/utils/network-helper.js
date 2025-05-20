const isOnline = () => {
  return navigator.onLine;
};

const checkConnectivity = async () => {
  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/ping', {
      mode: 'no-cors',
      method: 'HEAD',
    });
    
    return true;
  } catch (error) {
    console.error('Network not available:', error);
    return false;
  }
};

export {
  isOnline,
  checkConnectivity,
};