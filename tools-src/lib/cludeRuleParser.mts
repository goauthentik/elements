import Parsimmon from "parsimmon";

const P = Parsimmon;
const S = P.string.bind(P);
const OWS = P.optWhitespace;

const cludes = P.createLanguage({
    IncludeTerms: (r) =>
        P.seq(r.IncludeRule.trim(OWS).skip(S(",")).many(), OWS.then(r.IncludeRule).skip(OWS)).map(
            (d) => [...d[0], d[1]]
        ),

    IncludeRule: (r) => P.alt(r.Regex, r.Name, r.Ident),

    Regex: () => P.regexp(/\/((?:\\.|.)*?)\//, 1).map((r) => new RegExp(r)),

    Name: (_) => P.regexp(/[A-Za-z]([A-Za-z0-9_-]|\\\d+)*/),

    Ident: (r) =>
        S("--")
            .then(r.Name)
            .map((d) => `--${d}`),
});

export const parseCludes = (s) => cludes.IncludeTerms.tryParse(s.trim());

export default parseCludes;
