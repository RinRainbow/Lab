export const fields = {
    modelName: {
        type: 'string',
        required: true,
    },
    detector: {
        type: 'string',
        required: true,
    },
    batchSize: {
        type: 'number',
        required: false,
    },
    trainRatio: {
        type: 'number',
        required: false,
    },
    validationRatio: {
        type: 'number',
        required: false,
    },
    learningRate: {
        type: 'number',
        required: false,
    },
    epochs: {
        type: 'number',
        required: false,
    },
    shard: {
        type: 'number',
        required: false,
    },
    slice: {
        type: 'number',
        required: false,
    },
  };
  /* export const fields = {
    name: {
      type: 'string',
      disableForForm: true,
    },
  };
  */