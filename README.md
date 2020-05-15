# Cramkle

![CI](https://github.com/cramkle/cramkle/workflows/CI/badge.svg?branch=master)

Cramkle is a *web-based* flashcard studying app that helps you
organize your study using a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition)
algorithm, used in many flashcard apps and learning websites, such as
[Anki](https://apps.ankiweb.net/) and [SuperMemo](https://www.supermemo.com/).

## Installation and startup

In order to install the required dependencies and
start the development server, run the following commands

> You need to have yarn installed to run this project

```sh
yarn --cwd api
yarn --cwd app

# run the API
yarn --cwd api dev

# run the app
yarn --cwd app dev
```

## Adding and updating translations

This project uses [`lingui-js`](https://github.com/lingui/js-lingui) for i18n. In order
to translate something that isn't yet translated, you need to first figure out whether or not
it's best to use the `Trans` macro or the `t` macro with `useLingui` (if you don't know which
one to use, go with the `Trans` macro).

To translate some text, just wrap it up with one of the two macros above:

```tsx
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

const ComponentWithTrans = () => {
  return (
    <span><Trans>My translated text</Trans></span>
  )
}

const ComponentWithUseLingui = () => {
  const { i18n } = useLingui()

  return (
    <span>{i18n._(t`My translated text`)}</span>
  )
}
```

After adding the macro to the component like in the example above, you need to run `yarn extract`
in the app folder, so lingui can extract those texts into the PO files (under `app/src/locales/`).
Then, edit the translation in the corresponding files and run `yarn compile` (again, in the app folder),
and that's it.
