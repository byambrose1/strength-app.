/* Videos. Paste a YouTube link (or just the video ID) next to each title.
   A title with no link shows a "coming soon" tile in the app.
   Titles must match exactly. The full list, with what to film, is in docs/FILMING.md.

   Example:
     'Sit to stand': 'https://youtu.be/abc123XYZ00',
*/
const VIDEOS = {
  'Sit to stand': 'https://youtube.com/shorts/Mqk40fPEND0',
  'Chair hip hinge': 'https://youtube.com/shorts/fzBlHVi1ukk',
  'Chair-supported row': 'https://youtube.com/shorts/hyoxqVR7Be8',
  'Dead bug': 'https://youtube.com/shorts/uqOL677KoRM',
  'Glute bridge march': 'https://youtube.com/shorts/lqEqcZL-_fA',
  'Glute bridge': 'https://youtube.com/shorts/tGVxWlbPp7o',
  'Sit to stand, high seat': 'https://youtube.com/shorts/XD_qLTg3Xas',
  'Seated leg extension': 'https://youtube.com/shorts/7abOcwJFtkc',
  'Single-arm seated row': 'https://youtube.com/shorts/cpvD4Dk48UE',
  'Seated chest press': 'https://youtube.com/shorts/tgaAfNVrSXY',
  'Seated overhead press': 'https://youtube.com/shorts/ajOUu7XCltY',
  'Seated reverse fly': 'https://youtube.com/shorts/FgAWfqFk7S0',
  'Weighted seated march': 'https://youtube.com/shorts/JMo8rpI6CQY',
  'Seated weighted bicycle': 'https://youtube.com/shorts/sW8L5sahY5g',
  'Seated double leg extension': 'https://youtube.com/shorts/OgMu2Rdl80M',
  'Seated weighted side bend': 'https://youtube.com/shorts/11ePHu42zzI',
  'Seated side taps': 'https://youtube.com/shorts/wkHzF9C7TV8',
  'Seated row': 'https://youtube.com/shorts/91YU84_mwzc',
  'Seated march': 'https://youtube.com/shorts/Iux0pQVMx-Y',
  'How to do the test': 'https://youtube.com/shorts/Mqk40fPEND0',  // same clip as Sit to stand
  'How to do the seated test': 'https://youtube.com/shorts/bhMDCSCqTZo',  // seated bicep curls: the 30-second arm curl test
  'Goblet squat': 'https://youtube.com/shorts/7aF8AdOKeNg',
  'Kettlebell goblet squat': 'https://youtube.com/shorts/7aF8AdOKeNg',  // same movement
  'Romanian deadlift': 'https://youtube.com/shorts/MLMgKMsk22c',
  'Dumbbell Romanian deadlift': 'https://youtube.com/shorts/MLMgKMsk22c',  // gym members do the same movement
  'Split squat with chop': 'https://youtube.com/shorts/r_CZ19Kvz8Y',
  'Standing side reach': 'https://youtube.com/shorts/ubRX-toxEgs',
  'Overhead press': 'https://youtube.com/shorts/ZVlMA-BJ-q8',
  'Seated arm raise': 'https://youtube.com/shorts/LtN_K734ves',
  'Seated bicep curl': 'https://youtube.com/shorts/bhMDCSCqTZo',
  'Seated knee lift': 'https://youtube.com/shorts/NAUjVqGeUbM',
  'Single-leg glute bridge': 'https://youtube.com/shorts/p7xeNkuDp2I',
  'Wall slide': 'https://youtube.com/shorts/R9TB6P5Aw0c',
  'Supported step-back': 'https://youtube.com/shorts/lgp_zQ1Paq4',
  'Wall press-up': 'https://youtube.com/shorts/WC31X5JfTMk',
};
if (typeof module !== 'undefined') module.exports = VIDEOS;
