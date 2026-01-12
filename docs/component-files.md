Developer Context:

authentik Elements is a Web Component library written using Lit-Element. We use Red Hat Patternfly
as our base, and this is the Patternfly-5 upgrade for our elements collection. Our goal with this
project is to produce a first-class component library. authentik is an on-prem product with both
administrator and customer-facing applications, so we wish to provide customization and themability
in a highly convenient manner.

One complication is that Patternfly is a React-oriented CSS library with the assumption that there
is no shadowDOM involved. To that end, we have developed WCCSS (Web Component CSS), a yaml-based
DSL that documents how Patternfly's CSS can be converted to a shadowDOM-friendly format in a
scriptable way.

The following files will be found in almost all components:

- `ak-component.ts`: A "barrel" file which exports the key types, classes, and functions for the
  component. Also performs the registration with the browser. If you import the component some
  other way, you will need to perform that registration yourself.
- `ak-component.component.ts`: The main component file. Contains the main `Lit-Element` component
  with its business logic.
- `ak-component.builder.ts`: A `builder` function that can construct the object programmatically.
  authentik Elements is meant to be used by projects that generate their displays and forms via
  schema files, and builder functions can be used directly or as examples for building dynamic
  displays informed by schemas.
- `ak-component.root.css`: The CSS Custom properties to which the component responds. These are
  usually defined in terms of the global CSS Custom Properties. May contain a dark-mode block that
  redefines the component's properties as needed when the page's `<html>` component dictates. This
  file will be compiled into the global CSS for the entire site.
- `ak-component.css`: The file that translates the CSS Custom properties defined in the previous
  file into properties on the component; defines the targets and declarations to which those
  properties are applied. Uses a shorthand for the properties as used inside the shadowDOM to avoid
  cluttering the developer's cognitive space. All internal elements of a component should be defined
  in terms of CSS `[part="someelement"]` syntax.
- `ak-component.stories.ts`: A storybook file with a comprehensive collection of demos of what the
  component does, how it is configured, and how it looks.

The following files can be found with most components:

- `ak-component.test.ts`: A WebdriverIO test file. Not always present; WebdriverIO, the shadowDOM,
  and events like mouse-in/mouse-out or timing-based components should have strong storybook demos
  instead so developers can affirm that a component behaves as expected.
- `ak-component.wcc.yaml`: A WCCSS file. These files document _what_ we did to convert Patternfly-5
  to a shadowDOM-friendly format. The WCCSS program in the `./tools-src` folder automatically:
    - splits a component's React-oriented CSS into a file defining component-namespaced CSS custom
      properties applied to the page `:root` and a file describing how those properties are applied
      inside the shadowDOM `:host`.
    - automatically applies the default value onto the `:host` entries as fallbacks to `var()` so that
      the component's default look and feel will still be available if the global root file is not
      present.
    - allows the developer to specify which rules in the Patternfly-5 CSS should be converted to the
      shadowDOM format and under what name (as specified above, prefer `[part=""]` to classes).
    - allows the developer to include, exclude, or re-write CSS declarations as required.

The following files are sometimes found:

- `ak-component.overriden.yaml`: If this file is present, it represents a _partial_ machine
  conversion of the CSS by WCCSS. The conversion was completed by hand, and any future changes
  derived from third-parties may have to replicate that custom work.
- `ak-component.template.yaml`: If this file is present, it contains the HTML Templates used by the
  web components. In most cases, a component's template will simply be part of the component and in
  its `render()` function. This file will be present under two circumstances:
    - The business logic is sufficiently complex that the renderer is both an afterthought and visual
      clutter, distracting maintainers from the task and purpose of the component. The developer may
      choose to move the renderer into a separate folder. This is an aesthetic judgement, and we
      leave it to you to decide when and where to make it.
    - There are multiple complex possible renders, each with different type needs, or the renderer has
      highly complex decomposition necessitating a lot of rendering code. In that case, separating
      the templates into standalone functions allows the developer to use Typescript's type system to
      ensure each renderer has the right types it needs and assist in guaranteeing that no needed
      fields were neglected or ignored. As in the case above, "complex" and "a lot of code" are
      aesthetic decisions we leave to your judgement.
- Support and utility files unique to the component, extra CSS that was not part of the component,
  and optional documentation. The extra CSS is imported into the component using Lit-Element's
  `static styles` class field.

If neither a `.wcc.yaml` or `.overriden.yaml` file is present, the component is a _custom_ component
derived from our experience at authentic, something not provided by Patternfly that we felt we
needed, or that we felt was not correctly implemented by Patternfly. For example, the
`ak-skip-to-content` component was developed without reference to Patternfly's and more closely
resembles the experience of the GitHub web component collection's Skip To Content experience.
