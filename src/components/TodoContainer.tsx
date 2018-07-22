import List from '@material-ui/core/List';
import React from 'react';
import { Todo } from '../graphql/types';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  error: string;
};

export default ({ todos, error }: Props) => (
  <List dense disablePadding>
    {todos.map(todo => <TodoItem key={todo.id} todo={todo} error={error} />)}
  </List>
);
