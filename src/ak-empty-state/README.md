Empty-State is a component in the Patternfly ecosystem meant to show that a page has no information
or that the information has not yet completed loading.

## Analysis

The Empty State is a specialized card component with a distinct layout:

```
.empty-state
  .icon-block*
    .icon-or-spinner
  .content*
    .title
  .body*
  .footer*
    .actions*
    .secondary-actions*
    .footer-message*
```

All of the internal components are optional, displayed in a `flex` column format with a consistent
gap.

## Implementation

All of the innermost content has been handed over to slots; clients can implement whatever gap
between horizontal components they want (for example, if there are multiple buttons or links in the
`actions` block; the Empty State turns on flex wrappers for components based on whether or not the
slot is populated. The sizing has been regularized to the t-shirt sizing on the topmost attribute,
especially when internal rendering is used for the spinner or icons.
