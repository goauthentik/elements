The Brand Component is an image component for showing a logo or other product information.

## Analysis

The React implementation is little more than pre-defined a collection of breakpoints for setting the
width and height of the brand, and set the width and height of the container. The image itself is
"inline-flex", but nthonig is actually done with that and told to max out its width to fill the
container.

This component has no dark mode definitions.

## Response

This is going to become a common pattern: we wrap it in a web component and render it. There's not
much business logic going on in here. We separate the CSS into the "global" definitions stored in
the `.variables.css` file, and the "local" definitions that apply to the component in the `.css`
file.


