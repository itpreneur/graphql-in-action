import React from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';

import Search from './Search';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';

const TASK_MAIN_LIST = gql`
  query taskMainList {
    taskMainList {
      id
      ...TaskSummary
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

const TASK_MAIN_LIST_CHANGED = gql`
  subscription taskMainListChanged {
    taskMainListChanged {
      id
      ...TaskSummary
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

export default function Home() {
  const { error, loading, data } = useQuery(TASK_MAIN_LIST);

  const { data: subscriptionData } = useSubscription(
    TASK_MAIN_LIST_CHANGED,
  );

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const newTask = subscriptionData
    ? subscriptionData.taskMainListChanged
    : null;

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        {newTask && (
          <TaskSummary
            key={newTask.id}
            task={newTask}
            link={true}
            isHighlighted={true}
          />
        )}
        {data.taskMainList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
