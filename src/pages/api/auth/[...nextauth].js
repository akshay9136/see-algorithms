import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import db from '@/utils/firebase-utils';
import { INITIAL_CREDITS } from '@/utils/constants';

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
      session.user.analyticsAuthTime = token.analyticsAuthTime;
      session.user.analyticsNewAccount = token.analyticsNewAccount === true;
      const { ADMIN_EMAILS } = process.env;
      session.user.isAdmin = ADMIN_EMAILS?.split(',').includes(
        session.user.email,
      );
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.analyticsAuthTime = Date.now();
        try {
          const record = await db
            .collection('users')
            .doc(`${account.provider}_${token.sub}`)
            .get();
          token.analyticsNewAccount = !record.exists;
        } catch {
          token.analyticsNewAccount = false;
        }
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
            image: user.image || null,
            createdAt: new Date().toISOString(),
            credits: INITIAL_CREDITS,
          });
        } else {
          await userRef.update({
            name: user.name || '',
            image: user.image || null,
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
