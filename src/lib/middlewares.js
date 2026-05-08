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

    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Normalize userId as used in other parts of the app
    const userId = `${session.user.provider}_${session.user.id}`;

    // Call the original handler with userId
    return handler(req, res, { userId });
  };
}
