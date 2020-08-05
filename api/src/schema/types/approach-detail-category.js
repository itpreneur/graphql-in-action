import { GraphQLEnumType } from 'graphql';

const ApproachDetailCategroy = new GraphQLEnumType({
  name: 'ApproachDetailCategory',
  values: {
    NOTE: { value: 'notes' },
    EXPLANATION: { value: 'explanations' },
    WARNING: { value: 'warnings' },
  },
});

export default ApproachDetailCategroy;
