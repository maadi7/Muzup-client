import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = [
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "playlist-read-private",
].join(",");

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`,
    }),
  ],
  pages: {
    newUser: "/onboarding",
    error: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.providerAccountId = token.providerAccountId as string;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/onboarding`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
