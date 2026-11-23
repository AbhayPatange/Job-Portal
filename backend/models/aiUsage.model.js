import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    _id: String,
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, index: { expires: 0 } },
});
export const AiUsage = mongoose.model('AiUsage', schema);
async function reserveUsage(userId, feature, userLimit, globalLimit) {
    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    const expiresAt = new Date(now.getTime() + 2 * 86400000);
    const reservedKeys = [];
    for (const [key, limit] of [[`user:${feature}:${userId}:${day}`, userLimit], [`global:${feature}:${day}`, globalLimit]]) {
        try { await AiUsage.updateOne({ _id: key }, { $setOnInsert: { count: 0, expiresAt } }, { upsert: true }); }
        catch (error) { if (error.code !== 11000) throw error; }
        const reserved = await AiUsage.findOneAndUpdate({ _id: key, count: { $lt: limit } }, { $inc: { count: 1 } });
        if (!reserved) {
            // Undo only counters reserved by this request. This keeps a full global
            // budget from consuming an individual candidate's daily allowance.
            await Promise.all(reservedKeys.map(reservedKey => AiUsage.updateOne({ _id: reservedKey }, { $inc: { count: -1 } })));
            return false;
        }
        reservedKeys.push(key);
    }
    return true;
}
export const reserveFitUsage = userId => reserveUsage(userId, 'fit', 5, 50);
export const reserveInterviewUsage = userId => reserveUsage(userId, 'interview', 5, 50);
export const reserveCoverLetterUsage = userId => reserveUsage(userId, 'cover-letter', 3, 30);
