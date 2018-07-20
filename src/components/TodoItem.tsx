import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { Mutation } from 'react-apollo';
import { deleteTodoMutation, setTodoCompletedMutation, todoQuery } from '../graphql/queries';
import { Todo } from '../graphql/types';

type Styles = 'strikeThrough';

const styles: StyleRulesCallback<Styles> = _ => ({
  strikeThrough: {
    textDecoration: 'line-through',
  },
});

type OwnProps = { todo: Todo };
type Props = OwnProps & WithStyles<Styles>;
type State = { deleting: boolean; error: Error | null };

class TodoItem extends React.Component<Props, State> {
  public readonly state: State = { deleting: false, error: null };

  public render() {
    const { classes, todo } = this.props;
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
              })
            }
          >
            <Checkbox checked={todo.completed} tabIndex={-1} disableRipple />
            <ListItemText disableTypography>
              <Typography className={textClass}>{todo.text}</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Mutation<boolean, { id: string }>
                mutation={deleteTodoMutation}
                update={(proxy, { errors }) => {
                  if (errors) {
                    return;
                  }
                  const { todos } = proxy.readQuery<{ todos: Todo[] }>({ query: todoQuery })!;
                  const deletedTodoIndex = todos.findIndex(({ id }) => id === todo.id);
                  if (deletedTodoIndex === -1) {
                    return;
                  }
                  const newData = {
                    todos: [
                      ...todos.slice(0, deletedTodoIndex),
                      ...todos.slice(deletedTodoIndex + 1),
                    ],
                  };
                  proxy.writeQuery({
                    query: todoQuery,
                    data: newData,
                  });
                }}
              >
                {deleteTodo => (
                  <IconButton aria-label="delete" disabled={this.state.deleting}>
                    <DeleteIcon
                      onClick={async () => {
                        this.setState({ deleting: true });
                        try {
                          const result = await deleteTodo({ variables: { id: todo.id } });
                          const error = result ? (result.errors ? result.errors[0] : null) : null;
                          if (error) {
                            this.setState({ deleting: false, error });
                          }
                        } catch (error) {
                          this.setState({ deleting: false, error });
                        }
                      }}
                    />
                  </IconButton>
                )}
              </Mutation>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </Mutation>
    );
  }
}

export default withStyles(styles)<OwnProps>(TodoItem);
