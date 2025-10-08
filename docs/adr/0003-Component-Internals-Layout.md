---
kind: 'Architectural Decision Record'
---

ADR 0001: Component Internals

🗓️ 2025-09-16 · ✍️ Ken Sternberg <ken@goauthentik.io>

This document explains the layout of a single component's internals.

## Context?

Developers have habits that they carry from project to project.  To assist with making this project
as accessible as possible, we have a standard layout for what should be in a single component's
business logic.

## Design

The basic design of a component is shown below. This file is meant to encompass the business logic
of the component, it's states that are relevant to its behavior rather than its appearance. (See the
"CSS Philosophy" ADR for an explanation of this distinction.) To that end, we externalize the styles
into a CSS file and, unless it's small and conceptually simple, the rendering template as well.

``` Typescript
// A component begins with a name with no prefix, the component it extends, and
// an interface, which describes the publicly available properties and methods.
// The interface is used to drive both the Storybook implementation and the
// builder function declaration.

export class Component extends LitElement implements IComponent {
    // The static blocks always come first.  Along with the styles block, which
    // should always be present, include the `formAssociated` declaration as
    // well if it is required.

    static readonly styles = [styles];

    // Properties are next.  Types should be declared, although `String` is default
    // and may be elided.  Think for a long time before using `reflect`.

    @property({ type: String })
    public property?: string;

    // Boolean properties must always have a default, and that default must always (ALWAYS) be
    // false. Find a way to design your component so that this condition always holds.

    @property({ type: Boolean, reflect: true })
    public boolproperty = false;

    // States and queries are next.

    @state()
    public someState: string;

    @query('[part="foo"]')
    public fooPart?: HTMLElement;
    

    // Private and internal fields. If there are methods that require access to this` independent of the
    // instance, such as callbacks, prefer placing them here, early in the component file, so they
    // will be available when declaring methods that pass them to client code.  This is also where
    // callbacks passed to Controllers should be instantiated, and *then* the Controllers themselves.

    #privateField: string;

    private onClick = (ev: Event) => { /* do something here */ }

    // Constructor, if necessary.  It rarely is.

    constructor() {
        super();
    }

    // Lifecycle methods for the component itself

    // When setting up event listeners that are external to this component, prefer using the
    // AbortController pattern:
    // https://css-tricks.com/using-abortcontroller-as-an-alternative-for-removing-event-listeners/

    connectedCallback() {
        super.connectedCallback();
        // Set up.
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Tear down.
    }
    
    // Render()-cycle methods.

    willUpdate(changed: PropertyValues<this>) {
        super.willUpdate(changed);
        /* Logic here */
    }

    // As noted above, if the render method gets long, has larger alternative render blocks, or
    // is just visually jarring in the context of a component's business logic, consider putting
    // it into a template file.

    render() {
        /* Render template goes here. */
    }
    
    // Lifecycle methods that are called at the end of the render cycle go after the
    // render method.
    
    firstUpdated(changed: PropertyValues<this>) {
        super.firstUpdated(changed);
        /* Logic here */
    }

    updated(changed: PropertyValues<this>) {
        super.updated(changed);
        /* Logic here */
    }
}
```

