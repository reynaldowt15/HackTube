import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getItem } from "expo-secure-store";

const httpLink = new HttpLink({
    uri: "https://hacktube-api.reynaldowt15.id/",
});

const authLink = new SetContextLink(({ headers }) => {
    const token = getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client