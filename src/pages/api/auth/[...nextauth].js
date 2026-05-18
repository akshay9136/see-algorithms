import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import db from '@/lib/firebase-utils';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.provider = token.provider;
      session.user.isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(
        session.user.email,
      );
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      try {
        const userId = `${account.provider}_${user.id}`;
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
          await userRef.set({
            name: user.name || '',
            email: user.email || '',
            createdAt: new Date().toISOString(),
          });
        } else {
          await userRef.update({
            name: user.name || '',
            image: user.image || '',
            lastSignIn: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Failed to save user info:', err.message);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
