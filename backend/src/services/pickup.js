const ApiError = require('../utils/ApiError');

// Resolves the requested pickup option to a concrete Date, validated against shop settings.
exports.resolvePickup = (d, settings) => {
  const now = Date.now();
  const lead = settings.pickup.minLeadMinutes * 60000;
  if (d.pickupOption === 'custom') {
    const t = new Date(d.pickupTime);
    if (!d.pickupTime || Number.isNaN(t.getTime())) throw new ApiError(400, 'Please choose a valid pickup time.');
    if (t.getTime() < now + lead - 60000) throw new ApiError(400, `Pickup time must be at least ${settings.pickup.minLeadMinutes} minutes from now.`);
    if (t.getTime() > now + settings.pickup.maxDaysAhead * 86400000) throw new ApiError(400, `Pickup can be scheduled up to ${settings.pickup.maxDaysAhead} day(s) ahead.`);
    return t;
  }
  const mins = { asap: 0, 15: 15, 30: 30, 60: 60 }[d.pickupOption] ?? 0;
  return new Date(now + Math.max(mins * 60000, lead));
};
