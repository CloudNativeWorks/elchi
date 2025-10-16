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

export const IAMRolesAnywhereCredentialProvider: OutType = { "IAMRolesAnywhereCredentialProvider": [
  {
    "name": "role_arn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ARN of the role to assume via the IAM Roles Anywhere sessions API. See `Configure Roles <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/getting-started.html#getting-started-step2>`_ for more details.",
    "notImp": false
  },
  {
    "name": "certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The certificate used for authenticating to the IAM Roles Anywhere service. This certificate must match one configured in the IAM Roles Anywhere profile. See `Configure Roles <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/getting-started.html#getting-started-step2>`_ for more details.",
    "notImp": false
  },
  {
    "name": "certificate_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The optional certificate chain, required when you are using a subordinate certificate authority for certificate issuance. A certificate chain can contain a maximum of 5 elements, see `The IAM Roles Anywhere authentication process <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication.html>`_ for more details.",
    "notImp": false
  },
  {
    "name": "private_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The TLS private key matching the certificate provided.",
    "notImp": false
  },
  {
    "name": "trust_anchor_arn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The arn of the IAM Roles Anywhere trust anchor configured in your AWS account. A trust anchor in IAM Roles anywhere establishes trust between your certificate authority (CA) and AWS. See `Establish trust <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/getting-started.html#getting-started-step1>`_ for more details.",
    "notImp": false
  },
  {
    "name": "profile_arn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The IAM Roles Anywhere profile ARN configured in your AWS account.",
    "notImp": false
  },
  {
    "name": "role_session_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional role session name, used when identifying the role in subsequent AWS API calls.",
    "notImp": false
  },
  {
    "name": "session_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "An optional session duration, used when calculating the maximum time before vended credentials expire. This value cannot exceed the value configured in the IAM Roles Anywhere profile and the resultant session duration is calculate by the formula `here <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/authentication-create-session.html#credentials-object>`_. If no session duration is provided here, the session duration is sourced from the IAM Roles Anywhere profile.",
    "notImp": false
  }
] };

export const IAMRolesAnywhereCredentialProvider_SingleFields = [
  "role_arn",
  "trust_anchor_arn",
  "profile_arn",
  "role_session_name",
  "session_duration"
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
  },
  {
    "name": "iam_roles_anywhere_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IAMRolesAnywhereCredentialProvider",
    "enums": null,
    "comment": "The option to use `IAM Roles Anywhere <https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html>`_.",
    "notImp": false
  },
  {
    "name": "config_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigCredentialProvider",
    "enums": null,
    "comment": "The option to use credentials sourced from standard `AWS configuration files <https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html>`_.",
    "notImp": false
  },
  {
    "name": "container_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ContainerCredentialProvider",
    "enums": null,
    "comment": "The option to use credentials sourced from `container environment variables <https://docs.aws.amazon.com/sdkref/latest/guide/feature-container-credentials.html>`_.",
    "notImp": false
  },
  {
    "name": "environment_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnvironmentCredentialProvider",
    "enums": null,
    "comment": "The option to use credentials sourced from `environment variables <https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html>`_.",
    "notImp": false
  },
  {
    "name": "instance_profile_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "InstanceProfileCredentialProvider",
    "enums": null,
    "comment": "The option to use credentials sourced from an EC2 `Instance Profile <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html>`_.",
    "notImp": false
  },
  {
    "name": "assume_role_credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AssumeRoleCredentialProvider",
    "enums": null,
    "comment": "The option to use `STS:AssumeRole aka Role Chaining <https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html>`_.",
    "notImp": false
  }
] };

export const AwsCredentialProvider_SingleFields = [
  "custom_credential_provider_chain"
];

export const AssumeRoleCredentialProvider: OutType = { "AssumeRoleCredentialProvider": [
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
    "comment": "An optional role session name, used when identifying the role in subsequent AWS API calls. If not provided, the role session name will default to the current timestamp.",
    "notImp": false
  },
  {
    "name": "external_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional string value to use as the externalId",
    "notImp": false
  },
  {
    "name": "session_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "An optional duration, in seconds, of the role session. Minimum role duration is 900s (5 minutes) and maximum is 43200s (12 hours). If the session duration is not provided, the default will be determined using the `table described here <https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage-assume.html>`_.",
    "notImp": false
  },
  {
    "name": "credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsCredentialProvider",
    "enums": null,
    "comment": "The credential provider for signing the AssumeRole request. This is optional and if not set, it will be retrieved from the procedure described in `config_http_filters_aws_request_signing`. This list of credential providers cannot include an AssumeRole credential provider and if one is provided it will be ignored.",
    "notImp": false
  }
] };

export const AssumeRoleCredentialProvider_SingleFields = [
  "role_arn",
  "role_session_name",
  "external_id",
  "session_duration"
];