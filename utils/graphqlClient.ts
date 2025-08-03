import { getSdk } from "@/generated/graphql";
import { GraphQLClient } from "graphql-request";

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`;

// Function to create a new GraphQLClient instance with optional headers
const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
});
export const sdk = getSdk(graphqlClient);
