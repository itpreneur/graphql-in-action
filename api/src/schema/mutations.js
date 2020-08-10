import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import { pubsub } from '../pubsub';

import UserPayload from './types/payload-user';
import TaskPayload from './types/payload-task';
import ApproachPayload from './types/payload-approach';
import UserDeletePayload from './types/payload-user-delete';

import UserInput from './types/input-user';
import AuthInput from './types/input-auth';
import TaskInput from './types/input-task';
import ApproachInput from './types/input-approach';
import ApproachVoteInput from './types/input-approach-vote';

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
        const { errors, task } = await mutators.taskCreate({
          input,
          currentUser,
        });
        if (errors.length === 0 && !task.isPrivate) {
          pubsub.publish(`TASK_MAIN_LIST_CHANGED`, {
            newTask: task,
          });
        }
        return { errors, task };
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
    approachVote: {
      type: ApproachPayload,
      args: {
        approachId: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(ApproachVoteInput) },
      },
      resolve: async (
        source,
        { approachId, input },
        { mutators },
      ) => {
        const { errors, approach } = await mutators.approachVote({
          approachId,
          input,
        });
        if (errors.length === 0) {
          pubsub.publish(`VOTE_CHANGED_${approach.taskId}`, {
            updatedApproach: approach,
          });
        }
        return { errors, approach };
      },
    },
    userDelete: {
      type: UserDeletePayload,
      resolve: async (source, args, { mutators, currentUser }) => {
        return mutators.userDelete({ currentUser });
      },
    },
  }),
});

export default MutationType;
