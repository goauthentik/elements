---
kind: 'Architectural Decision Record'
---

ADR 0001: What is Authentik Elements

🗓️ 2025-09-16 · ✍️ Ken Sternberg <ken@goauthentik.io>

This document explains why this project exists at all

## Context

The [authentik Single Sign-On Server]() is a years-long project that started life as a Django
application with a simple multi-page application design. authentik SSO provides an on-prem toolkit
known as "Stages"; each Stage represents a single exchange between authentik and some outside
resource, such as the user who is trying to log in, a source of authentication information for
users, and the applications to which an instance of authentik provides access; a collection of
Stages that leads to a successful authentication transaction like logging in, but also logging out,
creating a new user, or updating one's email address, is called a Flow.

The need to maintain a Flow in a single web session led to that specific Django application's
front-end to evolve into a SPA, and then the User Administration applications followed suit.

The project was founded using the Patternfly 4 CSS library, which is oriented toward a global CSS
installation and interaction with frameworks such as React or Angular, but it was also founded on
top of Lit, a web-component oriented library with a strong ShadowDOM component. These two design
decisions are an awkward fit; using Patternfly often means importing large CSS files into each and
every component individually, and creates complex, often convoluted design decisions within some
components.

At the same time, the evolution of the product itself placed more and larger burdens on the
top-level application to provide additional functionality. The on-premises nature of the product
means customers frequently want to customize the look and feel, often multiple times for multiple
in-house brands; the login process has global, session, brand, and user settings, and those bits of
information may come from different sources.

## Purpose

The purpose of this project is to take the CSS and component designs that have evolved and emerged
during the development of the authentik SSO server and provide them with concrete, re-usable
expressions, while also providing a degree of flexibility to permit branding and customization in
our products, as well as permit outside users to make good use of these elements.

To that end, we intend to:

- Provide a classical collection of world-class components that take everything we've learned in the
  past two years of working on this product, as well as a collective fifty years of web development
  experience on our team,
- Provide our own global CSS, driven almost entirely with CSS Custom Properties, to make it possible
  to customize our components
  
## Alternatives considered

Let's just get this out of the way: this is what we WANT to do. It has emerged out of the evolution
of the product; elements were identified, pulled out, named, and reified.  It just was never done
in a formal way until now.  We have, however, discussed alternatives responsibly.

### Patternfly 5 The Hard Way

This was our first experiment; could we just upgrade our product to Patternfly 5 and be done with
it?  Patternfly 5's own automatic upgrade software was written for React, and it could not be used.
After several iterations, we discovered that this solution was not going to work in the time we
decided we had.  We would have ended up re-writing much of the software by hand anyway.

### Open DOM

Of all our alternatives, this is one of the more attractive.  We may yet do it our current course
proves to be intractable.  We don't think it will.  Both Adobe Spectrum and IBM Carbon suggest it's
not impossible; merely difficult.  But just naming them shows that we know who the giants are, and
we have our ropes and pitons ready to scale the heights and stand on their shoulders.

### Use a different framework

We have rejected React almost entirely; React's design philosophy did not sit well with us, and
rewriting the entire application in React was no more welcome than re-writing it to accommodate
Patternfly 5's designs.

### Use an off-the-shelf library like Carbon, Spectrum, or Shoelace

We already had a large ad-hoc collection of components, some of them specialized for our product,
and in many of those cases separating those into "just a component" and "aware of our API" was more
a matter of providing a contextual wrapper than anything else.  But we *like* the look of
Patternfly, and we'd like to keep it as long as possible.
