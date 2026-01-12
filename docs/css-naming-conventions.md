# CSS Naming Conventions (mostly about properties)

Our CSS Naming Convention derives from BEM (Block, Element, Modifier), with a few additions, leading
us to BEMP: Block, Element, Modifier, Property.

We avoid classes wherever possible, preferring to use the `[part=""]` convention to identify element
of our web components, as a means of enabling and emphasizing our commitment to customization.

## The Global Root File

The global CSS file has a mixture of Patternfly 5's globals, as well as our own overrides and
additions as we have adapted and modified Patternfly's original design to meet our needs. Global
names have one of two prefixes:

- `--pf-v5-global`
- `--ak-v1-global`

What follows the prefix depends on the use case. In most cases, it will be a property, and this can
be a bit confusing, although it will always be prefixed with two dashes. If it is a _concrete_
property (a name than can be directly converted, Camel-to-Kebab style, into a CSS property name), it
will be capitalized:

- `--pf-v5-global--BackgroundColor`

If it is an _abstract_ property (a name that will be used in multiple places, such as margins,
padding, and gaps), it will be lowercase:

- `--pf-v5-global--spacing--md`

You will note here that there's a _suffix_ that describes this as the "medium" spacer, the most
common space, margin, padding, or gap that will be used throughout the product.

Modifying or customizing these values will change the look, feel, and behaviora of the entire product.

## Component Root Files

Component root files define the look, feel, and sometimes behavior of individual components. A root
file translates the global values into namespaced CSS custom properties that will be applied to the
components they reference.

For example:

```css
:root {
    --pf-v5-c-button--m-primary--Color: var(--pf-v5-global--Color--light-100);
    --pf-v5-c-button--m-primary--hover--Color: var(--pf-v5-global--Color--light-100);
    --pf-v5-c-button--m-primary--focus--Color: var(--pf-v5-global--Color--light-100);
```

This fragment of `ak-button.root.css` says that a "primary button has one color at rest, on
different color on hover, and another on focus." Those colors are derived from the global color
settings. (Yes, they're all the same here; the point is that they _are_ customizable, not that
authentik has done any customization... yet.)

The root naming convention follows Patternfly's. However, of note: the component-level CSS Custom
Properties will _always_ be concrete. They define specific properties on specific elements of the
component.

## Component Host Files

Namespacing isn't very useful inside the shadowDOM, and can present a lot of visual clutter. To
that end, we elide the namespace prefixes.

We also provide, whenever possible (almost all the time), the _default_ value for the property
inside the component as a fallback. This ensures that the component has authentik's look and feel even when the
global CSS is unavailable.

One convention of note: Where the fallback value is complex or cluttery, we include it in the
`:host` object with both a symbolic and name-based sign that it is a fallback value. Here
`FallbackFontFamily` has a unique separator indicating that it is a private value:

```css
:host {
    --skip-to-content--BackgroundColor: var(--ak-v1-c-skip-to-content--BackgroundColor, #fd4b2d);
    --skip-to-content-_FallbackFontFamily:
        "RedHatText", "Overpass", overpass, helvetica, arial, sans-serif;
    --skip-to-content--FontFamily: var(
        --ak-v1-c-skip-to-content--FontFamily,
        var(--ak-v1-c-skip-to-content-_FallbackFontFamily)
    );
}

[part="skip-to-content"]:not(:focus) {
}
```

In the Patternfly convention (which we keep until we find a better one), sub-elements of a component
are preceded by a double underscore. The `ak-empty-state` component has this example:

```css
:host {
    --empty-state--m-xl__body--FontSize: var(--pf-v5-c-empty-state--m-xl__body--FontSize, 1.25rem);
```

The "Empty State" is a card-like component with a header, icons, messages, etc. Here, an empty
state of size "extra large" (the 'm-' prefix indicates this is a "modifier" or "variant";
double-hyphen names without this prefix are assumed to be states such as "hover" or "clicked") has a
"body" element within it; the body is prefixed with the double underscores to signify that it is an
element, and not a modifier. And inside the component CSS namespaces, the CamelCase is used to
distinguish between modifiers/states/pseudoclasses (which are always lowercased) and properties.

This therefore reads, "When the empty state is of variant 'extra large,' the body of the empty state
card is 1.25rem."

## Variants

Where there are variants, we use the `:host()` syntax. The previous "extra large" variant is
described this way:

```css
:host([size="xl"]) {
    --empty-state__body--FontSize: var(--empty-state--m-xl__body--FontSize);
    --empty-state__icon--FontSize: var(--empty-state--m-xl__icon--FontSize);
    --empty-state__title-text--FontSize: var(--empty-state--m-xl__title-text--FontSize);
}
```

We simply overwrite the CSS custom properties in use with those of the variant.

Where there is a single, boolean variant, we may elide the `=` sign:

```css
:host([paused]) { ... }
```
