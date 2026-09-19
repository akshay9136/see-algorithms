import linkedList from '@/helpers/linkedList';
import * as utils from '@/common/utils';

jest.mock('@/common/utils', () => ({
  showError: jest.fn(),
  sleep: jest.fn().mockResolvedValue(),
  sound: jest.fn(),
}));

jest.mock('jquery', () => {
  const m$ = jest.fn(() => ({ css: jest.fn() }));
  return m$;
});

describe('linkedList helper', () => {
  let list, mockFns;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFns = {
      tx: jest.fn().mockResolvedValue(),
      ty: jest.fn().mockResolvedValue(),
      txy: jest.fn().mockResolvedValue(),
      bgcolor: jest.fn().mockResolvedValue(),
      animate: jest.fn(),
    };
    list = linkedList(mockFns);
  });

  test('insertAtHead into empty list', async () => {
    await list.insertAtHead(10);
    expect(mockFns.txy).toHaveBeenCalled();
    expect(utils.sound).toHaveBeenCalledWith('pop');
  });

  test('insertAtTail', async () => {
    await list.insertAtTail(20);
    expect(mockFns.txy).toHaveBeenCalled();
    expect(mockFns.bgcolor).toHaveBeenCalled();
  });

  test('insertAt into bounds', async () => {
    await list.insertAtTail(10);
    await list.insertAtTail(20);

    await list.insertAt(15, 1);
    expect(mockFns.tx).toHaveBeenCalled();
    expect(mockFns.animate).toHaveBeenCalled();
  });

  test('insertAt out of bounds', async () => {
    await list.insertAt(10, 5);
    expect(utils.showError).toHaveBeenCalledWith('Index is out of bounds.');
  });

  test('deleteAt in bounds', async () => {
    await list.insertAtTail(10);
    await list.insertAtTail(20);
    await list.deleteAt(1);
    expect(mockFns.animate).toHaveBeenCalled();
  });

  test('deleteAt out of bounds', async () => {
    await list.deleteAt(5);
    expect(utils.showError).toHaveBeenCalledWith('Index is out of bounds.');
  });

  test('insertAtHead with existing nodes', async () => {
    await list.insertAtTail(10);
    await list.insertAtHead(5);
    expect(mockFns.tx).toHaveBeenCalled();
  });
});
