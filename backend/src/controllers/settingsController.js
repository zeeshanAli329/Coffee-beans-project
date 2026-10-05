const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

exports.get = asyncHandler(async (_req, res) => res.json({ settings: await Setting.get() }));
exports.update = asyncHandler(async (req, res) => {
  await Setting.get(); // make sure the document exists
  const settings = await Setting.findOneAndUpdate({ key: 'main' }, { $set: req.body }, { new: true, runValidators: true });
  res.json({ settings });
});
