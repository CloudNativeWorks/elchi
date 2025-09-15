import {OutType} from '@elchi/tags/tagsType';


export const StatusAnnotation: OutType = { "StatusAnnotation": [
  {
    "name": "work_in_progress",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The entity is work-in-progress and subject to breaking changes.",
    "notImp": false
  },
  {
    "name": "package_version_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PackageVersionStatus",
    "enums": [
      "UNKNOWN",
      "FROZEN",
      "ACTIVE",
      "NEXT_MAJOR_VERSION_CANDIDATE"
    ],
    "comment": "The entity belongs to a package with the given version status.",
    "notImp": false
  }
] };

export const StatusAnnotation_SingleFields = [
  "work_in_progress",
  "package_version_status"
];