`<ak-storybook-theme-provider>` exists strictly to support Storybook's display of light/dark mode
iframes and should not be used in production. For this reason, it's missing most of the niceties of
the other components. It takes no arguments, so it has no need of `spread` or of any Props object.
