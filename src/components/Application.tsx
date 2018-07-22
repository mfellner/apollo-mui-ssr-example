import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Todo } from '../graphql/types';
import Container from './Container';
import Error from './Error';
import TodoContainer from './TodoContainer';
import TodoForm from './TodoForm';

const todoQuery = gql`
  query Todos {
    todos {
      id
      text
      completed
    }
    error @client {
      message
    }
  }
`;

type TodoData = {
  todos: Todo[];
  error: {
    message: string;
  };
};

export default class Application extends React.Component {
  public componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
      console.log('removed jss-server-side');
    }
  }

  public render() {
    return (
      <Container>
        <Query<TodoData> query={todoQuery}>
          {({ error, loading, data }) => {
            return (
              <Card>
                <CardHeader title="GraphQL To-Do" />
                <CardContent>
                  {(() => {
                    if (error) {
                      return <Error error={error} />;
                    }
                    if (loading) {
                      return <LinearProgress />;
                    }
                    return <TodoContainer todos={data!.todos} error={data!.error.message} />;
                  })()}
                </CardContent>
                <CardActions>
                  <TodoForm error={data!.error.message} />
                </CardActions>
              </Card>
            );
          }}
        </Query>
      </Container>
    );
  }
}
