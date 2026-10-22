import { newIterator } from '@/common/iterator';

/**
 * Use the mocked runner while preserving the generator's final return value.
 */
export async function runIt(iterator) {
  let outcome;
  await newIterator(async function* () {
    try {
      outcome = { value: yield* iterator };
    } catch (error) {
      outcome = { error };
    }
  }).start();
  if ('error' in outcome) throw outcome.error;
  return outcome.value;
}
