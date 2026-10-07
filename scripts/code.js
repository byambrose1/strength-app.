/* Prints the scrambled form of an access code. Run: node scripts/code.js YOURCODE
   Paste the result into LAUNCH.codeHash in js/content.js. Codes are not case sensitive. */
const { codeHash } = require('../js/logic.js');
const code = (process.argv[2] || '').trim().toUpperCase();
if (!code) { console.log('Usage: node scripts/code.js YOURCODE'); process.exit(1); }
console.log('Code: ' + code + '\ncodeHash: ' + codeHash(code) + '\nAfter-payment link: https://YOUR-SITE/#join-' + code);
