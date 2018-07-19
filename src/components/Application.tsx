import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import gql from 'graphql-tag';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
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
  }
`;

const createTodoMutation = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

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
        <Card>
          <CardHeader title="TODOs" />
          <CardContent>
            <Query<{ todos: Todo[] }> query={todoQuery}>
              {({ error, loading, data }) => {
                if (error) {
                  return <Error error={error} />;
                }
                if (loading) {
                  return <LinearProgress />;
                }
                const { todos = [] } = data || {};
                return <TodoContainer todos={todos} />;
              }}
            </Query>
          </CardContent>
          <CardActions>
            <Mutation<Todo, { text: string }> mutation={createTodoMutation}>
              {createTodo => (
                <TodoForm
                  onSubmit={async text => {
                    const result = await createTodo({
                      variables: { text },
                      refetchQueries: ['Todos'],
                    });
                    return result ? (result.errors ? result.errors[0] : null) : null;
                  }}
                />
              )}
            </Mutation>
          </CardActions>
        </Card>
      </Container>
    );
  }
}
