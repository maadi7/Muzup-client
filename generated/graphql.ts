import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type Album = {
  __typename?: 'Album';
  album_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Artist = {
  __typename?: 'Artist';
  followers?: Maybe<Scalars['Float']['output']>;
  genres?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  saveUserTokens: Scalars['Boolean']['output'];
  userSingIn: Scalars['Boolean']['output'];
};


export type MutationSaveUserTokensArgs = {
  input: UserToken;
};


export type MutationUserSingInArgs = {
  input: UserSignInInput;
};

export type Query = {
  __typename?: 'Query';
  checkById: Scalars['Boolean']['output'];
  meUser?: Maybe<User>;
  verifyOtpForPayout: Scalars['String']['output'];
};


export type QueryCheckByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryVerifyOtpForPayoutArgs = {
  email: Scalars['String']['input'];
  emailOtp: Scalars['String']['input'];
  key: Scalars['String']['input'];
  number: Scalars['String']['input'];
  numberOtp: Scalars['String']['input'];
};

export type RecentlyPlayed = {
  __typename?: 'RecentlyPlayed';
  album?: Maybe<Album>;
  artists?: Maybe<Array<TrackArtist>>;
  id: Scalars['String']['output'];
  is_local?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  played_at?: Maybe<Scalars['DateTimeISO']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  preview_url?: Maybe<Scalars['String']['output']>;
  track_number?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Track = {
  __typename?: 'Track';
  album?: Maybe<Album>;
  artists?: Maybe<Array<TrackArtist>>;
  id: Scalars['String']['output'];
  is_local?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Float']['output']>;
  preview_url?: Maybe<Scalars['String']['output']>;
  track_number?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type TrackArtist = {
  __typename?: 'TrackArtist';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  blockedByMe?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTimeISO']['output'];
  delistDate?: Maybe<Array<Scalars['DateTimeISO']['output']>>;
  deviceDetails?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  firstLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Array<Scalars['String']['output']>>;
  followings?: Maybe<Array<Scalars['String']['output']>>;
  instagramLink?: Maybe<Scalars['String']['output']>;
  intro: Scalars['Boolean']['output'];
  isAccountVerified?: Maybe<Scalars['Boolean']['output']>;
  isPrivate?: Maybe<Scalars['Boolean']['output']>;
  isProfileCompleted: Scalars['Boolean']['output'];
  lastLoggedIn?: Maybe<Scalars['DateTimeISO']['output']>;
  lastLoggedOut?: Maybe<Scalars['DateTimeISO']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  recentlyPlayed?: Maybe<Array<RecentlyPlayed>>;
  relistDate?: Maybe<Array<Scalars['DateTimeISO']['output']>>;
  spotifyAccessToken: Scalars['String']['output'];
  spotifyId: Scalars['String']['output'];
  spotifyRefreshToken: Scalars['String']['output'];
  topArtists?: Maybe<Array<Artist>>;
  topTracks?: Maybe<Array<Track>>;
  type?: Maybe<UserType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserSignInInput = {
  InstaId?: InputMaybe<Scalars['String']['input']>;
  aToken: Scalars['String']['input'];
  dob: Scalars['DateTimeISO']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isArtist?: Scalars['Boolean']['input'];
  lastName: Scalars['String']['input'];
  profilePic?: InputMaybe<Scalars['String']['input']>;
  rToken: Scalars['String']['input'];
  spotyifyId: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type UserToken = {
  aToken: Scalars['String']['input'];
  email: Scalars['String']['input'];
  rToken: Scalars['String']['input'];
  spotyifyId: Scalars['String']['input'];
};

/** Enum For Type of User Artist or User */
export enum UserType {
  Artist = 'Artist',
  User = 'User'
}

export type MeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserQuery = { __typename?: 'Query', meUser?: { __typename?: 'User', _id: string, username?: string | null, firstName?: string | null, lastName?: string | null, spotifyId: string, email: string, bio?: string | null, dob?: any | null, type?: UserType | null, isAccountVerified?: boolean | null, isProfileCompleted: boolean, deviceDetails?: string | null, intro: boolean, instagramLink?: string | null, followers?: Array<string> | null, followings?: Array<string> | null, blockedByMe?: Array<string> | null, isPrivate?: boolean | null, topArtists?: Array<{ __typename?: 'Artist', name?: string | null }> | null, topTracks?: Array<{ __typename?: 'Track', name: string }> | null, recentlyPlayed?: Array<{ __typename?: 'RecentlyPlayed', name: string }> | null } | null };

export type SaveUserTokenMutationVariables = Exact<{
  input: UserToken;
}>;


export type SaveUserTokenMutation = { __typename?: 'Mutation', saveUserTokens: boolean };

export type UserSingInMutationVariables = Exact<{
  input: UserSignInInput;
}>;


export type UserSingInMutation = { __typename?: 'Mutation', userSingIn: boolean };

export type CheckByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CheckByIdQuery = { __typename?: 'Query', checkById: boolean };


export const MeUserDocument = gql`
    query meUser {
  meUser {
    _id
    username
    firstName
    lastName
    spotifyId
    email
    bio
    dob
    type
    isAccountVerified
    isProfileCompleted
    deviceDetails
    intro
    instagramLink
    topArtists {
      name
    }
    topTracks {
      name
    }
    recentlyPlayed {
      name
    }
    followers
    followings
    blockedByMe
    isPrivate
  }
}
    `;
export const SaveUserTokenDocument = gql`
    mutation saveUserToken($input: UserToken!) {
  saveUserTokens(input: $input)
}
    `;
export const UserSingInDocument = gql`
    mutation userSingIn($input: UserSignInInput!) {
  userSingIn(input: $input)
}
    `;
export const CheckByIdDocument = gql`
    query checkById($id: String!) {
  checkById(id: $id)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    meUser(variables?: MeUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MeUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeUserQuery>({ document: MeUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'meUser', 'query', variables);
    },
    saveUserToken(variables: SaveUserTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SaveUserTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SaveUserTokenMutation>({ document: SaveUserTokenDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'saveUserToken', 'mutation', variables);
    },
    userSingIn(variables: UserSingInMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UserSingInMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserSingInMutation>({ document: UserSingInDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'userSingIn', 'mutation', variables);
    },
    checkById(variables: CheckByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CheckByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckByIdQuery>({ document: CheckByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'checkById', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;