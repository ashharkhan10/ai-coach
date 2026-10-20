/**
 * RepCounter — counts reps from one joint angle.
 *
 * A rep = the angle goes past `turnAt`, then comes back past `finishAt`.
 *
 * Examples:
 *   Squat:  new RepCounter({ turnAt: 100, finishAt: 160 })
 *           → bend knees below 100°, stand up above 160° = 1 rep
 *
 *   Press:  new RepCounter({ turnAt: 160, finishAt: 90 })
 *           → push arms above 160°, bring down below 90° = 1 rep
 */

type Options = {
  turnAt: number;
  finishAt: number;
};

export class RepCounter {
  private readonly turnAt: number;
  private readonly finishAt: number;
  private reps = 0;
  private reachedTurn = false;

  constructor({ turnAt, finishAt }: Options) {
    this.turnAt = turnAt;
    this.finishAt = finishAt;
  }

  /** Give the latest angle. Returns the total rep count. */
  update(angle: number): number {
    if (this.hasPassedTurn(angle)) {
      this.reachedTurn = true;
    }

    if (this.reachedTurn && this.hasPassedFinish(angle)) {
      this.reachedTurn = false;
      this.reps += 1;
    }

    return this.reps;
  }

  /** True while the user is in the middle of a rep (past the turn point). */
  isMidRep(): boolean {
    return this.reachedTurn;
  }

  get count(): number {
    return this.reps;
  }

  reset() {
    this.reps = 0;
    this.reachedTurn = false;
  }

  // Works for both directions (angle going down first, or up first).
  private hasPassedTurn(angle: number): boolean {
    return this.turnAt < this.finishAt ? angle < this.turnAt : angle > this.turnAt;
  }

  private hasPassedFinish(angle: number): boolean {
    return this.turnAt < this.finishAt ? angle > this.finishAt : angle < this.finishAt;
  }
}
