import {OutType} from '@elchi/tags/tagsType';


export const RegexMatcher: OutType = { "RegexMatcher": [
  {
    "name": "engine_type.google_re2",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RegexMatcher_GoogleRE2",
    "enums": null,
    "comment": "Google's RE2 regex engine.",
    "notImp": false
  },
  {
    "name": "regex",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The regex match string. The string must be supported by the configured engine.",
    "notImp": false
  }
] };

export const RegexMatcher_SingleFields = [
  "regex"
];

export const RegexMatcher_GoogleRE2: OutType = { "RegexMatcher_GoogleRE2": [
  {
    "name": "max_program_size",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "This field controls the RE2 \"program size\" which is a rough estimate of how complex a compiled regex is to evaluate. A regex that has a program size greater than the configured value will fail to compile. In this case, the configured max program size can be increased or the regex can be simplified. If not specified, the default is 100.\n\nThis field is deprecated; regexp validation should be performed on the management server instead of being done by each individual client.",
    "notImp": false
  }
] };

export const RegexMatchAndSubstitute: OutType = { "RegexMatchAndSubstitute": [
  {
    "name": "pattern",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "The regular expression used to find portions of a string (hereafter called the \"subject string\") that should be replaced. When a new string is produced during the substitution operation, the new string is initially the same as the subject string, but then all matches in the subject string are replaced by the substitution string. If replacing all matches isn't desired, regular expression anchors can be used to ensure a single match, so as to replace just one occurrence of a pattern. Capture groups can be used in the pattern to extract portions of the subject string, and then referenced in the substitution string.",
    "notImp": false
  },
  {
    "name": "substitution",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The string that should be substituted into matching portions of the subject string during a substitution operation to produce a new string. Capture groups in the pattern can be referenced in the substitution string. Note, however, that the syntax for referring to capture groups is defined by the chosen regular expression engine. Google's `RE2 <https://github.com/google/re2>`_ regular expression engine uses a backslash followed by the capture group number to denote a numbered capture group. E.g., ``\\1`` refers to capture group 1, and ``\\2`` refers to capture group 2.",
    "notImp": false
  }
] };

export const RegexMatchAndSubstitute_SingleFields = [
  "substitution"
];