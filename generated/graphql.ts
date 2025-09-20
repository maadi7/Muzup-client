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

export type CommentInput = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
  replyToUserId?: InputMaybe<Scalars['ID']['input']>;
  taggedUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FriendReqeust = {
  __typename?: 'FriendReqeust';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  recieverId: User;
  senderId: User;
  status: RequestStatus;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptRequest: Scalars['Boolean']['output'];
  addComment: Scalars['Boolean']['output'];
  addReaction: Scalars['Boolean']['output'];
  blockUser: Scalars['Boolean']['output'];
  createPost: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  editProfile: Scalars['Boolean']['output'];
  removeReaction: Scalars['Boolean']['output'];
  replyToComment: Scalars['Boolean']['output'];
  saveUserTokens: Scalars['Boolean']['output'];
  sendRequest: Scalars['Boolean']['output'];
  userSingIn: Scalars['Boolean']['output'];
};


export type MutationAcceptRequestArgs = {
  id: Scalars['String']['input'];
};


export type MutationAddCommentArgs = {
  input: CommentInput;
};


export type MutationAddReactionArgs = {
  emoji: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationBlockUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationEditProfileArgs = {
  input: UserProfileInput;
};


export type MutationRemoveReactionArgs = {
  emoji: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationReplyToCommentArgs = {
  input: CommentInput;
};


export type MutationSaveUserTokensArgs = {
  input: UserToken;
};


export type MutationSendRequestArgs = {
  id: Scalars['String']['input'];
};


export type MutationUserSingInArgs = {
  input: UserSignInInput;
};

export type PaginatedUserPosts = {
  __typename?: 'PaginatedUserPosts';
  page: Scalars['Float']['output'];
  posts: Array<UserPostInfo>;
  totalCount: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID']['output'];
  caption?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  postType?: Maybe<PostType>;
  postUrl?: Maybe<Scalars['String']['output']>;
  reactions?: Maybe<Array<PostReaction>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user: User;
  visibleTo: Array<User>;
  waveUrl?: Maybe<Scalars['String']['output']>;
};

export type PostInput = {
  caption?: InputMaybe<Scalars['String']['input']>;
  postType?: InputMaybe<PostType>;
  postUrl?: InputMaybe<Scalars['String']['input']>;
  visibleTo?: InputMaybe<Array<Scalars['String']['input']>>;
  waveUrl?: InputMaybe<Scalars['String']['input']>;
};

export type PostReaction = {
  __typename?: 'PostReaction';
  emoji: Scalars['String']['output'];
  users: Array<User>;
};

/** Enum For Type of Post i.e Image, Audio, Video */
export enum PostType {
  Audio = 'Audio',
  Image = 'Image',
  Video = 'Video'
}

export type Query = {
  __typename?: 'Query';
  checkById: Scalars['Boolean']['output'];
  getPostById: Post;
  getTimelinePosts: Array<Post>;
  getUserProfileInfo: UserProfileInfo;
  meUser?: Maybe<User>;
  searchUsers: Array<User>;
};


export type QueryCheckByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPostByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetTimelinePostsArgs = {
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetUserProfileInfoArgs = {
  id: Scalars['String']['input'];
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
};


export type QuerySearchUsersArgs = {
  query: Scalars['String']['input'];
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

/** Enum For Request status of followers */
export enum RequestStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

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
  profilePic: Scalars['String']['output'];
  recentlyPlayed?: Maybe<Array<RecentlyPlayed>>;
  relistDate?: Maybe<Array<Scalars['DateTimeISO']['output']>>;
  requestedTo?: Maybe<FriendReqeust>;
  spotifyAccessToken: Scalars['String']['output'];
  spotifyId: Scalars['String']['output'];
  spotifyRefreshToken: Scalars['String']['output'];
  topArtists?: Maybe<Array<Artist>>;
  topTracks?: Maybe<Array<Track>>;
  type?: Maybe<UserType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserPostInfo = {
  __typename?: 'UserPostInfo';
  _id: Scalars['ID']['output'];
  commentsCount: Scalars['Float']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  postUrl?: Maybe<Scalars['String']['output']>;
  reactionsCount: Scalars['Float']['output'];
  waveUrl?: Maybe<Scalars['String']['output']>;
};

export type UserProfileInfo = {
  __typename?: 'UserProfileInfo';
  bio?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  followersCount: Scalars['Float']['output'];
  followingsCount: Scalars['Float']['output'];
  lastName: Scalars['String']['output'];
  posts: PaginatedUserPosts;
  profilePic?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type UserProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  profilePic?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
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

export type AddCommentMutationVariables = Exact<{
  input: CommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: boolean };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type ReplyToCommentMutationVariables = Exact<{
  input: CommentInput;
}>;


export type ReplyToCommentMutation = { __typename?: 'Mutation', replyToComment: boolean };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: boolean };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type AddReactionMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  emoji: Scalars['String']['input'];
}>;


export type AddReactionMutation = { __typename?: 'Mutation', addReaction: boolean };

export type RemoveReactionMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  emoji: Scalars['String']['input'];
}>;


export type RemoveReactionMutation = { __typename?: 'Mutation', removeReaction: boolean };

export type GetTimelinePostsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
  limit: Scalars['Float']['input'];
}>;


export type GetTimelinePostsQuery = { __typename?: 'Query', getTimelinePosts: Array<{ __typename?: 'Post', _id: string, caption?: string | null, postType?: PostType | null, postUrl?: string | null, waveUrl?: string | null, createdAt: any, updatedAt: any, user: { __typename?: 'User', _id: string, username?: string | null, profilePic: string }, reactions?: Array<{ __typename?: 'PostReaction', emoji: string, users: Array<{ __typename?: 'User', _id: string, username?: string | null }> }> | null, visibleTo: Array<{ __typename?: 'User', _id: string, username?: string | null }> }> };

export type GetPostByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById: { __typename?: 'Post', _id: string, caption?: string | null, postType?: PostType | null, postUrl?: string | null, waveUrl?: string | null, createdAt: any, updatedAt: any, user: { __typename?: 'User', _id: string, username?: string | null, profilePic: string, isPrivate?: boolean | null }, reactions?: Array<{ __typename?: 'PostReaction', emoji: string, users: Array<{ __typename?: 'User', _id: string, username?: string | null }> }> | null, visibleTo: Array<{ __typename?: 'User', _id: string, username?: string | null }> } };

export type MeUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MeUserQuery = { __typename?: 'Query', meUser?: { __typename?: 'User', _id: string, username?: string | null, firstName?: string | null, lastName?: string | null, spotifyId: string, email: string, bio?: string | null, dob?: any | null, type?: UserType | null, isAccountVerified?: boolean | null, isProfileCompleted: boolean, deviceDetails?: string | null, intro: boolean, instagramLink?: string | null, profilePic: string, followers?: Array<string> | null, followings?: Array<string> | null, blockedByMe?: Array<string> | null, isPrivate?: boolean | null, topArtists?: Array<{ __typename?: 'Artist', name?: string | null }> | null, topTracks?: Array<{ __typename?: 'Track', name: string }> | null, recentlyPlayed?: Array<{ __typename?: 'RecentlyPlayed', name: string }> | null } | null };

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

export type GetUserProfileInfoQueryVariables = Exact<{
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  limit: Scalars['Float']['input'];
}>;


export type GetUserProfileInfoQuery = { __typename?: 'Query', getUserProfileInfo: { __typename?: 'UserProfileInfo', username: string, firstName: string, lastName: string, bio?: string | null, profilePic?: string | null, followersCount: number, followingsCount: number, posts: { __typename?: 'PaginatedUserPosts', totalCount: number, page: number, totalPages: number, posts: Array<{ __typename?: 'UserPostInfo', _id: string, postUrl?: string | null, waveUrl?: string | null, createdAt: any, reactionsCount: number, commentsCount: number }> } } };


export const AddCommentDocument = gql`
    mutation addComment($input: CommentInput!) {
  addComment(input: $input)
}
    `;
export const DeleteCommentDocument = gql`
    mutation deleteComment($commentId: String!) {
  deleteComment(commentId: $commentId)
}
    `;
export const ReplyToCommentDocument = gql`
    mutation replyToComment($input: CommentInput!) {
  replyToComment(input: $input)
}
    `;
export const CreatePostDocument = gql`
    mutation createPost($input: PostInput!) {
  createPost(input: $input)
}
    `;
export const DeletePostDocument = gql`
    mutation deletePost($postId: String!) {
  deletePost(postId: $postId)
}
    `;
export const AddReactionDocument = gql`
    mutation addReaction($postId: String!, $emoji: String!) {
  addReaction(postId: $postId, emoji: $emoji)
}
    `;
export const RemoveReactionDocument = gql`
    mutation removeReaction($postId: String!, $emoji: String!) {
  removeReaction(postId: $postId, emoji: $emoji)
}
    `;
export const GetTimelinePostsDocument = gql`
    query getTimelinePosts($page: Float!, $limit: Float!) {
  getTimelinePosts(page: $page, limit: $limit) {
    _id
    caption
    postType
    postUrl
    waveUrl
    createdAt
    updatedAt
    user {
      _id
      username
      profilePic
    }
    reactions {
      emoji
      users {
        _id
        username
      }
    }
    visibleTo {
      _id
      username
    }
  }
}
    `;
export const GetPostByIdDocument = gql`
    query getPostById($id: String!) {
  getPostById(id: $id) {
    _id
    caption
    postType
    postUrl
    waveUrl
    createdAt
    updatedAt
    user {
      _id
      username
      profilePic
      isPrivate
    }
    reactions {
      emoji
      users {
        _id
        username
      }
    }
    visibleTo {
      _id
      username
    }
  }
}
    `;
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
    profilePic
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
export const GetUserProfileInfoDocument = gql`
    query getUserProfileInfo($id: String!, $page: Float!, $limit: Float!) {
  getUserProfileInfo(id: $id, page: $page, limit: $limit) {
    username
    firstName
    lastName
    bio
    profilePic
    followersCount
    followingsCount
    posts {
      posts {
        _id
        postUrl
        waveUrl
        createdAt
        reactionsCount
        commentsCount
      }
      totalCount
      page
      totalPages
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addComment(variables: AddCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCommentMutation>({ document: AddCommentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'addComment', 'mutation', variables);
    },
    deleteComment(variables: DeleteCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCommentMutation>({ document: DeleteCommentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'deleteComment', 'mutation', variables);
    },
    replyToComment(variables: ReplyToCommentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReplyToCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReplyToCommentMutation>({ document: ReplyToCommentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'replyToComment', 'mutation', variables);
    },
    createPost(variables: CreatePostMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePostMutation>({ document: CreatePostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'createPost', 'mutation', variables);
    },
    deletePost(variables: DeletePostMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePostMutation>({ document: DeletePostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'deletePost', 'mutation', variables);
    },
    addReaction(variables: AddReactionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddReactionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddReactionMutation>({ document: AddReactionDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'addReaction', 'mutation', variables);
    },
    removeReaction(variables: RemoveReactionMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoveReactionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveReactionMutation>({ document: RemoveReactionDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'removeReaction', 'mutation', variables);
    },
    getTimelinePosts(variables: GetTimelinePostsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetTimelinePostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTimelinePostsQuery>({ document: GetTimelinePostsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getTimelinePosts', 'query', variables);
    },
    getPostById(variables: GetPostByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetPostByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostByIdQuery>({ document: GetPostByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getPostById', 'query', variables);
    },
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
    },
    getUserProfileInfo(variables: GetUserProfileInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetUserProfileInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserProfileInfoQuery>({ document: GetUserProfileInfoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getUserProfileInfo', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;