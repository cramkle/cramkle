# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Update `material` packages to v0.12.0.

### Fixed
- Drawer items not tabbable.

## [0.2.2] - 2019-05-01
### Changed
- Split server and app packages.
- Updated docker image to Node 12.

## [0.2.1] - 2019-04-27
### Fixed
- Alignment on home page sections.

## [0.2.0] - 2019-04-27
### Added
- Add model page, with create form and template editor.

### Changed
- Rename template route to model route.

### Fixed
- Invalid username/password error message not being displayed.
- Deck form submitting twice on enter press.

### Security
- Fix XSS on apollo data during server-side rendering.

## [0.1.8] - 2019-04-13
### Fixed
- User not being redirected on auth route inside a shell route when not authenticated.

## [0.1.7] - 2019-04-12
### Added
- Add back button on deck page.
- Add relevant meta tags.

### Changed
- Save drawer state in localStorage.
- Separate landing page and home page routes.

### Fixed
- Fix auth route not being rendered on SSR.

### Removed
- Service worker and workbox plugin on build.

## [0.1.6] - 2019-04-06
### Fixed
- Hydration logic on production environment
