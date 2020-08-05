import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import UserPayload from './types/payload-user';
import TaskPayload from './types/payload-task';
import ApproachPayload from './types/payload-approach';

import UserInput from './types/input-user';
import AuthInput from './types/input-auth';
import TaskInput from './types/input-task';
import ApproachInput from './types/input-approach';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userCreate: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(UserInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.userCreate({ input });
      },
    },
    userLogin: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(AuthInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.userLogin({ input });
      },
    },
    taskCreate: {
      type: TaskPayload,
      args: {
        input: { type: new GraphQLNonNull(TaskInput) },
      },
      resolve: async (
        source,
        { input },
        { mutators, currentUser },
      ) => {
        return mutators.taskCreate({ input, currentUser });
      },
    },
    approachCreate: {
      type: ApproachPayload,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(ApproachInput) },
      },
      resolve: async (
        source,
        { taskId, input },
        { mutators, currentUser },
      ) => {
        return mutators.approachCreate({
          taskId,
          input,
          currentUser,
          mutators,
        });
      },
    },
  }),
});

export default MutationType;
