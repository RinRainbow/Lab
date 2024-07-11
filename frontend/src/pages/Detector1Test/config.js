export const fields = {
  filename: {
    type: 'string',
    required: true,
  },
  label: {
    type: 'string',
    required: true,
  },
  family: {
    type: 'string',
  },
  CPUArchitecture: {
    type: 'string',
    required: true,
  },
  fileSize: {
    type: 'string',
    required: true,
  },
  tags: {
    type: 'tag',
    options: [
      { value: 'test', label: 'test', color: 'blue' },
      { value: 'train', label: 'train', color: 'green' },
    ],
    required: true,
  },
};
/* export const fields = {
  name: {
    type: 'string',
    disableForForm: true,
  },
};
*/