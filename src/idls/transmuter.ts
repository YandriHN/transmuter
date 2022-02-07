export type UtransmuterIDL =
{
  "version": "0.1.0",
  "name": "transmuter",
  "instructions": [
    {
      "name": "initMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "beginMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "completeMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "cancelMutation",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Mutation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u16"
          },
          {
            "name": "inTokenA",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "inTokenB",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "inTokenC",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "outTokenA",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "outTokenB",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "outTokenC",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "sinkSettings",
            "type": {
              "defined": "SinkSettings"
            }
          },
          {
            "name": "timeSettings",
            "type": {
              "defined": "TimeSettings"
            }
          },
          {
            "name": "priceSettings",
            "type": {
              "defined": "PriceSettings"
            }
          },
          {
            "name": "updateMetadata",
            "type": "bool"
          },
          {
            "name": "reversible",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InTokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gemBank",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "OutTokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "source",
            "type": {
              "defined": "OutTokenSource"
            }
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SinkSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "action",
            "type": {
              "defined": "SinkAction"
            }
          },
          {
            "name": "destination",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "TimeSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timeToMutateSec",
            "type": "u64"
          },
          {
            "name": "timeToCancelSec",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PriceSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paid",
            "type": "bool"
          },
          {
            "name": "payEveryTime",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "OutTokenSource",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Mint"
          },
          {
            "name": "Prefunded"
          }
        ]
      }
    },
    {
      "name": "SinkAction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Burn"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "Preserve"
          }
        ]
      }
    }
  ]
}
;
export const UtransmuterJSON: UtransmuterIDL =
{
  "version": "0.1.0",
  "name": "transmuter",
  "instructions": [
    {
      "name": "initMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "beginMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "completeMutation",
      "accounts": [],
      "args": []
    },
    {
      "name": "cancelMutation",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Mutation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u16"
          },
          {
            "name": "inTokenA",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "inTokenB",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "inTokenC",
            "type": {
              "defined": "InTokenConfig"
            }
          },
          {
            "name": "outTokenA",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "outTokenB",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "outTokenC",
            "type": {
              "defined": "OutTokenConfig"
            }
          },
          {
            "name": "sinkSettings",
            "type": {
              "defined": "SinkSettings"
            }
          },
          {
            "name": "timeSettings",
            "type": {
              "defined": "TimeSettings"
            }
          },
          {
            "name": "priceSettings",
            "type": {
              "defined": "PriceSettings"
            }
          },
          {
            "name": "updateMetadata",
            "type": "bool"
          },
          {
            "name": "reversible",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InTokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gemBank",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "OutTokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "source",
            "type": {
              "defined": "OutTokenSource"
            }
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SinkSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "action",
            "type": {
              "defined": "SinkAction"
            }
          },
          {
            "name": "destination",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "TimeSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timeToMutateSec",
            "type": "u64"
          },
          {
            "name": "timeToCancelSec",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PriceSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paid",
            "type": "bool"
          },
          {
            "name": "payEveryTime",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "OutTokenSource",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Mint"
          },
          {
            "name": "Prefunded"
          }
        ]
      }
    },
    {
      "name": "SinkAction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Burn"
          },
          {
            "name": "Transfer"
          },
          {
            "name": "Preserve"
          }
        ]
      }
    }
  ]
}
;
import { generateErrorMap } from '@saberhq/anchor-contrib';
export const UtransmuterErrors = generateErrorMap(UtransmuterJSON);
