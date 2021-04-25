# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.17.0] - 2021-04-25
### Added
- Health endpoint `/healthz`.

### Changed
- Update visual identity of home page.
- Update settings page to tab-style navigation.
- Update visual of reset password page.

### Fixed
- Dark mode on tooltips and toast bar.

## [0.16.0] - 2021-04-10
### Added
- Metric collection service and `/metrics` endpoint.

## [0.15.2] - 2021-04-08
### Changed
- Registry server.

## [0.15.1] - 2021-02-17
### Fixed
- Accessibility and SEO fixes on landing page.

## [0.15.0] - 2021-02-16
### Added
- Anonymous user login.

### Changed
- Update landing page.

## [0.14.1] - 2021-01-09
### Fixed
- Light mode issues.
- TailwindCSS purge not enabled for production.

## [0.14.0] - 2021-01-08
### Changed
- Try to improve TTI and TBT.

## [0.13.6] - 2020-11-24
### Fixed
- Sentry requests blocked by CSP.

## [0.13.5] - 2020-11-22
### Added
- Custom error page.

### Fixed
- CSP violations with inline scripts and styles.

## [0.13.4] - 2020-11-22
### Fixed
- Added `helmet` to express.

## [0.13.3] - 2020-11-21
### Fixed
- Assignment for api host env variable inlining during build.

## [0.13.2] - 2020-11-21
### Added
- Configurable API host via environment variable.

### Fixed
- Format for API base url and hostname.

## [0.13.1] - 2020-11-21
### Fixed
- Added missing meta viewport tag to head element.

## [0.13.0] - 2020-11-20
### Changed
- Updated tooltip component to work better in dark mode.
- Update SSR library version.

## [0.12.0] - 2020-10-12
### Fixed
- Truncate note title to avoid horizontal scroll in the table.
- Placeholder in editor not hidden when used any list styling.

## [0.11.7] - 2020-10-03
### Fixed
- Pagination not reset after search in deck page.

## [0.11.6] - 2020-10-03
### Added
- Create note page in mobile.

## [0.11.5] - 2020-10-03
### Added
- Block navigation when trying to exit unsaved note page.
- Retry button to unsaved notes.

### Changed
- Add better error handling in note save.
- Look of circular spinner so it resizes without issue.

## [0.11.4] - 2020-09-26
### Added
- Icon with size 512x512.

## [0.11.3] - 2020-09-26
### Added
- Not found pages for deck and model.

### Changed
- Updated manifest icons to a squared shape, so it fits iOS and custom Android icons better.

## [0.11.2] - 2020-09-16
### Fixed
- Removed background color of disabled list items.

## [0.11.1] - 2020-09-16
### Fixed
- Marketplace link from mobile menu.

## [0.11.0] - 2020-09-15
### Added
- Footer on home page sidebar.

### Removed
- Temporary marketplace page.

## [0.10.2] - 2020-09-14
### Fixed
- Margin of sidebar list on home page.

## [0.10.1] - 2020-09-06
### Changed
- Remove floating action buttons in favor of regular buttons.
- General layout improvements.

## [0.10.0] - 2020-09-05
### Changed
- Card layout.

## [0.9.2] - 2020-09-03
### Fixed
- Study frequency in statistics always showing one day ahead.

## [0.9.1] - 2020-08-30
### Fixed
- Review not accounted for max value in flashcards studied on statistics page.

## [0.9.0] - 2020-08-30
### Added
- Support for review frequency in statistics page.

### Changed
- Persist study page filters in URL.

## [0.8.0] - 2020-08-03
### Added
- Labels for decks and models sections of homepage.

### Changed
- Add tooltip to homepage toolbar and update styling.

### Fixed
- Menu button shadow border.

## [0.7.3] - 2020-07-23
### Fixed
- Incorrect date in study frequency chart of statistics page.
- Outline style in listbox component.
- Study section grid not aligned with decks section.
- Margin of deck description.

## [0.7.2] - 2020-07-22
### Added
- Add notes page in mobile.

### Fixed
- Browser default outline in components.
- Locale popover position overflowing on mobile.
- Remove usage of `style: 'unit'` in `NumberFormat`.
- Issues in model page for mobile viewports.
- Overflow in deck description in home page.
- Home layout for mobile viewports.

## [0.7.1] - 2020-07-20
### Fixed
- Time scale in statistics page.

## [0.7.0] - 2020-07-19
### Added
- Timezone preferences in settings page.

### Changed
- Send user timezone in register mutation.

### Fixed
- Sentry dsn environment variable name.

## [0.6.3] - 2020-07-16
### Fixed
- Configuration for sentry not applied in build.

## [0.6.2] - 2020-07-15
### Added
- Configuration for Sentry.

## [0.6.1] - 2020-07-13
### Fixed
- Calculation for total study time in statistics page.

## [0.6.0] - 2020-07-11
### Added
- Implementation for statistics page.

### Fixed
- Dialogs widths on mobile were too small.

## [0.5.1] - 2020-06-20
### Fixed
- Model listbox in create notes page behind field value editor placeholder
  if the user created at least 4 models.
- Cursor style for homepage's sidebar list.
- Performance issues in deck and models pages that had a lot of notes and
  flashcards.

## [0.5.0] - 2020-06-12
### Added
- Generic error page.
- Chips with quantity of fields and templates on model card.
- Ability to add, edit and delete notes inside a Deck.
- Implementation for study section with all Decks with pending flashcards.
- Study page.
- Text alignment controls in editor.
- Forgot and reset password pages.
- Message when templates were saved in notes and models.
- Study session details in deck card inside study section.
- Pagination to notes table in deck details.

### Changed
- Update logo icon for when the user is offline.
- Default meta description.
- [BREAKING CHANGE] Rename `CardModel` type to `Model`.
- [BREAKING CHANGE] Rename model queries names from `cardModel` to `model`,
  and `cardModels` to `models`.
- [BREAKING CHANGE] Rename Flashcard field in `Model` from `cards` to `flashCards`.
- Reset note page form after creation instead of redirecting to deck details.

### Fixed
- Back arrow not working in home for initial page.
- Top bar position on mobile view.
- Editor losing focus when clicking on any style button.
- Add deck form creating duplicate decks.
- Translated some error messages and fix some translations.
- Select a model by default in add note page.

### Removed
- Search bar from top bar.

## [0.4.9] - 2019-05-19
### Added
- Persisted query link.

### Changed
- Update not found page with home link.

### Fixed
- Notification action always being triggered.
- HTML entities not escaped in translations.

## [0.4.8] - 2019-05-19
### Changed
- Update favicon icon.

## [0.4.7] - 2019-05-19
### Fixed
- Read main path from asset manifest instead of hardcoded path in server.

## [0.4.6] - 2019-05-19 [YANKED]
### Changed
- Add hash on app entrypoints.

### Fixed
- Select label not being initialized with value in settings page.

## [0.4.5] - 2019-05-19
### Changed
- Remove window reload when changing language.

### Fixed
- Error in hook on settings page.

## [0.4.4] - 2019-05-18
### Added
- Offline ready toast.
- Update ready toast.

### Changed
- Add single source of truth for notifications.
- Update homepage to use single route for tabs.
- Upgrade LinguiJS to v3.0.0.

### Fixed
- Added model toast persisted in route state.
- User account creation toast persisted in route state.
- Window reload on language change when offline.

## [0.4.3] - 2019-05-16
### Added
- Asset rules on service worker.

### Changed
- API service worker handler to `NetworkFirst` strategy.
- Stop skip sw skip waiting.

### Fixed
- Documents being cached with stale with revalidate strategy.

## [0.4.2] - 2019-05-16
### Changed
- Disable pull-to-refresh action in android mobile.

## [0.4.1] - 2019-05-12
### Added
- Offline for default pages.

### Fixed
- Cache not working for google fonts.

## [0.4.0] - 2019-05-12
### Added
- Service worker powered by Workbox.

### Changed
- Mention span background color to secondary.
- Replace some editor controls with icons.

### Fixed
- Style button background color.
- Selected item in drawer not updating with current location.

## [0.3.5] - 2019-05-10
### Added
- Rovering tab index in editor controls

### Changed
- Translated save settings button

### Fixed
- Removed `@ts-ignore` in mentions editor.
- CSS modules including `node_modules` styles.

## [0.3.4] - 2019-05-08
### Added
- `robots.txt` file.

### Changed
- Preload styles in server.
- Update default font-size to 15px.

### Fixed
- Language change selection without reload.
- Add model page layout on mobile.

## [0.3.3] - 2019-05-08
### Changed
- Add label to topbar menu icon.

### Fixed
- Hide add icon on decks and models section.
- Drawer not closing on route change on mobile.
- Floating action button position on deck and model sections.

## [0.3.2] - 2019-05-06
### Changed
- Mark template editor as readonly on mobile.
- Hide icons for assistive tecnologies.

### Fixed
- Add aria labels to search bar icons.
- Missing ids in register form inputs.

## [0.3.1] - 2019-05-06
### Fixed
- Language attribute in `html` not reflecting current language.

## [0.3.0] - 2019-05-05
### Added
- New typeahead component.
- Add settings page with language selector.

### Changed
- Update `material` packages to v0.12.0.
- Update theme colors to use css variables.
- Set main content to use `main` tag.
- Disable autocomplete on search bar.
- Update mentions popup to use the typeahead component.
- Translated all pages to portuguese.

### Fixed
- Drawer items not tabbable.
- Enter the model and deck page with enter while focused on the card.

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


[Unreleased]: https://github.com/cramkle/cramkle/compare/v0.17.0...HEAD
[0.17.0]: https://github.com/cramkle/cramkle/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/cramkle/cramkle/compare/v0.15.2...v0.16.0
[0.15.2]: https://github.com/cramkle/cramkle/compare/v0.15.1...v0.15.2
[0.15.1]: https://github.com/cramkle/cramkle/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/cramkle/cramkle/compare/v0.14.1...v0.15.0
[0.14.1]: https://github.com/cramkle/cramkle/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/cramkle/cramkle/compare/v0.13.6...v0.14.0
