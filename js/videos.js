/* Videos. Paste a YouTube link (or just the video ID) next to each title.
   A title with no link shows a "coming soon" tile in the app.
   Titles must match exactly. The full list, with what to film, is in docs/FILMING.md.

   Example:
     'Sit to stand': 'https://youtu.be/abc123XYZ00',
*/
const VIDEOS = {
  'Sit to stand': 'https://youtube.com/shorts/Mqk40fPEND0',
};
if (typeof module !== 'undefined') module.exports = VIDEOS;
