import {OutType} from '@elchi/tags/tagsType';


export const FileServerConfig: OutType = { "FileServerConfig": [
  {
    "name": "manager_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AsyncFileManagerConfig",
    "enums": null,
    "comment": "A configuration for the AsyncFileManager to be used to read from the filesystem.",
    "notImp": false
  },
  {
    "name": "path_mappings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileServerConfig_PathMapping[]",
    "enums": null,
    "comment": "The longest matching path_mapping takes precedence.",
    "notImp": false
  },
  {
    "name": "content_types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "A map from filename suffix (in lowercase) to content type header. e.g. ``{\"txt\": \"text/plain\"}``\n\nFile suffixes may not contain ``.`` as the filename suffix after the last ``.`` is used to perform an O(1) lookup against the keys.\n\nAn empty string suffix will only match files ending with a ``.``.\n\nFiles with no suffix (e.g. ``README``) can be matched as the full string in lowercase. e.g. ``{\"readme\": \"text/plain\"}``",
    "notImp": false
  },
  {
    "name": "default_content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If ``content_types`` does not contain a match for a file suffix, ``default_content_type`` is used.\n\nIf there is no match and ``default_content_type`` is empty, the ``content-type`` header will be omitted from the response.",
    "notImp": false
  },
  {
    "name": "directory_behaviors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileServerConfig_DirectoryBehavior[]",
    "enums": null,
    "comment": "If the requested path refers to a directory, the given behaviors are tried in order until one succeeds. If the end of the list is reached with no success, the result is a 403 Forbidden.",
    "notImp": false
  }
] };

export const FileServerConfig_SingleFields = [
  "default_content_type"
];

export const FileServerConfig_PathMapping: OutType = { "FileServerConfig_PathMapping": [
  {
    "name": "request_path_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If no ``request_path_prefix`` is matched, the filter does not intercept a request.\n\nIf a ``request_path_prefix`` is matched, that prefix is removed from the request and replaced with ``file_path_prefix`` to form a filesystem path for the request.\n\nPrefix ``/`` will match all GET requests.",
    "notImp": false
  },
  {
    "name": "file_path_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Replaces a matched ``request_path_prefix`` to form a filesystem path for a request. May be relative to the working directory of the envoy execution, or an absolute path.",
    "notImp": false
  }
] };

export const FileServerConfig_PathMapping_SingleFields = [
  "request_path_prefix",
  "file_path_prefix"
];

export const FileServerConfig_DirectoryBehavior: OutType = { "FileServerConfig_DirectoryBehavior": [
  {
    "name": "default_file",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Attempts to serve the given file within the directory, e.g. ``index.html``. Precisely one of ``default_file`` and ``list`` must be set per ``DirectoryBehavior``.",
    "notImp": false
  },
  {
    "name": "list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileServerConfig_DirectoryBehavior_List",
    "enums": null,
    "comment": "Responds with an html formatted list of the files and subdirectories in the directory. Precisely one of ``default_file`` and ``list`` must be set per ``DirectoryBehavior``. [#not-implemented-hide:] Directory operations currently have no async implementation.",
    "notImp": true
  }
] };

export const FileServerConfig_DirectoryBehavior_SingleFields = [
  "default_file"
];

export const FileServerConfig_ContentTypesEntry: OutType = { "FileServerConfig_ContentTypesEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const FileServerConfig_ContentTypesEntry_SingleFields = [
  "key",
  "value"
];