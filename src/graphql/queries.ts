import gql from 'graphql-tag';

export const todoQuery = gql`
  query Todos {
    todos {
      id
      text
      completed
    }
  }
`;

export const createTodoMutation = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

export const setTodoCompletedMutation = gql`
  mutation SetTodoCompleted($id: ID!, $completed: Boolean!) {
    setTodoCompleted(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

export const deleteTodoMutation = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
