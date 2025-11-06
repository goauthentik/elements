import Parsimmon from "parsimmon";
const P = Parsimmon;
// String operator, so I don't have to write "String" all the time.
const S = P.string.bind(P);
// Regex operator, so I don't have to write "String" all the time. Also helps disambiguate between
// Parsimmon's "regexp" and JavaScript's "RegExp".
const R = P.regexp.bind(P);
// OptionalWhiteSpace
const OWS = P.optWhitespace;
const cludes = P.createLanguage({
    // Took me awhile to figure out that "includerule," (note the terminating comma) and
    // "includerule" were two different things, and the parser greedily tries to match the first,
    // then backtracks and tries to match the second if there's only one.
    IncludeTerms: (r) => P.seq(r.IncludeRule.trim(OWS).skip(S(",")).many(), OWS.then(r.IncludeRule).skip(OWS)).map((d) => [...d[0], d[1]]),
    IncludeRule: (r) => P.alt(r.Regex, r.Name, r.Ident),
    Regex: () => R(/\/((?:\\.|.)*?)\//, 1).map((r) => new RegExp(r)),
    Name: (_) => R(/[A-Za-z]([A-Za-z0-9_-]|\\\d+)*/),
    Ident: (r) => S("--")
        .then(r.Name)
        .map((d) => `--${d}`),
});
export const parseCludes = (s) => cludes.IncludeTerms.tryParse(s.trim());
export default parseCludes;
