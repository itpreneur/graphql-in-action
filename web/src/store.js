import React from 'react';
import { useQuery, useApolloClient, gql } from '@apollo/client';

export const LOCAL_APP_STATE = gql`
  query localAppState {
    component @client {
      name
      props
    }
    user @client {
      username
      authToken
    }
  }
`;

export const useStore = () => {
  const client = useApolloClient();

  const useLocalAppState = (...stateMapper) => {
    const { data } = useQuery(LOCAL_APP_STATE);
    if (stateMapper.length === 1) {
      return data[stateMapper[0]];
    }
    return stateMapper.map((element) => data[element]);
  };

  const setLocalAppState = (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    const currentState = client.readQuery({
      query: LOCAL_APP_STATE,
    });
    const updateState = () => {
      client.writeQuery({
        query: LOCAL_APP_STATE,
        data: { ...currentState, ...newState },
      });
    };
    if (newState.user || newState.user === null) {
      client.onResetStore(updateState);
      client.resetStore();
    } else {
      updateState();
    }
  };

  const AppLink = ({ children, to, ...props }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setLocalAppState({
        component: { name: to, props },
      });
    };
    return (
      <a href={to} onClick={handleClick}>
        {children}
      </a>
    );
  };

  return {
    useLocalAppState,
    setLocalAppState,
    AppLink,
  };
};
