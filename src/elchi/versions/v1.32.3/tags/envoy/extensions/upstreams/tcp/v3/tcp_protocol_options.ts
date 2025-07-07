import {OutType} from '@/elchi/tags/tagsType';


export const TcpProtocolOptions: OutType = { "TcpProtocolOptions": [
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The idle timeout for the connection. The idle timeout is defined as the period in which the connection is not associated with a downstream connection. When the idle timeout is reached, the connection will be closed.\n\nIf not set, the default idle timeout is 10 minutes. To disable idle timeouts, explicitly set this to 0.\n\n:::warning\nDisabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP FIN packets, etc.",
    "notImp": false
  }
] };

export const TcpProtocolOptions_SingleFields = [
  "idle_timeout"
];