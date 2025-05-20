import HomePage from '../views/pages/home-page';
import DetailPage from '../views/pages/detail-page';
import AddStoryPage from '../views/pages/add-story-page';
import EditStoryPage from '../views/pages/edit-story-page';
import LoginPage from '../views/pages/login-page';
import RegisterPage from '../views/pages/register-page';
import NotificationPage from '../views/pages/notification-page';
import SavedStoriesPage from '../views/pages/saved-stories-page';
import FavoritesPage from '../views/pages/favorites-page';

const routes = {
  '/': HomePage,
  '/detail/:id': DetailPage,
  '/add-story': AddStoryPage,
  '/edit-story/:id': EditStoryPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/notifications': NotificationPage,
  '/saved-stories': SavedStoriesPage,
  '/favorites': FavoritesPage,
};

export default routes;