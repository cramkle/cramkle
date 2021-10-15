export const notFound = {
  component: () => import('./pages/NotFoundPage'),
}

export default [
  {
    path: '',
    component: () => import('./routes/GuestRoute'),
    children: [
      {
        component: () => import('./pages/LandingPage'),
        path: '/',
      },
      {
        component: () => import('./pages/LoginPage'),
        path: '/login',
      },
      {
        component: () => import('./pages/RegisterPage'),
        path: '/register',
      },
      {
        component: () => import('./pages/ForgotPasswordPage'),
        path: '/forgot-password',
      },
      {
        component: () => import('./pages/ResetPasswordPage'),
        path: '/reset-password/:userId',
      },
    ],
  },
  {
    component: () => import('./routes/UserRoute'),
    children: [
      {
        component: () => import('./components/Shell'),
        children: [
          {
            component: () => import('./pages/HomePage'),
            path: '/home',
          },
          {
            component: () => import('./pages/HomePage'),
            path: '/decks',
          },
          {
            component: () => import('./pages/HomePage'),
            path: '/models',
          },
          {
            component: () => import('./pages/DeckPage'),
            path: '/d/:slug',
          },
          {
            component: () => import('./pages/AddNotePage'),
            path: '/d/:slug/new-note',
          },
          {
            component: () => import('./pages/NotePage'),
            path: '/d/:slug/note/:noteId',
          },
          {
            component: () => import('./pages/AddModelPage'),
            path: '/models/create',
          },
          {
            component: () => import('./pages/ModelPage'),
            path: '/m/:id',
          },
          {
            component: () => import('./pages/SettingsPage'),
            path: '/settings',
            children: [
              {
                path: 'preferences',
                component: () => import('./pages/GeneralSettings'),
              },
              {
                path: 'profile',
                component: () => import('./pages/ProfileSettings'),
              },
            ],
          },
          {
            component: () => import('./pages/StatisticsPage'),
            path: '/statistics',
          },
        ],
      },
      {
        component: () => import('./pages/StudyPage'),
        path: '/study/:slug',
      },
    ],
  },
  {
    component: () => import('./pages/AboutPage'),
    path: '/about',
  },
]
