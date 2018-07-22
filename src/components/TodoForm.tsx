import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { Todo } from '../graphql/types';
import { runMutation } from '../graphql/utils';

type Styles = 'form' | 'textField' | 'button';

const styles: StyleRulesCallback<Styles> = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing.unit * 1.5,
  },
  textField: {
    flex: 1,
  },
  button: {
    marginLeft: theme.spacing.unit * 2,
    minWidth: '76px',
  },
});

type OwnProps = {
  error: string;
};

type Props = OwnProps & WithStyles<Styles>;

type State = {
  text: string;
  sending: boolean;
};

class TodoForm extends React.Component<Props, State> {
  public readonly state: State = {
    text: '',
    sending: false,
  };

  private onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target.value });
  };

  public render() {
    const { classes, error } = this.props;
    const { sending, text } = this.state;
    return (
      <form className={classes.form}>
        <TextField
          error={!!error}
          label={error || 'enter text…'}
          disabled={sending}
          className={classes.textField}
          value={text}
          onChange={this.onTextChanged}
        />
        <Mutation<{ createTodo: Todo }, { text: string }>
          mutation={gql`
            mutation CreateTodo($text: String!) {
              createTodo(text: $text) {
                id
                text
                completed
              }
            }
          `}
          update={(proxy, { data, errors }) => {
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
            const newTodo = data!.createTodo!;
            const newData = { todos: [...todos, newTodo] };
            proxy.writeData({ data: newData });
          }}
        >
          {createTodo => (
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              size="small"
              disabled={sending || !text}
              onClick={async () => {
                this.setState({ sending: true });
                try {
                  await runMutation(createTodo, { variables: { text } });
                  this.setState({ text: '', sending: false });
                } catch {
                  this.setState({ sending: false });
                }
              }}
            >
              {sending ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  add&nbsp;<PlaylistAddIcon />
                </>
              )}
            </Button>
          )}
        </Mutation>
      </form>
    );
  }
}

export default withStyles(styles)<OwnProps>(TodoForm);
