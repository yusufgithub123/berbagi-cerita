const initMap = (container) => {
    // Center map on Indonesia
    const map = L.map(container).setView([-2.5489, 118.0149], 5);
    
    // Add base layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
    });
    
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    });
    
    // Define base maps
    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satelliteLayer,
      "Dark Mode": darkLayer
    };
    
    // Add layer control
    L.control.layers(baseMaps).addTo(map);
    
    // Set default layer
    osmLayer.addTo(map);
    
    return map;
  };
  
  const addMarkers = (map, stories) => {
    stories.forEach((story) => {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      
      // Add popup with story info
      marker.bindPopup(`
        <div class="map-popup">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="Story photo" style="width: 100%; max-height: 150px; object-fit: cover;">
          <p>${story.description}</p>
          <a href="#/detail/${story.id}">Lihat Detail</a>
        </div>
      `);
    });
    
    if (stories.length > 0) {
      const bounds = L.latLngBounds(stories.map(story => [story.lat, story.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };
  
  const setupMapClick = (map, callback) => {
    const marker = L.marker([0, 0]);
    
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      marker.setLatLng([lat, lng]).addTo(map);
      
      callback(lat, lng);
    });
  };
  
  export { initMap, addMarkers, setupMapClick };