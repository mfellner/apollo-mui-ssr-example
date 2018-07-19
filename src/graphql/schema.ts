import { GraphQLSchema } from 'graphql';
import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';
import getResolvers from './resolvers';

const schema = gql`
  type Todo {
    id: ID!
    text: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]
    todo(id: String!): Todo
  }

  type Mutation {
    createTodo(text: String!): Todo
    setTodoCompleted(id: ID!, completed: Boolean!): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

export function getSchema(): GraphQLSchema {
  return makeExecutableSchema({
    typeDefs: schema,
    resolvers: getResolvers(),
  });
}
