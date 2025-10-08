---
kind: 'Architectural Decision Record'
---

ADR 0001: A Component Folder

🗓️ 2025-09-16 · ✍️ Ken Sternberg <ken@goauthentik.io>

This document explains the layout of a single component in the authentik Elements project.

## Context?

There are a number of different ways a project can be structured, and the way a single component can
be structured.  Having a single, reliable pattern with which a developer can, at a glance,
understand what files are present and why, goes a long way to maintaining consistency and quality.

## Design

A component folder has at least the following:

- `ak-component.component.ts`: The business logic of the component, the reason it exists and the
  behaviors it exhibits.
- `ak-component.css`: The component's CSS
- `ak-component.builder.ts`: A builder function that can generate the components functionally.
  Builder functions allow for complex scenarios where groups of components can be assembled into
  deployable units.
- `ak-component.ts`: A barrel file with the customElement declaration, as well as common exports.
  This is the file most clients should be importing if they want to use the component directly.
- `ak-component.stories.ts`: A Storybook entry that documents the component; what it does, how it
  looks, and as much behavior as can be encompassed by Storybook's toolkit.

In addition, a component *may* have:

- `ak-component.template.ts`: A file with the render function of the component.  In cases where the
  component is complex, has a large render function, has multiple render functions, or has
  sufficient business logic that the render block obscures the lifecycle of the component, moving
  the render functions *as* functions provides a number of benefits:
  - Isolates and guarantees the types needed to render that one block
  - Clears the main component file to make the lifecycle more obvious

The following support files *may* found in a component folder.

- `ak-component.tests.ts`: A webdriverIO unit test.  Tests are not "optional," but there are several
  components that lack much in the way of business logic; they're primarily for display and
  rendering items in specifically styled ways.  In such cases, functional tests are mostly overhead.
  Rely on Storybook and the human eye instead.
- `ak-component.wccss`: A WCCSS file describing how the source CSS was transformed for use by the
  shadowDOM.  WCCSS is described in another ADR.

## Additional Rationale

Providing room for only one test and storybook file is deliberate; it is intended to focus the
developer to create components that can "fit" their tests and stories into single experiences.  It
is possible to build test and story files thousands of lines long, but it is hoped that narrowing
those down to single files will discourage such misbehavior.

