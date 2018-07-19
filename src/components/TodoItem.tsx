import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { Todo } from '../graphql/types';

type Styles = 'strikeThrough';

const styles: StyleRulesCallback<Styles> = _ => ({
  strikeThrough: {
    textDecoration: 'line-through',
  },
});

const setTodoCompletedMutation = gql`
  mutation SetTodoCompleted($id: ID!, $completed: Boolean!) {
    setTodoCompleted(id: $id, completed: $completed) {
      id
      completed
      __typename
    }
  }
`;

const deleteTodoMutation = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

type OwnProps = { todo: Todo };
type Props = OwnProps & WithStyles<Styles>;

const TodoItem = ({ classes, todo }: Props) => {
  const textClass = todo.completed ? classes.strikeThrough : undefined;
  return (
    <Mutation<Todo, { id: string; completed: boolean }> mutation={setTodoCompletedMutation}>
      {setTodoCompleted => (
        <ListItem
          button
          dense
          divider
          disableGutters
          onClick={() =>
            setTodoCompleted({
              variables: { id: todo.id, completed: !todo.completed },
              // https://www.apollographql.com/docs/react/features/optimistic-ui.html#optimistic-basics
              optimisticResponse: {
                __typename: 'Mutation',
                setTodoCompleted: {
                  id: todo.id,
                  completed: todo.completed,
                  __typename: 'Todo',
                },
              },
            })
          }
        >
          <Checkbox checked={todo.completed} tabIndex={-1} disableRipple />
          <ListItemText disableTypography>
            <Typography className={textClass}>{todo.text}</Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            <Mutation<boolean, { id: string }> mutation={deleteTodoMutation}>
              {deleteTodo => (
                <IconButton aria-label="delete">
                  <DeleteIcon
                    onClick={() =>
                      deleteTodo({ variables: { id: todo.id }, refetchQueries: ['Todos'] })
                    }
                  />
                </IconButton>
              )}
            </Mutation>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </Mutation>
  );
};

export default withStyles(styles)<OwnProps>(TodoItem);
