import { GraphQLEnumType } from 'graphql';

const ApproachDetailCategroy = new GraphQLEnumType({
  name: 'ApproachDetailCategory',
  values: {
    NOTE: {},
    EXPLANATION: {},
    WARNING: {},
  },
});

export default ApproachDetailCategroy;
