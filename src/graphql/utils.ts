import { MutationFn, MutationOptions } from 'react-apollo';

export async function runMutation<TData, TVariables>(
  mutation: MutationFn<TData, TVariables>,
  options: MutationOptions<TData, TVariables>,
) {
  const result = await mutation(options);
  const error = result ? (result.errors ? result.errors[0] : null) : null;
  if (error) {
    throw error;
  }
}
