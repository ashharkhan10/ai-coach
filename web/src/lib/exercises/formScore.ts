/**
 * FormScore — a 0–100 score for how clean the user's form is,
 * plus the form problem that happened most often.
 *
 * Every frame we record whether there was a form problem.
 * Score = percentage of frames with good form.
 *   100 = perfect, 50 = half the time something was wrong.
 */
export class FormScore {
  private goodFrames = 0;
  private totalFrames = 0;
  private issueCounts = new Map<string, number>();

  /** Call once per frame. Pass the form issue, or null if form was good. */
  record(issue: string | null) {
    this.totalFrames += 1;
    if (issue === null) {
      this.goodFrames += 1;
    } else {
      this.issueCounts.set(issue, (this.issueCounts.get(issue) ?? 0) + 1);
    }
  }

  get value(): number {
    if (this.totalFrames === 0) return 100;
    return Math.round((this.goodFrames / this.totalFrames) * 100);
  }

  /** The issue seen in the most frames, or null if form was always good. */
  get mainIssue(): string | null {
    let worst: string | null = null;
    let worstCount = 0;
    for (const [issue, count] of this.issueCounts) {
      if (count > worstCount) {
        worst = issue;
        worstCount = count;
      }
    }
    return worst;
  }

  reset() {
    this.goodFrames = 0;
    this.totalFrames = 0;
    this.issueCounts.clear();
  }
}
