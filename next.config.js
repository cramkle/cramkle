// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: [
      '@lingui/core',
      '@lingui/react',
      'react-tab-controller',
      '@material/icon-button',
      '@reach/alert',
      '@reach/alert-dialog',
      '@reach/checkbox',
      '@reach/dialog',
      '@reach/listbox',
      '@reach/menu-button',
      '@reach/tabs',
      '@reach/tooltip',
      '@reach/visually-hidden',
    ],
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })

    return config
  },
}

module.exports = nextConfig
