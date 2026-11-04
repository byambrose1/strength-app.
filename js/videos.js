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
  'Glute bridge': 'https://youtube.com/shorts/tGVxWlbPp7o',
  'Sit to stand, high seat': 'https://youtube.com/shorts/XD_qLTg3Xas',
  'Seated knee lift': 'https://youtube.com/shorts/NAUjVqGeUbM',
  'Single-leg glute bridge': 'https://youtube.com/shorts/p7xeNkuDp2I',
  'Wall press-up': 'https://youtube.com/shorts/WC31X5JfTMk',
};
if (typeof module !== 'undefined') module.exports = VIDEOS;
