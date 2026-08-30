import { FieldValue } from 'firebase-admin/firestore';
import { checkLastComments } from '@/utils/firebase-utils';
import { hasProfanity } from '@/utils/profanity';

const MAX_LENGTH = 500;

/**
 * Validates text length, profanity, and user rate limits.
 */
export async function validateComment(text, userId) {
  if (text.length > MAX_LENGTH) {
    return {
      status: 400,
      message: `Comment must be under ${MAX_LENGTH} characters.`,
    };
  }
  if (hasProfanity(text)) {
    return {
      status: 400,
      message: `Your comment contains inappropriate words.`,
    };
  }
  const allowed = await checkLastComments(userId);
  if (!allowed) {
    return {
      status: 429,
      message: 'Too many comments. Please wait a minute.',
    };
  }
}

/**
 * Generates initial Firestore data payload for a comment or reply.
 */
export function buildComment(text, user, extraFields = {}) {
  const authorInfo = {
    authorId: user.userId,
    authorName: user.name,
    authorEmail: user.email,
    authorImage: user.image,
  };
  return {
    text,
    upvotes: 0,
    upvotedBy: [],
    reportedBy: [],
    deleted: false,
    createdAt: new Date().toISOString(),
    ...authorInfo,
    ...extraFields,
  };
}

/**
 * Normalizes comment or reply document for client consumption.
 */
export function getComment(doc, user, extraFields = {}) {
  const data = doc.data();
  return {
    id: doc.id,
    isAuthor: user && data.authorId === user.userId,
    upvoted: (data.upvotedBy || []).includes(user.email),
    upvotes: data.upvotes || 0,
    ...data,
    ...extraFields,
  };
}

/**
 * Handles author/admin permission check and soft-deletes a document.
 */
export async function deleteComment(doc, user, res) {
  const { userId, isAdmin } = user;
  const { authorId } = doc.data();

  if (authorId !== userId && !isAdmin) {
    return res.status(403).send('User forbidden');
  }
  await doc.ref.update({ deleted: true });
  res.status(200).send('success');
}

/**
 * Handles upvoting and reporting actions on a comment or reply document.
 */
export async function updateComment(doc, action, userEmail, res) {
  const { upvotedBy = [], reportedBy = [] } = doc.data();
  const docRef = doc.ref;

  switch (action) {
    case 'upvote': {
      if (upvotedBy.includes(userEmail)) {
        await docRef.update({
          upvotes: FieldValue.increment(-1),
          upvotedBy: FieldValue.arrayRemove(userEmail),
        });
      } else {
        await docRef.update({
          upvotes: FieldValue.increment(1),
          upvotedBy: FieldValue.arrayUnion(userEmail),
        });
      }
      return res.status(200).send('success');
    }
    case 'report': {
      if (reportedBy.includes(userEmail)) {
        return res.status(400).send('Already reported');
      }
      await docRef.update({
        reportedBy: FieldValue.arrayUnion(userEmail),
        deleted: reportedBy.length >= 3,
      });
      return res.status(200).send('success');
    }
    default:
      res.status(400).send('Invalid action');
  }
}
