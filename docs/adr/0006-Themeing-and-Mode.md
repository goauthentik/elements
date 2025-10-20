---
kind: 'Architectural Decision Record'
---

ADR 0005: Themes and Dark Mode

🗓️ 2025-09-16 · ✍️ Ken Sternberg <ken@goauthentik.io>

## Context

Patternfly 5 Base supports 86 components, plus contributions found in Patternfly 5 Extensions or
Patternfly 5 Groups.  Of those 86 components, *52* have "exceptions to Dark Mode" blocks, places
where the CSS redefines colors or eliminates drop shadows ([read this essay on Material Design's
dark mode for good reasons
why](https://medium.com/@tundehercules/designing-effective-dark-mode-interfaces-17f38ecea2e9)). All
of these exceptions are activated by a global CSS trigger on root element (`.pf-v5-theme-dark`), and
almost all of them work by redefining CSS Custom Properties.  Almost, but not quite:

- `Page` redefines the default `color` and `background-color` directives for some buttons, the
  sidebar, and certain sections of the page directly
- `SelectMenu`, a deprecated `<select>`-driven navigation component, redefines the toggle's
  background color
- `Button` redefines the border and border color when the button is disabled
- `MenuToggle`, which replaced `SelectMenu`, redefines the toggle's background color
- `Modal` redefines the default color of its content
- `Wizard` redefines the color of header content
- `Select` redefines the color of its toggle when disabled
- `Dropdown` redefines the color of its toggle, both when active and disabled
- `FormControl`, bizarrely, redefines both the color of its content and an explicit call-out to the
  color of the calender control
- `Nav` redefines its drop shadow
- `CodeEditor` redefines its drop shadow
- `Banner` redefines its content color

While we've leaned heavily on WCCSS to get us rough drafts of what the component should look like,
this presents a new and interesting challenge.

## Proposal:

Outside of the component, define all of the properties that drive a component's look and feel.  Move
the CSS Custom properties into the `:root`, including the dark-mode properties, using BEM-style
naming for tokens:

``` css
--ns-vr-c-component-name__sub-element--state--Property
```

Legend:

- NS: Namespace
- VR: Version
- C: Identifies this as a component
- COMPONENT-NAME: The name of the component. Components can be single-hyphenated, i.e. "content-header"
- SUB-ELEMENT (optional): Any elements inside the component
- STATE (optional): Changes to the property based on states, such a "hover" or "dark-mode"
- PROPERTY: The actual property being addressed, like FontWeight or BorderRadius

All of these tokens are lower case, **except** the Property field, which is CamelCased to
distinguish it from other tokens.  Subelements are separated from their precedent (whether
component, state, or parent subelement) by double-underscores, and states are separated from
precedents by double-dashes.

Right now, we're supporting two namespace-version pairs, the existing Patternfly components under
`--pf-v5`, and our authentik components under `--ak-v1`.

### Fallbacks

That is the name of a _component property_, but deriving that name is something else.  Right now, we
use the WCCSS tool to automatically derive component property names from the Patternfly original,
but we've introduced several of our own, and the Patternfly strategy of, for example, using color
weights in naming schemes doesn't really tell us anything about the purpose of the color.  The
difference between `--pf-v5-global--disabled-color--100` and `--pf-v5-global--disabled-color--200`
isn't clear from usage.

Out of the 256 global properties defined by Patternfly, we use 92 of them (so far).  Inspiration
from Porsche, Webawesome, and Quiet tell me we could do a lot better using layers.

To that end, every one of these root-level property definitions will have the following treatment:

A unique `:root` object with a comment explaining what component it is for will be included as a
separate file with the component.  The contents of that file will entirely be included in the global
`authentik.css` file, comments as well as content.  Each entry will have a number of fallbacks.  An
example may help:

``` css
/* ak-content-header */
:root {
  --ak-v1-c-content-header__subtitle--LineHeight: 
    var(--ak-v1-global--LineHeight--sm, 
      var(--pf-v5-global--LineHeight--sm, 1.3));
}
```

Here, we're defining a property for the LineHeight inside our Content Header component, which is
part of the masthead.  We first see if we have one defined, then fall back to the one provided by
Patternfly, and if that's not available, we fallback to a hard-coded default.

*Inside the component*, however, we have a different story:


``` css
:host {
   --subtitle--LineHeight: var(--ak-v1-c-content-header__subtitle--LineHeight, 1.3);
}

[part="subtitle"] {
    line-height: var(--pf-v5-c-content-header--subtitle--LineHeight);
}
```

There's little need to clutter the internals of the component's CSS with lots of long, complicated
BEM strings.  Most of our CSS-targetable internal elements will be defined in terms of
`::part`-reachable names, and the COMPONENT-NAME or SUB-ELEMENT portion of the Custom property name
should be sufficient to identify the target.

### Expansion slots: Stretch Goal

It should be possible to define properties that Patternfly does not currently use, in order to
provide "expansion slots" for creative adaptations of themes and designs.  Defining unused
properties allows future developers to impose creative will over the look and feel of components,
because `::part:before` is not permitted.

For those that are not currently in use, there are two possibilities:

For all of the properties that a web component inherits, `inherit` is the correct setting. Those
styles are: `color`, `cursor`, `direction`, `font`, `font-* (font-family, font-size etc.)`,
`letter-spacing`, `line-height`, `text-align`, `text-indent`, `text-transform`, `visibility`,
`word-spacing`.

For all other properties, `initial` is correct.
