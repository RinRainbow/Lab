export const fields = {
    modelName: {
        type: 'string',
        required: true,
    },
    datasetId: {
        type: 'string',
        required: true,
    },
    datasetname: {
        type: 'string',
        required: true,
    },
    detector: {
        type: 'string',
        required: true,
    },
    status:{
        type: 'tag',
        options: [
            { value: 'untrained', label: 'untrained', color: 'default' },
            { value: 'training', label: 'training', color: 'processing' },
            { value: 'trained', label: 'trained', color: 'success' },
            { value: 'predicting', label: 'predicting', color: 'processing' },
            { value: 'unlearning', label: 'unlearning', color: 'processing' },
            { value: 'error', label: 'error', color: 'error' },
        ],
        required: false,
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

    rotation:{
        type: 'number[]',
        required: false,
    },
    widthShift:{
        type: 'number',
        required: false,
    },
    heightShift:{
        type: 'number',
        required: false,
    },
    zoom:{
        type: 'number[]',
        required: false,
    },
    shear:{
        type: 'number[]',
        required: false,
    },
    fill:{
        type: 'string',
        required: false,
    },
    horizontalFlip:{
        type: 'number',
        required: false,
    },

    hiddenDim:{
        type: 'number',
        required: false,
    },
    dropoutValue:{
        type: 'number',
        required: false,
    },
    preprocessMethod:{
        type: 'string',
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