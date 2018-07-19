import Typography from '@material-ui/core/Typography';
import React from 'react';

export default ({ error }: { error: Error }) => (
  <Typography color="error">{error.message}</Typography>
);
