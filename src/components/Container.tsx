import { StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';

type Styles = 'container' | 'wrapper';

const styles: StyleRulesCallback<Styles> = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  wrapper: {
    width: '100%',
    maxWidth: '600px',
  },
});

type Props = { children?: React.ReactNode } & WithStyles<Styles>;

const Container = ({ classes, children }: Props) => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>{children}</div>
    </div>
  );
};

export default withStyles(styles)<{}>(Container);
