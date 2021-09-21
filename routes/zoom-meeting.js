const express = require('express');

const router = express.Router();

const crypto = require('crypto');

function generateSignature(req, res, next) {
  console.log(req.body);
  const timestamp = new Date().getTime() - 30000
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + 1).toString('base64')
  const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
  const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${1}.${hash}`).toString('base64')
  return signature
}
router.post('', generateSignature);

// generateSignature(process.env.API_KEY, process.env.API_SECRET, 123456789, 0));

module.exports = router;
