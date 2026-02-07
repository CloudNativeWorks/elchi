import {OutType} from '@elchi/tags/tagsType';


export const CelExpressionConfig: OutType = { "CelExpressionConfig": [
  {
    "name": "enable_string_conversion",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable string conversion functions for CEL expressions. When enabled, CEL expressions can convert values to strings using the ``string()`` function.\n\n:::attention\n\nThis option is disabled by default to avoid unbounded memory allocation. CEL evaluation cost is typically bounded by the expression size, but converting arbitrary values (e.g., large messages, lists, or maps) to strings may allocate memory proportional to input data size, which can be unbounded and lead to memory exhaustion.",
    "notImp": false
  },
  {
    "name": "enable_string_concat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable string concatenation for CEL expressions. When enabled, CEL expressions can concatenate strings using the ``+`` operator.\n\n:::attention\n\nThis option is disabled by default to avoid unbounded memory allocation. While CEL normally bounds evaluation by expression size, enabling string concatenation allows building outputs whose size depends on input data, potentially causing large intermediate allocations and memory exhaustion.",
    "notImp": false
  },
  {
    "name": "enable_string_functions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable string manipulation functions for CEL expressions. When enabled, CEL expressions can use additional string functions:\n\n* ``replace(old, new)`` - Replaces all occurrences of ``old`` with ``new``. * ``split(separator)`` - Splits a string into a list of substrings. * ``lowerAscii()`` - Converts ASCII characters to lowercase. * ``upperAscii()`` - Converts ASCII characters to uppercase.\n\n:::note\n\nStandard CEL string functions like ``contains()``, ``startsWith()``, and ``endsWith()`` are always available regardless of this setting. \n:::\n\n:::attention\n\nThis option is disabled by default to avoid unbounded memory allocation. Although CEL generally bounds evaluation by expression size, functions such as ``replace``, ``split``, ``lowerAscii()``, and ``upperAscii()`` can allocate memory proportional to input data size. Under adversarial inputs this can lead to unbounded allocations and memory exhaustion.",
    "notImp": false
  }
] };

export const CelExpressionConfig_SingleFields = [
  "enable_string_conversion",
  "enable_string_concat",
  "enable_string_functions"
];