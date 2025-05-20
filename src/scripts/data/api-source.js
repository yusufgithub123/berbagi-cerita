const API_ENDPOINT = 'https://story-api.dicoding.dev/v1';

class StoryApi {
  static async register(name, email, password) {
    const response = await fetch(`${API_ENDPOINT}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    
    return response.json();
  }
  
  static async login(email, password) {
    const response = await fetch(`${API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    return response.json();
  }

static async updateStory(token, id, formData) {
  const response = await fetch(`${API_ENDPOINT}/stories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
}

static async deleteStory(token, id) {
  const response = await fetch(`${API_ENDPOINT}/stories/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}
  
  static async getAllStories(token, page = 1, size = 10, location = 0) {
    const response = await fetch(`${API_ENDPOINT}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.json();
  }
  
  static async getDetailStory(token, id) {
    const response = await fetch(`${API_ENDPOINT}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.json();
  }
  
  static async addNewStory(token, formData) {
    const response = await fetch(`${API_ENDPOINT}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return response.json();
  }
  
  static async addGuestStory(formData) {
    const response = await fetch(`${API_ENDPOINT}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  }
  
  static async subscribeNotification(token, subscription) {
    const response = await fetch(`${API_ENDPOINT}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    return response.json();
  }
  
  static async unsubscribeNotification(token, endpoint) {
    const response = await fetch(`${API_ENDPOINT}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });
    
    return response.json();
  }
}


export default StoryApi;

