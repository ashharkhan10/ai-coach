/**
 * FormScore — a 0–100 score for how clean the user's form is.
 *
 * Every frame we record whether there was a form problem.
 * Score = percentage of frames with good form.
 *   100 = perfect, 50 = half the time something was wrong.
 */
export class FormScore {
  private goodFrames = 0;
  private totalFrames = 0;

  /** Call once per frame. Pass the form issue, or null if form was good. */
  record(issue: string | null) {
    this.totalFrames += 1;
    if (issue === null) this.goodFrames += 1;
  }

  get value(): number {
    if (this.totalFrames === 0) return 100;
    return Math.round((this.goodFrames / this.totalFrames) * 100);
  }

  reset() {
    this.goodFrames = 0;
    this.totalFrames = 0;
  }
}
