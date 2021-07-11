export default [
  {
    path: '',
    component: () => import('./components/routes/GuestRoute'),
    children: [
      {
        component: () => import('./components/pages/LandingPage'),
        path: '/',
      },
      {
        component: () => import('./components/pages/LoginPage'),
        path: '/login',
      },
      {
        component: () => import('./components/pages/RegisterPage'),
        path: '/register',
      },
      {
        component: () => import('./components/pages/ForgotPasswordPage'),
        path: '/forgot-password',
      },
      {
        component: () => import('./components/pages/ResetPasswordPage'),
        path: '/reset-password/:userId',
      },
    ],
  },
  {
    path: '',
    component: () => import('./components/routes/UserRoute'),
    children: [
      {
        path: '',
        component: () => import('./components/Shell'),
        children: [
          {
            component: () => import('./components/pages/HomePage'),
            path: '/home',
          },
          {
            component: () => import('./components/Redirect'),
            path: '/decks',
            props: {
              to: {
                pathname: '/home',
                state: { currentTab: 1 },
              },
            },
          },
          {
            component: () => import('./components/Redirect'),
            path: '/models',
            props: {
              to: {
                pathname: '/home',
                state: { currentTab: 2 },
              },
            },
          },
          {
            component: () => import('./components/pages/DeckPage'),
            path: '/d/:slug',
          },
          {
            component: () => import('./components/pages/AddNotePage'),
            path: '/d/:slug/new-note',
          },
          {
            component: () => import('./components/pages/NotePage'),
            path: '/d/:slug/note/:noteId',
          },
          {
            component: () => import('./components/pages/AddModelPage'),
            path: '/models/create',
          },
          {
            component: () => import('./components/pages/ModelPage'),
            path: '/m/:id',
          },
          {
            component: () => import('./components/pages/SettingsPage'),
            path: '/settings',
            children: [
              {
                path: '/preferences',
                component: () => import('./components/pages/GeneralSettings'),
              },
              {
                path: '/profile',
                component: () => import('./components/pages/ProfileSettings'),
              },
            ],
          },
          {
            component: () => import('./components/pages/StatisticsPage'),
            path: '/statistics',
          },
        ],
      },
      {
        component: () => import('./components/pages/StudyPage'),
        path: '/study/:slug',
      },
    ],
  },
  {
    component: () => import('./components/pages/AboutPage'),
    path: '/about',
  },
  {
    component: () => import('./components/pages/NotFoundPage'),
    path: '*',
  },
]
