The Battery is a Patternfly-5 component for showing the status of a finite resource.

## Analysis

The Patternfly 5 Battery is a React-only component; there's not even standard CSS for it in the
Patternfly CSS library! That said, it's extremely straightforward: A wrapper around an SVG icon of a
battery showing one through four lines, with matching status colors.

## Implementation

Mostly this was a matter of separating the CSS and the SVG into their own blocks, and then
implementing matching the severity setting (as a standardized `:host` attribute) with the correct
SVG. Color matching happens automatically with the `:host` attribute.
