const initCamera = async (videoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });
      
      videoElement.srcObject = stream;
      
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    }
  };
  
  const takePicture = (videoElement, canvas) => {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  };
  
  const stopCameraStream = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  
  export { initCamera, takePicture, stopCameraStream };