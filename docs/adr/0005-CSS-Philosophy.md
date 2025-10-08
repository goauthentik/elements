---
kind: 'Architectural Decision Record'
---

ADR 0005: Our CSS Philosophy

🗓️ 2025-09-16 · ✍️ Ken Sternberg <ken@goauthentik.io>

This document explains how we extract our CSS from Patternfly 5, and how we structure our components
to  use exploit that CSS.

## Context?

We are upgrading from Patternfly 4 to Patternfly 5, and creating components as rapidly as possible
to improve the look, feel, behavior, responsiveness of our applications.  Patternfly is a
React-oriented CSS library, and adapting it to web components is a challenge.  Fortunately, there
are patterns that we can exploit within Patternfly itself that may make the task easier.

### The Tension

Patternfly's own components and component files have a nicely regular structure.  A component has a
root name, such as `.pf-v5-c-card`, and interior components have related names, for example,
`.pf-v5-c-card--title`.

Web components, on the other hand, have two alternative ways af addressing a component for styling.

The first is that much styling is based on attributes on the host; `disabled`, `unread`, `required`,
and so on, as well as custom attributes such as `size="sm"`, `variant="primary"`, and
`severity="normal"`.

The second is that internal components can be made addressable by outside CSS via the `part="name"`
attribute, which declares a part of a web component and allows clients to alter that component's
look and feel directly.

Patternfly uses *modifiers* to target the styling variants.  The class `.pf-m-hoverable` is set when
a client wants to decorate a component with a box shadow indicating that it is hoverable; likewile
the class `.pf-m-small` indicates that the "small variant" of the component should be shown.

Patternfly also uses CSS Custom Properties for its control over the look and feel of its components;
many of its class rules have no concrete declarations at all; instead, they redefine the CSS Custom
Properties on a component.  To take one example from Patternfly:

```
.pf-c-card.pf-m-rounded {
  --pf-c-card--m-selectable-raised--m-selected-raised--TranslateY:
      var(--pf-c-card--m-rounded--m-selectable-raised--m-selected-raised--TranslateY);
  --pf-c-card--BorderRadius: 
      var(--pf-c-card--m-rounded--BorderRadius);
}
```

These property declarations, coming later in the CSS file, will be applied to the already existing
concrete declarations and take effect immediately

## Solutions

### WCCSS

Doing all of this by hand is considered *toil*.  This is why we have WCCSS.

WCCSS is a "rough draft" tool that converts Patternfly's structures to web-component friendly ones.
Here's an example from our own code base:

```
:host([variant="rounded"]) {
    $from: ".pf-m-rounded";
}
```

This WCCSS rule pulls the rules from Patternfly and creates a new rule customizing the host
component directly.  WCCSS has a limited but powerful syntax.  For variants that have a unifying
concept, such as size or severity, all the variants can be encompassed in a single rule using 
a regular expression:

```
:host([size="\1"]) {
   $from: /\.pf-m-(sm|md|lg|xl)/;
}


:host([severity="\1"]) {
   $from: /\.pf-m-(success|warning|danger)/;
}
```


**On the other hand**, WCCSS produces only rough drafts.  Sometimes they're useful entirely on their
own, and sometimes they need to be hand-edited.

### No Behavior, No Logic:

Many of the variants have no business logic consequences; they simply change the way the component
looks.  For those styling rules, do not provide properties on the component's class; they are not
needed. They will still work; CSS is indifferent to what the component does with a property setting,
native HTML Elements don't provide warnings if a `size` attribute's setting is nonsensical, and
maintaining those checks is also *toil*.



