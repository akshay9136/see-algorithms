import {
  buildComment,
  deleteComment,
  getComment,
  updateComment,
  validateComment,
} from '@/utils/comment-utils';
import * as utils from '@/utils/firebase-utils';

const MAX_LENGTH = 500;

jest.mock('@/utils/firebase-utils', () => ({
  __esModule: true,
  default: {},
  checkLastComments: jest.fn(),
}));

describe('Comments API utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateComment', () => {
    test('returns error when comment exceeds MAX_LENGTH', async () => {
      const longText = 'a'.repeat(MAX_LENGTH + 1);
      const res = await validateComment(longText, 'user_1');
      expect(res).toEqual({
        status: 400,
        message: `Comment must be under ${MAX_LENGTH} characters.`,
      });
    });

    test('returns error when text contains profanity', async () => {
      const res = await validateComment('what the fuck', 'user_1');
      expect(res).toEqual({
        status: 400,
        message: 'Your comment contains inappropriate words.',
      });
    });

    test('returns error when comment exceeds rate limit', async () => {
      utils.checkLastComments.mockReturnValue(false);
      const res = await validateComment('Great explanation!', 'user_1');
      expect(res).toEqual({
        status: 429,
        message: 'Too many comments. Please wait a minute.',
      });
    });

    test('returns undefined when input is clean', async () => {
      utils.checkLastComments.mockReturnValue(true);
      const res = await validateComment('Awesome tree visual!', 'user_1');
      expect(res).toBeUndefined();
    });
  });

  describe('buildComment', () => {
    test('constructs comment data object with additional fields', () => {
      const user = {
        userId: 'github_12345',
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'https://example.com/avatar.png',
      };
      const result = buildComment('Nice work!', user, { pageId: 'quick-sort' });
      expect(result).toMatchObject({
        text: 'Nice work!',
        authorId: 'github_12345',
        authorName: 'Jane Doe',
        authorEmail: 'jane@example.com',
        authorImage: 'https://example.com/avatar.png',
        pageId: 'quick-sort',
        upvotes: 0,
        upvotedBy: [],
        reportedBy: [],
        deleted: false,
      });
    });
  });

  describe('getComment', () => {
    test('returns comment with additional flags when matching session user', () => {
      const mockDoc = {
        id: 'doc_1',
        data: () => ({
          authorId: 'github_123',
          upvotedBy: ['user@test.com'],
          upvotes: 1,
          text: 'Hello',
        }),
      };
      const user = { userId: 'github_123', email: 'user@test.com' };
      expect(getComment(mockDoc, user)).toEqual({
        id: 'doc_1',
        isAuthor: true,
        upvoted: true,
        upvotes: 1,
        authorId: 'github_123',
        upvotedBy: ['user@test.com'],
        text: 'Hello',
      });
    });
  });

  describe('deleteComment', () => {
    test('returns 403 when user is neither author nor admin', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ authorId: 'github_author' }),
        ref: { update: jest.fn() },
      };
      const user = { userId: 'github_other', isAdmin: false };
      await deleteComment(mockDoc, user, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith('User forbidden');
      expect(mockDoc.ref.update).not.toHaveBeenCalled();
    });

    test('updates deleted: true when user is author', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ authorId: 'github_author' }),
        ref: { update: jest.fn().mockResolvedValue() },
      };
      const user = { userId: 'github_author', isAdmin: false };
      await deleteComment(mockDoc, user, mockRes);
      expect(mockDoc.ref.update).toHaveBeenCalledWith({ deleted: true });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('success');
    });

    test('updates deleted: true when user is admin', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ authorId: 'github_author' }),
        ref: { update: jest.fn().mockResolvedValue() },
      };
      const user = { userId: 'github_admin', isAdmin: true };
      await deleteComment(mockDoc, user, mockRes);
      expect(mockDoc.ref.update).toHaveBeenCalledWith({ deleted: true });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('success');
    });
  });

  describe('updateComment', () => {
    test('toggles upvote on when not already upvoted', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ upvotedBy: [] }),
        ref: { update: jest.fn().mockResolvedValue() },
      };
      await updateComment(mockDoc, 'upvote', 'test@example.com', mockRes);
      expect(mockDoc.ref.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('success');
    });

    test('toggles upvote off when already upvoted', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ upvotedBy: ['test@example.com'] }),
        ref: { update: jest.fn().mockResolvedValue() },
      };
      await updateComment(mockDoc, 'upvote', 'test@example.com', mockRes);
      expect(mockDoc.ref.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('success');
    });

    test('returns 400 when user has already reported', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = {
        data: () => ({ reportedBy: ['test@example.com'] }),
        ref: { update: jest.fn() },
      };
      await updateComment(mockDoc, 'report', 'test@example.com', mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Already reported');
      expect(mockDoc.ref.update).not.toHaveBeenCalled();
    });

    test('reports and marks deleted: true if reports reach >= 3', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const reportedBy = ['user1@test.com', 'user2@test.com', 'user3@test.com'];
      const mockDoc = {
        data: () => ({ reportedBy }),
        ref: { update: jest.fn().mockResolvedValue() },
      };
      await updateComment(mockDoc, 'report', 'user4@test.com', mockRes);
      expect(mockDoc.ref.update).toHaveBeenCalledWith(
        expect.objectContaining({ deleted: true }),
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('success');
    });

    test('returns 400 for unknown action', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const mockDoc = { data: () => ({}), ref: { update: jest.fn() } };
      await updateComment(mockDoc, 'delete', 'test@example.com', mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Invalid action');
      expect(mockDoc.ref.update).not.toHaveBeenCalled();
    });
  });
});
