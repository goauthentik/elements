# Description

This is the Authentik Elements Web Library, a collection of components that we use regularly in our
UI and, going forward, hopefully in more projects.

# Purpose

The purpose of this library is to provide an upgrade path away from the hard-to-use Patternfly 4
library of components, including its lack of significant light/dark functionality. This project uses
Patternfly 5 as a _basis_, provides functionality using Web Components, and converts Patternfly 5's
React-oriented CSS to a more Web Component / ShadowDOM-friendly format using an automattion tool.

# Component Design

A component folder has at least four and as many as seven standard files:

- The component file
- A builder function that can generate components automatically
- A barrel file with the customElement declaration
- The component's CSS
- A Storybook Story
- A webdriverIO unit test
- A WCCSS file describing how the source CSS is used in the shadowDOM

## Rationale for deviations from common practice

1. Why separate the customElement declaration from the component?

- Allows for inheriting the component without forcing clients to register the component with the
  browser.
- Clients must remember to import the barrel file rather than the component.

2. Why have a builder function?

- Allows clients who need to build a collection of components to do so through a function call,
  with all the typechecking that enables.
- Maintainers will have to guarantee the builder keeps up with any changes.
