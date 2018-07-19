import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import React from 'react';

type Styles = 'form' | 'textField' | 'button';

const styles: StyleRulesCallback<Styles> = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
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
  onSubmit: (text: string) => Promise<Error | null>;
};
type Props = OwnProps & WithStyles<Styles>;
type State = {
  text: string;
  sending: boolean;
  error: Error | null;
};

class TodoForm extends React.Component<Props, State> {
  public readonly state: State = { text: '', sending: false, error: null };

  private onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target.value });
  };

  private onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ sending: true });
    const error = await this.props.onSubmit(this.state.text);
    if (error) {
      this.setState({ sending: false, error });
    } else {
      this.setState({ text: '', sending: false, error });
    }
  };

  public render() {
    const { classes } = this.props;
    const { sending, text } = this.state;
    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
        <TextField className={classes.textField} value={text} onChange={this.onTextChanged} />
        <Button
          type="submit"
          className={classes.button}
          color="primary"
          variant="contained"
          size="small"
          disabled={sending || !text}
        >
          {sending ? (
            <CircularProgress size={24} />
          ) : (
            <>
              add&nbsp;<PlaylistAddIcon />
            </>
          )}
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)<OwnProps>(TodoForm);
