import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { createTodoMutation, todoQuery } from '../graphql/queries';
import { Todo } from '../graphql/types';
import Container from './Container';
import Error from './Error';
import TodoContainer from './TodoContainer';
import TodoForm from './TodoForm';

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
                return <TodoContainer todos={data!.todos} />;
              }}
            </Query>
          </CardContent>
          <CardActions>
            <Mutation<{ createTodo: Todo }, { text: string }>
              mutation={createTodoMutation}
              update={(proxy, { data, errors }) => {
                if (errors) {
                  return;
                }
                const oldData = proxy.readQuery<{ todos: Todo[] }>({ query: todoQuery });
                const newTodo = data!.createTodo!;
                const newData = { todos: [...oldData!.todos, newTodo] };
                proxy.writeQuery({
                  query: todoQuery,
                  data: newData,
                });
              }}
            >
              {createTodo => (
                <TodoForm
                  onSubmit={async text => {
                    const result = await createTodo({
                      variables: { text },
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
