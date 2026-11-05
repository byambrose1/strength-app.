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
  'Seated row': 'https://youtube.com/shorts/91YU84_mwzc',
  'Seated march': 'https://youtube.com/shorts/Iux0pQVMx-Y',
  'How to do the seated test': 'https://youtube.com/shorts/bhMDCSCqTZo',  // seated bicep curls: the 30-second arm curl test
  'Seated bicep curl': 'https://youtube.com/shorts/bhMDCSCqTZo',
  'Seated knee lift': 'https://youtube.com/shorts/NAUjVqGeUbM',
  'Single-leg glute bridge': 'https://youtube.com/shorts/p7xeNkuDp2I',
  'Wall slide': 'https://youtube.com/shorts/R9TB6P5Aw0c',
  'Wall press-up': 'https://youtube.com/shorts/WC31X5JfTMk',
};
if (typeof module !== 'undefined') module.exports = VIDEOS;
