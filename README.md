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

This project uses [`lingui-js`](https://github.com/lingui/js-lingui) for i18n. In case you need
to translate something that isn't yet translated, or you are adding some new texts, you'll need
to use one of the macros from the lingui package. Lingui comes with several macros to handle all
sorts of cases of language translation, but the more common one is a plain text. For simple texts,
you can use either the `Trans` macro or the `t` macro in conjunction with the `useLingui` hook.

Now, to translate something you can just wrap it up with one of lingui macros, like one of the two above:

```tsx
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

const ComponentWithTrans = () => {
  return (
    <span>
      <Trans>My translated text</Trans>
    </span>
  )
}

const ComponentWithUseLingui = () => {
  const { i18n } = useLingui()

  return (
    <span>
      {i18n._(t`My translated text`)}
    </span>
  )
}
```

After adding the macro to the component like in the example above, you need to run `yarn extract`
in the app folder, so lingui can extract those texts into the PO files (under `app/src/locales/`).
Then, edit the translation in the corresponding files and run `yarn compile` (again, in the app folder),
and that's it. You can see more info and other examples on the [Lingui docs](https://lingui.js.org/).

## CSS and Tailwind

We use [Tailwind](https://tailwindcss.com) to style our components. So, everytime you need to add
something in the tailwind configuration file, you will need to re-build the tailwind CSS, and you
can do so with the `yarn build-tailwind` command inside the app folder.
