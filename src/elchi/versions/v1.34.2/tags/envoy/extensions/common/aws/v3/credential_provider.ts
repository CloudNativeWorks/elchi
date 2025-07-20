import {OutType} from '@elchi/tags/tagsType';


export const AssumeRoleWithWebIdentityCredentialProvider: OutType = { "AssumeRoleWithWebIdentityCredentialProvider": [
  {
    "name": "web_identity_token_data_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Data source for a web identity token that is provided by the identity provider to assume the role. When using this data source, even if a ``watched_directory`` is provided, the token file will only be re-read when the credentials returned from AssumeRoleWithWebIdentity expire.",
    "notImp": false
  },
  {
    "name": "role_arn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ARN of the role to assume.",
    "notImp": false
  },
  {
    "name": "role_session_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional role session name to use in AssumeRoleWithWebIdentity API call.",
    "notImp": false
  }
] };

export const AssumeRoleWithWebIdentityCredentialProvider_SingleFields = [
  "role_arn",
  "role_session_name"
];

export const InlineCredentialProvider: OutType = { "InlineCredentialProvider": [
  {
    "name": "access_key_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The AWS access key ID.",
    "notImp": false
  },
  {
    "name": "secret_access_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The AWS secret access key.",
    "notImp": false
  },
  {
    "name": "session_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The AWS session token. This is optional.",
    "notImp": false
  }
] };

export const InlineCredentialProvider_SingleFields = [
  "access_key_id",
  "secret_access_key",
  "session_token"
];

export const CredentialsFileCredentialProvider: OutType = { "CredentialsFileCredentialProvider": [
  {
    "name": "credentials_data_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Data source from which to retrieve AWS credentials When using this data source, if a ``watched_directory`` is provided, the credential file will be re-read when a file move is detected. See `watched_directory` for more information about the ``watched_directory`` field.",
    "notImp": false
  },
  {
    "name": "profile",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The profile within the credentials_file data source. If not provided, the default profile will be used.",
    "notImp": false
  }
] };

export const CredentialsFileCredentialProvider_SingleFields = [
  "profile"
];

export const AwsCredentialProvider: OutType = { "AwsCredentialProvider": [
  {
    "name": "assume_role_with_web_identity_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AssumeRoleWithWebIdentityCredentialProvider",
    "enums": null,
    "comment": "The option to use `AssumeRoleWithWebIdentity <https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html>`_.",
    "notImp": false
  },
  {
    "name": "inline_credential",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "InlineCredentialProvider",
    "enums": null,
    "comment": "The option to use an inline credential. If inline credential is provided, no chain will be created and only the inline credential will be used.",
    "notImp": false
  },
  {
    "name": "credentials_file_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CredentialsFileCredentialProvider",
    "enums": null,
    "comment": "The option to specify parameters for credential retrieval from an envoy data source, such as a file in AWS credential format.",
    "notImp": false
  },
  {
    "name": "custom_credential_provider_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Create a custom credential provider chain instead of the default credential provider chain. If set to TRUE, the credential provider chain that is created contains only those set in this credential provider message. If set to FALSE, the settings provided here will act as modifiers to the default credential provider chain. Defaults to FALSE.\n\nThis has no effect if inline_credential is provided.",
    "notImp": false
  }
] };

export const AwsCredentialProvider_SingleFields = [
  "custom_credential_provider_chain"
];