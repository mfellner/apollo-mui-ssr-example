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
import { runMutation } from '../graphql/utils';

type Styles = 'strikeThrough';

const styles: StyleRulesCallback<Styles> = _ => ({
  strikeThrough: {
    textDecoration: 'line-through',
  },
});

type OwnProps = {
  todo: Todo;
  error: string;
};

type Props = OwnProps & WithStyles<Styles>;

type State = {
  deleting: boolean;
  toggling: boolean;
};

class TodoItem extends React.Component<Props, State> {
  public readonly state: State = {
    deleting: false,
    toggling: false,
  };

  public render() {
    const { classes, todo } = this.props;
    const textClass = todo.completed ? classes.strikeThrough : undefined;
    return (
      <Mutation<Todo, { id: string; completed: boolean }>
        mutation={gql`
          mutation SetTodoCompleted($id: ID!, $completed: Boolean!) {
            setTodoCompleted(id: $id, completed: $completed) {
              id
              completed
            }
          }
        `}
      >
        {setTodoCompleted => (
          <ListItem
            button
            dense
            divider
            disableGutters
            disabled={this.state.deleting}
            onClick={async () => {
              if (this.state.toggling) {
                return;
              }
              this.setState({ toggling: true });
              try {
                await runMutation(setTodoCompleted, {
                  variables: { id: todo.id, completed: !todo.completed },
                });
                this.setState({ toggling: false });
              } catch {
                this.setState({ toggling: false });
              }
            }}
          >
            <Checkbox
              checked={todo.completed}
              tabIndex={-1}
              disableRipple
              disabled={this.state.toggling}
            />
            <ListItemText disableTypography>
              <Typography className={textClass}>{todo.text}</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Mutation<boolean, { id: string }>
                mutation={gql`
                  mutation DeleteTodo($id: ID!) {
                    deleteTodo(id: $id)
                  }
                `}
                update={(proxy, { errors }) => {
                  if (errors) {
                    return;
                  }
                  const { todos } = proxy.readQuery<{ todos: Todo[] }>({
                    query: gql`
                      query Todos {
                        todos {
                          id
                          text
                          completed
                        }
                      }
                    `,
                  })!;
                  const newData = { todos: todos.filter(({ id }) => id !== todo.id) };
                  proxy.writeData({ data: newData });
                }}
              >
                {deleteTodo => (
                  <IconButton aria-label="delete" disabled={this.state.deleting}>
                    <DeleteIcon
                      onClick={async () => {
                        this.setState({ deleting: true });
                        try {
                          await runMutation(deleteTodo, { variables: { id: todo.id } });
                        } catch {
                          this.setState({ deleting: false });
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
