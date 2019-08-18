# Cramkle

[![Build Status](https://travis-ci.com/lucasecdb/cramkle.svg?branch=master)](https://travis-ci.com/lucasecdb/cramkle)

Cramkle is a *web-based* flashcard studying app that helps you
organize your study using a [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition)
algorithm, used in many flashcard apps and learning websites, such as
[Anki](https://apps.ankiweb.net/) and [SuperMemo](https://www.supermemo.com/).

## Installation and startup

In order to install the required dependencies and
start the development server, run the following commands

> You need to have yarn installed to run this project

```sh
yarn

yarn workspace @cramkle/app-server build
yarn workspace @cramkle/app dev
```
