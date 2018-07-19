import { IResolvers } from 'graphql-tools';
import uuidv4 from 'uuid/v4';
import { Todo } from './types';

const todos: { [id: string]: Todo } = {
  '9e6ab33b-6f29-4e8d-9148-e29d33fa67ec': {
    id: '9e6ab33b-6f29-4e8d-9148-e29d33fa67ec',
    text: 'write GraphQL blog post',
    completed: false,
  },
  '8df3ba86-3a66-4c3e-9dba-39be2e583b0d': {
    id: '8df3ba86-3a66-4c3e-9dba-39be2e583b0d',
    text: 'learn Rust',
    completed: false,
  },
};

export default function getResolvers(): IResolvers {
  return {
    Query: {
      todos: (source, args, context, info): Todo[] => Object.values(todos),
      todo: (source, { id }, context, info): Todo | undefined => todos[id],
    },
    Mutation: {
      createTodo: (source, { text }, context, info) => {
        const todo: Todo = {
          id: uuidv4(),
          text,
          completed: false,
        };
        todos[todo.id] = todo;
        return todo;
      },
      setTodoCompleted: (source, { id, completed }, context, info) => {
        const todo = todos[id];
        if (todo) {
          todo.completed = completed;
          return todo;
        }
      },
      deleteTodo: (source, { id }, context, info) => {
        delete todos[id];
        return true;
      },
    },
  };
}
