import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Higher-order function to protect API routes.
 * It checks for a valid session and returns 401 if not authenticated.
 * It also provides a normalized userId to the handler.
 */
export function withAuth(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
      return res.status(401).send('Unauthorized');
    }
    const user = {
      ...session.user,
      userId: `${session.user.provider}_${session.user.id}`,
    };
    // Call the original handler with user object
    return handler(req, res, user);
  };
}

export function withOptionalAuth(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
      return handler(req, res, null);
    }
    const user = {
      ...session.user,
      userId: `${session.user.provider}_${session.user.id}`,
    };
    return handler(req, res, user);
  };
}
