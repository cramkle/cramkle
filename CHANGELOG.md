# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
