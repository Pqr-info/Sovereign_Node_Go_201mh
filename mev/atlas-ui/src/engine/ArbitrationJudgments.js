export const ArbitrationJudgments = {
  judgments: new Map(), // id -> judgment

  record(judgment) {
    this.judgments.set(judgment.id, judgment);
    return judgment;
  },

  getById(id) {
    return this.judgments.get(id) || null;
  },

  getAll() {
    return Array.from(this.judgments.values());
  }
};
