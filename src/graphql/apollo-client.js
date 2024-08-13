import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const apolloClient = new ApolloClient({
    uri: 'https://see-algorithms.herokuapp.com/graphql',
    cache: new InMemoryCache(),
});

export default apolloClient;