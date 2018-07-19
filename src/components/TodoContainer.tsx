import List from '@material-ui/core/List';
import React from 'react';
import { Todo } from '../graphql/types';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
};

export default ({ todos }: Props) => (
  <List dense disablePadding>{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}</List>
);
