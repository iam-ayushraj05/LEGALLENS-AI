import { describe, it, expect } from 'vitest';
import diff_match_patch from 'diff-match-patch';

describe('Document Comparison Engine', () => {
  it('should detect text diffs between original and revised contracts', () => {
    const textA = "Either party may terminate upon 30 days written notice.";
    const textB = "Either party may terminate upon 60 days written notice.";

    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(textA, textB);
    dmp.diff_cleanupSemantic(diffs);

    const hasChanges = diffs.some(([op]) => op !== 0);
    expect(hasChanges).toBe(true);
  });
});
