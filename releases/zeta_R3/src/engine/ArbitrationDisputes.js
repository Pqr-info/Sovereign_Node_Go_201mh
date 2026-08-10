export const ArbitrationDisputes = {
  disputes: new Map(), // id -> dispute

  create(dispute) {
    this.disputes.set(dispute.id, dispute);
    return dispute;
  },

  getById(id) {
    return this.disputes.get(id) || null;
  },

  getAll() {
    return Array.from(this.disputes.values());
  },

  update(id, patch) {
    const existing = this.disputes.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.disputes.set(id, updated);
    return updated;
  }
};
