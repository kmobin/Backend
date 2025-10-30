const { Schema: S3, model: M3 } = require("mongoose");
const invalidTokenSchema = new S3({ token: String, expiresAt: Date });
invalidTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = M3("InvalidToken", invalidTokenSchema);
