import { Sticker as StickerGlyph } from 'lucide-react'
import { Stage, Text, type Act } from '../../kit'
import { installVirtualClock } from '../../kit/clock'
import './readme.css'

// ============================================================================
// STICKERS: the swap block. Three khe-sticker files, pasted whole between the
// backticks, nothing else in this file knows what they draw.
//
//   slot 0, slot 1   arrive when the sticker button is pressed and play their
//                    own one-shot story as they land
//   slot 2           arrives held on its first frame; the cursor clicks it and
//                    it plays its one-shot, then holds still
//
// To swap: replace `svg` with the new file's text (and `file`, for the record).
// What the tile relies on, all of it khe-sticker's own convention: a 500 x 500
// viewBox, every moving group marked data-layer, animations that play once
// with fill both, and `animation: none` on those groups being the rested still
// (the same rule each file ships for reduced motion).
// ============================================================================
const STICKERS: { file: string; svg: string }[] = [
  {
    file: 'skills/khe-sticker/examples/badge-done-stamp.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="sticker-badge-done-stamp" data-kind="badge" role="img" aria-labelledby="sticker-badge-done-stamp-title" stroke="var(--ink, #1c1f33)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
  <title id="sticker-badge-done-stamp-title">Done</title>
  <style>
    #sticker-badge-done-stamp [data-layer="stamp"] { animation: sticker-badge-done-stamp-stamp 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-badge-done-stamp-stamp {
      0% { transform: translateY(-63.693px); }
      4% { transform: translateY(-63.693px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
      10.67% { transform: translateY(0px); }
      100% { transform: translateY(0px); }
    }
    #sticker-badge-done-stamp [data-layer="squash"] { transform-box: fill-box; transform-origin: 50% 100%; animation: sticker-badge-done-stamp-squash 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-badge-done-stamp-squash {
      0% { transform: scaleY(1); }
      10.67% { transform: scaleY(1); }
      12.67% { transform: scaleY(0.9); }
      18% { transform: scaleY(1.027); }
      24% { transform: scaleY(0.987); }
      30% { transform: scaleY(1.007); }
      36% { transform: scaleY(0.997); }
      42% { transform: scaleY(1); }
      100% { transform: scaleY(1); }
    }
    #sticker-badge-done-stamp [data-layer="burst"] { opacity: 0; animation: sticker-badge-done-stamp-burst 2.5s steps(1, end) 1 both; }
    @keyframes sticker-badge-done-stamp-burst {
      0% { opacity: 0; }
      10.67% { opacity: 1; }
      65.33% { opacity: 0; }
      100% { opacity: 0; }
    }
    #sticker-badge-done-stamp [data-layer="burst-pop"] { transform-box: fill-box; transform-origin: 50% 50%; animation: sticker-badge-done-stamp-burst-pop 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-badge-done-stamp-burst-pop {
      0% { transform: scale(0.2); }
      10.67% { transform: scale(0.2); }
      15.33% { transform: scale(1.35); }
      20.67% { transform: scale(0.9); }
      25.33% { transform: scale(1); }
      57.33% { transform: scale(1); }
      65.33% { transform: scale(0.2); }
      100% { transform: scale(0.2); }
    }
    @media (prefers-reduced-motion: reduce) {
      #sticker-badge-done-stamp [data-layer] { animation: none; }
    }
  </style>
  <g data-layer="squash">
    <g id="sticker-badge-done-stamp-diecut" data-layer="diecut">
      <path d="M91 226.6 L88.5 234.8 L88.6 246.9 L90.8 254.2 L97.1 264.3 L97.4 266.3 L91.7 280.4 L91.5 292.6 L93.8 300.8 L99.9 310.6 L110.4 319.4 L121.3 324.7 L124.7 338.6 L127.7 344.9 L132.4 351 L141.7 358.5 L149 362.2 L160.7 365.3 L178 365.6 L187.5 375.7 L193.4 380 L200.5 383.4 L213.1 386.6 L225.8 386.7 L233 385.4 L239.9 383.1 L250.2 377.8 L263.1 382.7 L270.7 384.2 L283.4 384.2 L290.7 382.9 L298 380.4 L308.3 374.3 L321.9 359.4 L339.1 357.5 L352.1 352 L362.1 343.8 L380 320.4 L383.4 313.7 L386 304.6 L406.3 278.5 L409.6 272.1 L411.5 265.2 L412 259.1 L411.1 251.7 L409 245.5 L402.7 234.7 L408.5 218.5 L408.5 207.4 L406.6 200.3 L403 193.4 L395.1 184.5 L389.4 180.4 L378.1 174.5 L375.2 161.1 L368.4 149.9 L358 141.2 L346 136.1 L337.7 134.5 L322 134.4 L312.5 124.3 L306.6 120 L299.5 116.6 L286.9 113.4 L274.2 113.3 L267 114.6 L260.1 116.9 L249.8 122.2 L236.9 117.3 L229.3 115.8 L216.6 115.8 L209.3 117.1 L202 119.6 L191.7 125.7 L178.1 140.6 L160.9 142.5 L148.6 147.6 L137.9 156.2 L120.2 179.4 L116.6 186.3 L114 195.4 L94 221.1 Z" fill="var(--white, #ffffff)" stroke="none"/>
    </g>
      <g id="sticker-badge-done-stamp-frame" data-part="frame">
        <path d="M103.7 228.1 L101.7 232.1 L100.4 236.2 L100.4 236.3 L100 240.5 L100.4 244.8 L101.7 249 L103.7 253 L106.5 256.7 L109.9 259.9 L114 262.7 L115.3 263.4 L115.3 263.5 L109.5 271.1 L106.7 274.8 L104.7 278.7 L103.4 282.9 L103 287.2 L103.4 291.5 L104.7 295.7 L106.7 299.7 L109.5 303.3 L112.9 306.6 L117 309.4 L121.5 311.7 L126.4 313.3 L131.6 314.3 L136.9 314.6 L137.7 314.6 L137.8 314.6 L137.8 314.7 L136.1 317.9 L134.9 322.1 L134.4 326.4 L134.9 330.7 L136.1 334.9 L138.1 338.9 L140.9 342.5 L144.4 345.8 L148.4 348.6 L152.9 350.8 L157.8 352.5 L163 353.5 L168.3 353.8 L173.6 353.5 L178.8 352.5 L183.7 350.8 L186 349.7 L186.1 349.7 L186.3 351.9 L187.5 356.1 L189.5 360.1 L192.3 363.7 L192.3 363.8 L195.8 367 L199.8 369.8 L204.3 372.1 L209.2 373.7 L214.4 374.7 L219.7 375.1 L225 374.7 L230.2 373.7 L235.1 372.1 L239.6 369.8 L243.6 367 L243.7 367 L247.1 363.8 L247.1 363.7 L249.4 360.7 L249.5 360.7 L249.9 361.3 L253.4 364.6 L257.4 367.4 L262 369.6 L266.9 371.3 L272 372.3 L277.3 372.6 L282.6 372.3 L287.8 371.3 L292.7 369.6 L297.2 367.4 L301.3 364.6 L304.7 361.3 L316.4 346.1 L316.4 346 L320.4 346.8 L325.7 347.2 L331 346.8 L336.2 345.8 L341.1 344.2 L345.6 341.9 L349.7 339.1 L353.1 335.9 L353.1 335.8 L367.3 317.2 L370.1 313.6 L370.1 313.5 L372.1 309.6 L373.4 305.4 L373.8 301.1 L373.6 299.1 L373.6 299 L375.8 297.5 L375.9 297.5 L379.3 294.2 L393.5 275.6 L396.3 271.9 L398.3 267.9 L399.6 263.8 L399.6 263.7 L400 259.5 L399.6 255.2 L398.3 251 L396.3 247 L393.5 243.3 L390.1 240.1 L386 237.3 L384.7 236.6 L384.7 236.5 L390.5 228.9 L393.3 225.2 L395.3 221.3 L396.6 217.1 L397 212.8 L396.6 208.5 L395.3 204.3 L393.3 200.3 L390.5 196.7 L387.1 193.4 L383 190.6 L378.5 188.3 L373.6 186.7 L368.4 185.7 L363.1 185.4 L362.3 185.4 L362.2 185.4 L362.2 185.3 L363.9 182.1 L365.1 177.9 L365.6 173.6 L365.1 169.3 L363.9 165.1 L361.9 161.1 L359.1 157.5 L355.6 154.2 L351.6 151.4 L347.1 149.2 L342.2 147.5 L337 146.5 L331.7 146.2 L326.4 146.5 L321.2 147.5 L316.3 149.2 L314 150.3 L313.9 150.3 L313.7 148.1 L312.5 143.9 L310.5 139.9 L307.7 136.3 L307.7 136.2 L304.2 133 L300.2 130.2 L295.7 127.9 L290.8 126.3 L285.6 125.3 L280.3 124.9 L275 125.3 L269.8 126.3 L264.9 127.9 L260.4 130.2 L256.4 133 L256.3 133 L252.9 136.2 L252.9 136.3 L250.6 139.3 L250.5 139.3 L250.1 138.7 L246.6 135.4 L242.6 132.6 L238 130.4 L233.1 128.7 L228 127.7 L222.7 127.4 L217.4 127.7 L212.2 128.7 L207.3 130.4 L202.8 132.6 L198.7 135.4 L195.3 138.7 L183.6 153.9 L183.6 154 L179.6 153.2 L174.3 152.8 L169 153.2 L163.8 154.2 L158.9 155.8 L154.4 158.1 L150.3 160.9 L146.9 164.1 L146.9 164.2 L132.7 182.8 L129.9 186.4 L129.9 186.5 L127.9 190.4 L126.6 194.6 L126.2 198.9 L126.4 200.9 L126.4 201 L124.2 202.5 L124.1 202.5 L120.7 205.8 L106.5 224.4 Z" fill="var(--deep-side, #5a3cc4)"/>
        <path d="M246.6 135.4 L242.6 132.6 L238 130.4 L233.1 128.8 L228 127.7 L222.7 127.4 L217.4 127.7 L212.2 128.8 L207.3 130.4 L202.8 132.6 L198.7 135.4 L195.3 138.7 L192.5 142.4 L190.5 146.3 L189.3 150.5 L188.8 154.8 L188.9 155.6 L184.7 154.2 L179.6 153.2 L174.3 152.9 L169 153.2 L163.8 154.2 L158.9 155.9 L154.4 158.1 L150.4 160.9 L146.9 164.2 L144.1 167.8 L142.1 171.8 L140.9 176 L140.4 180.3 L140.9 184.6 L142.1 188.7 L144.1 192.7 L145.6 194.7 L142.8 194.8 L137.6 195.8 L132.7 197.5 L128.2 199.7 L124.2 202.5 L120.7 205.8 L117.9 209.5 L115.9 213.4 L114.7 217.6 L114.3 221.9 L114.7 226.2 L115.9 230.4 L117.9 234.4 L120.7 238 L124.2 241.3 L128.2 244.1 L132.1 246 L131.2 246.4 L127.2 249.2 L123.7 252.5 L121 256.1 L118.9 260.1 L117.7 264.3 L117.3 268.6 L117.7 272.9 L118.9 277.1 L121 281 L123.7 284.7 L127.2 288 L131.2 290.8 L135.7 293 L140.7 294.7 L145.8 295.7 L151.1 296 L152.1 295.9 L150.4 299.3 L149.1 303.5 L148.7 307.8 L149.1 312.1 L150.4 316.2 L152.4 320.2 L155.2 323.9 L158.6 327.2 L162.6 330 L167.2 332.2 L172.1 333.8 L177.2 334.9 L182.5 335.2 L187.8 334.9 L193 333.8 L197.9 332.2 L200.3 331 L200.5 333.3 L201.8 337.5 L203.8 341.4 L206.6 345.1 L210 348.4 L214.1 351.2 L218.6 353.4 L223.5 355.1 L228.6 356.1 L233.9 356.4 L239.2 356.1 L244.4 355.1 L249.3 353.4 L253.8 351.2 L257.9 348.4 L261.3 345.1 L263.7 342 L264.2 342.7 L267.6 345.9 L271.7 348.7 L276.2 351 L281.1 352.6 L286.3 353.6 L291.6 354 L296.9 353.6 L302 352.6 L306.9 351 L311.4 348.7 L315.5 345.9 L318.9 342.7 L321.7 339 L323.7 335 L325 330.8 L325.4 326.6 L325.3 325.8 L329.5 327.2 L334.7 328.2 L339.9 328.5 L345.2 328.2 L350.4 327.2 L355.3 325.5 L359.8 323.3 L363.9 320.5 L367.3 317.2 L370.1 313.5 L372.1 309.6 L373.4 305.4 L373.8 301.1 L373.4 296.8 L372.1 292.6 L370.1 288.7 L368.6 286.7 L371.4 286.5 L376.6 285.5 L381.5 283.9 L386 281.6 L390.1 278.8 L393.5 275.6 L396.3 271.9 L398.3 267.9 L399.6 263.7 L400 259.5 L399.6 255.2 L398.3 251 L396.3 247 L393.5 243.3 L390.1 240.1 L386 237.3 L382.2 235.4 L383 235 L387 232.2 L390.5 228.9 L393.3 225.2 L395.3 221.3 L396.5 217.1 L397 212.8 L396.5 208.5 L395.3 204.3 L393.3 200.3 L390.5 196.7 L387 193.4 L383 190.6 L378.5 188.4 L373.6 186.7 L368.4 185.7 L363.1 185.4 L362.2 185.4 L363.9 182.1 L365.1 177.9 L365.5 173.6 L365.1 169.3 L363.9 165.1 L361.8 161.1 L359.1 157.5 L355.6 154.2 L351.6 151.4 L347.1 149.2 L342.2 147.5 L337 146.5 L331.7 146.2 L326.4 146.5 L321.2 147.5 L316.3 149.2 L313.9 150.4 L313.7 148.1 L312.5 143.9 L310.4 139.9 L307.7 136.3 L304.2 133 L300.2 130.2 L295.7 128 L290.7 126.3 L285.6 125.3 L280.3 125 L275 125.3 L269.8 126.3 L264.9 128 L260.4 130.2 L256.4 133 L252.9 136.3 L250.6 139.4 L250 138.7 Z" fill="var(--deep, #8262f2)"/>
        <path d="M165.3 205.6 L165.6 204.2 L165.5 202.7 L164.8 201.3 L163.8 200.1 L162.4 199.1 L160.8 198.5 L159 198.2 L157.2 198.4 L155.5 198.9 L154 199.7 L152.8 200.8 L152 202.1 L143.6 223 L143.3 224.4 L143.4 225.9 L144.1 227.3 L145.1 228.5 L146.5 229.5 L148.1 230.1 L149.9 230.4 L151.7 230.3 L153.4 229.8 L154.9 228.9 L156.1 227.8 L156.9 226.5 Z" fill="var(--white, #ffffff)" stroke="none"/>
      </g>
      <g id="sticker-badge-done-stamp-plate" data-part="plate">
        <path d="M177.3 207.7 L171.9 218.3 L168.6 229.3 L167.5 240.7 L168.6 252 L171.9 263.1 L177.3 273.6 L184.6 283.3 L193.8 292 L204.5 299.4 L216.4 305.3 L229.4 309.7 L243.1 312.4 L257.1 313.3 L271.1 312.4 L284.8 309.7 L297.8 305.3 L309.8 299.4 L320.5 292 L329.6 283.3 L334 277.6 L341.3 267.9 L346.7 257.4 L350 246.3 L351.1 235 L351.1 234.9 L350 223.6 L346.7 212.5 L341.3 202 L334 192.3 L324.8 183.6 L314.2 176.2 L302.2 170.3 L289.2 165.9 L275.5 163.3 L261.5 162.4 L247.5 163.3 L233.8 165.9 L220.8 170.3 L208.8 176.2 L198.1 183.6 L189 192.3 L184.6 198 Z" fill="var(--white-side, #c9d6f2)"/>
        <path d="M346.7 212.5 L341.3 202 L334 192.3 L324.8 183.7 L314.1 176.3 L302.2 170.3 L289.2 166 L275.5 163.3 L261.5 162.4 L247.5 163.3 L233.8 166 L220.8 170.3 L208.8 176.3 L198.2 183.7 L189 192.3 L181.7 202 L176.3 212.5 L173 223.6 L171.9 235 L173 246.3 L176.3 257.4 L181.7 267.9 L189 277.6 L198.2 286.3 L208.8 293.6 L220.8 299.6 L233.8 304 L247.5 306.6 L261.5 307.5 L275.5 306.6 L289.2 304 L302.2 299.6 L314.1 293.6 L324.8 286.3 L334 277.6 L341.3 267.9 L346.7 257.4 L350 246.3 L351.1 235 L350 223.6 Z" fill="var(--white, #ffffff)"/>
      </g>
    <g data-layer="stamp">
      <g id="sticker-badge-done-stamp-mark" data-part="mark">
        <path d="M202 249.6 L202.8 252.9 L204.6 256 L207.3 258.5 L207.3 258.6 L210.7 260.5 L250.8 277 L254.9 278.2 L259.2 278.4 L263.5 277.7 L267.3 276.1 L270.4 273.7 L275.9 266.5 L278.2 263.5 L315.3 194.4 L316.5 191.2 L316.5 191.1 L316.5 187.8 L315.5 184.5 L313.5 181.6 L310.6 179.1 L307.1 177.4 L303.1 176.5 L298.9 176.4 L294.9 177.2 L291.2 178.8 L288.2 181.2 L282.8 188.4 L280.6 191.2 L254.4 240 L254.3 240 L230.7 230.3 L226.7 229.1 L222.6 228.9 L218.5 229.5 L214.7 230.9 L211.6 233.1 L209.2 235.9 L203.7 243.1 L202.3 246.3 Z" fill="var(--gold-side, #d9900a)"/>
        <path d="M256.3 269.8 L260.4 271 L264.7 271.2 L268.9 270.5 L272.7 268.9 L275.9 266.5 L278.1 263.5 L315.3 194.4 L316.4 191.1 L316.5 187.8 L315.5 184.5 L313.5 181.6 L310.6 179.1 L307.1 177.4 L303.1 176.5 L298.9 176.4 L294.9 177.2 L291.2 178.9 L288.2 181.2 L286.1 184.1 L255.7 240.6 L230.6 230.3 L226.7 229.2 L222.6 228.9 L218.5 229.5 L214.7 231 L211.6 233.2 L209.2 235.9 L207.8 239.1 L207.5 242.5 L208.3 245.8 L210.1 248.8 L212.8 251.4 L216.2 253.3 Z" fill="var(--gold, #ffc533)"/>
      </g>
    </g>
  </g>
  <g data-layer="burst">
    <g data-layer="burst-pop">
      <path d="M125.2 69.1 L123.9 67.9 L122.3 67 L120.5 66.6 L118.7 66.6 L117 67.1 L115.4 68.1 L114.2 69.4 L113.3 71 L112.9 72.7 L112.9 74.5 L113.4 76.3 L114.3 77.8 L130.3 97.7 L131.6 99 L133.2 99.9 L134.9 100.3 L136.7 100.3 L138.5 99.8 L140.1 98.8 L141.3 97.5 L142.2 95.9 L142.6 94.2 L142.6 92.3 L142.1 90.6 L141.1 89 Z" fill="var(--white, #ffffff)"/>
      <path d="M264.1 41.6 L263.8 39.8 L263.1 38.2 L262 36.7 L260.6 35.6 L258.9 34.9 L257.1 34.7 L255.3 34.9 L253.6 35.6 L252.2 36.7 L251.1 38.2 L250.4 39.8 L250.1 41.6 L250.1 67.5 L250.4 69.3 L251.1 71 L252.2 72.4 L253.6 73.6 L255.3 74.2 L257.1 74.5 L258.9 74.2 L260.6 73.6 L262 72.4 L263.1 71 L263.8 69.3 L264.1 67.5 Z" fill="var(--white, #ffffff)"/>
      <path d="M399.9 77.8 L400.8 76.3 L401.3 74.5 L401.4 72.7 L400.9 71 L400.1 69.4 L398.8 68.1 L397.2 67.1 L395.5 66.6 L393.7 66.6 L391.9 67 L390.3 67.9 L389 69.1 L373.1 89 L372.2 90.6 L371.6 92.3 L371.6 94.2 L372 95.9 L372.9 97.5 L374.2 98.8 L375.7 99.8 L377.5 100.3 L379.3 100.3 L381.1 99.9 L382.7 99 L384 97.7 Z" fill="var(--white, #ffffff)"/>
    </g>
  </g>
</svg>`,
  },
  {
    file: 'skills/khe-sticker/examples/reaction-heart.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="sticker-reaction-heart" data-kind="reaction" role="img" aria-labelledby="sticker-reaction-heart-title" stroke="var(--ink, #1c1f33)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
  <title id="sticker-reaction-heart-title">Love it</title>
  <style>
    #sticker-reaction-heart [data-layer="thump"] { transform-box: fill-box; transform-origin: 50% 62%; animation: sticker-reaction-heart-thump 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-reaction-heart-thump {
      0% { transform: scale(1); }
      5.33% { transform: scale(1); }
      10.67% { transform: scale(0.84); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
      16.67% { transform: scale(1.057); }
      22.67% { transform: scale(0.971); }
      28.67% { transform: scale(1.014); }
      34.67% { transform: scale(0.993); }
      40.67% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    #sticker-reaction-heart [data-layer="peek"] { transform-box: fill-box; transform-origin: -5% 143%; animation: sticker-reaction-heart-peek 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-reaction-heart-peek {
      0% { transform: scale(0.2); }
      16.67% { transform: scale(0.2); }
      23.33% { transform: scale(1.197); }
      29.33% { transform: scale(0.901); }
      35.33% { transform: scale(1.049); }
      41.33% { transform: scale(0.975); }
      47.33% { transform: scale(1.012); }
      53.33% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    #sticker-reaction-heart [data-layer="burst"] { opacity: 0; animation: sticker-reaction-heart-burst 2.5s steps(1, end) 1 both; }
    @keyframes sticker-reaction-heart-burst {
      0% { opacity: 0; }
      16.67% { opacity: 1; }
      71.33% { opacity: 0; }
      100% { opacity: 0; }
    }
    #sticker-reaction-heart [data-layer="burst-pop"] { transform-box: fill-box; transform-origin: 50% 50%; animation: sticker-reaction-heart-burst-pop 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-reaction-heart-burst-pop {
      0% { transform: scale(0.2); }
      16.67% { transform: scale(0.2); }
      21.33% { transform: scale(1.35); }
      26.67% { transform: scale(0.9); }
      31.33% { transform: scale(1); }
      63.33% { transform: scale(1); }
      71.33% { transform: scale(0.2); }
      100% { transform: scale(0.2); }
    }
    @media (prefers-reduced-motion: reduce) {
      #sticker-reaction-heart [data-layer] { animation: none; }
    }
  </style>
  <g data-layer="thump">
    <g data-layer="peek">
        <g id="sticker-reaction-heart-diecut-small" data-layer="diecut">
          <path d="M269.5 157.6 L271.2 165.3 L274.8 172.4 L280.2 178.7 L287.2 184.2 L300.7 191.2 L338.9 205.1 L345.9 208.8 L354.3 215.5 L358.4 216.4 L362 216 L367.5 212.8 L378 199.1 L379.6 195.4 L380.4 188.8 L383.1 183.1 L400.3 159.2 L407.4 147.5 L410.3 140.4 L411.9 133 L411.9 125.9 L410.5 119.1 L406.3 110.8 L399.7 103.9 L388.4 97.5 L378.3 94.9 L365.4 94.8 L355.9 97.1 L345.1 103.1 L337.8 110.4 L336 111.2 L323.6 108.5 L317 108.3 L308.8 109.4 L295.7 114.7 L290.2 118.7 L285.5 123.8 L272.2 142.4 L269.8 150.2 Z" fill="var(--white, #ffffff)" stroke="none"/>
        </g>
        <g id="sticker-reaction-heart-heart-small" data-part="heart-small">
          <path d="M281.4 156.8 L281.5 157.6 L282.5 161.4 L282.8 162.2 L284.8 165.8 L285.3 166.5 L288.4 169.9 L288.9 170.4 L293 173.7 L293.5 174 L298.6 177 L299 177.2 L304.9 180 L305.2 180.1 L311.6 182.6 L311.8 182.7 L318.6 185.1 L325.4 187.4 L325.5 187.4 L331.9 189.6 L332.1 189.7 L337.9 191.8 L338.3 191.9 L343.3 194 L343.8 194.2 L347.9 196.1 L348.5 196.5 L351.7 198.2 L352.4 198.7 L354.5 200.1 L355.3 200.7 L356.6 201.8 L357.3 202.5 L357.9 203.1 L358.5 203.9 L358.7 204.1 L358.8 204.2 L358.9 204.4 L367.9 192.5 L367.9 192.4 L367.9 192.2 L367.9 191.6 L367.9 191 L367.9 190.2 L368 189.4 L368.2 187.8 L368.4 187.1 L369.1 184.8 L369.3 184.1 L370.6 181.2 L370.8 180.7 L372.7 177.1 L373 176.7 L375.5 172.7 L375.7 172.4 L378.9 167.9 L379 167.7 L382.6 162.9 L382.7 162.8 L386.5 157.8 L386.6 157.7 L390.3 152.6 L390.4 152.4 L393.8 147.3 L393.9 147.1 L396.7 142.1 L396.8 141.7 L398.8 136.9 L398.9 136.3 L399.9 131.8 L400 131.1 L400 126.9 L399.9 126.1 L398.9 122.2 L398.6 121.4 L396.6 117.9 L396.1 117.2 L393.2 114.1 L392.5 113.5 L388.8 110.9 L388.1 110.5 L388 110.5 L383.7 108.5 L382.9 108.2 L378.1 107 L377.2 106.9 L372.3 106.4 L371.4 106.4 L366.6 106.8 L365.6 106.9 L361.2 108 L360.3 108.3 L356.3 110.1 L355.5 110.5 L352.1 112.8 L351.5 113.4 L348.8 116.1 L348.3 116.6 L344 122.3 L342.8 123.2 L340.5 124.1 L337.9 124.5 L335.3 124.2 L332.9 123.5 L332.5 123.2 L328.7 121.8 L327.9 121.6 L323.8 120.7 L322.9 120.5 L318.5 120.3 L317.5 120.3 L313 120.7 L312.1 120.9 L307.7 122.2 L306.8 122.5 L302.7 124.5 L301.9 125 L298.3 127.6 L297.6 128.2 L294.7 131.4 L294.7 131.5 L285.6 143.3 L285.2 143.9 L283.1 147.6 L282.8 148.3 L281.6 152.1 L281.5 152.9 Z" fill="var(--deep-side, #5a3cc4)"/>
          <path d="M367.7 192.3 L367.8 192.4 L367.9 192.5 L367.9 192.4 L367.9 192.2 L367.9 191.6 L367.8 191 L367.8 190.2 L367.9 189.4 L368.2 187.8 L368.4 187 L369.1 184.8 L369.3 184.1 L370.6 181.2 L370.8 180.7 L372.7 177.1 L373 176.7 L375.5 172.7 L375.7 172.4 L378.9 167.9 L379 167.7 L382.6 162.9 L382.7 162.8 L386.5 157.8 L386.5 157.7 L390.3 152.6 L390.4 152.4 L393.7 147.3 L393.9 147.1 L396.6 142.1 L396.8 141.7 L398.8 136.9 L398.9 136.3 L399.9 131.8 L400 131.1 L400 126.9 L399.9 126.1 L398.9 122.2 L398.6 121.4 L396.6 117.9 L396.1 117.2 L393.2 114.1 L392.5 113.5 L388.8 110.9 L388 110.5 L383.7 108.6 L382.9 108.3 L378.1 107 L377.2 106.9 L372.3 106.4 L371.4 106.4 L366.6 106.8 L365.6 106.9 L361.2 108 L360.3 108.3 L356.3 110.1 L355.5 110.5 L352.1 112.9 L351.5 113.4 L348.8 116.1 L348.3 116.7 L346.4 119.6 L346.2 120 L344.8 121.8 L342.8 123.2 L340.5 124.1 L337.9 124.5 L335.3 124.3 L332.9 123.5 L332.5 123.3 L328.7 121.8 L327.9 121.6 L323.8 120.7 L322.9 120.5 L318.5 120.3 L317.5 120.3 L313 120.8 L312.1 120.9 L307.7 122.2 L306.8 122.5 L302.7 124.5 L301.9 125 L298.3 127.7 L297.7 128.2 L294.7 131.5 L294.2 132.1 L292.1 135.7 L291.8 136.5 L290.7 140.3 L290.6 141.1 L290.5 145 L290.6 145.8 L291.5 149.6 L291.9 150.4 L293.9 154 L294.4 154.7 L297.4 158.1 L298 158.6 L302.1 161.8 L302.6 162.2 L307.7 165.2 L308.1 165.4 L313.9 168.1 L314.2 168.2 L320.7 170.8 L320.8 170.8 L327.6 173.2 L327.7 173.2 L334.5 175.5 L341 177.7 L341.2 177.8 L347 179.9 L347.4 180.1 L352.4 182.1 L352.9 182.4 L357 184.3 L357.6 184.6 L360.7 186.4 L361.4 186.8 L363.6 188.3 L364.3 188.9 L365.6 190 L366.3 190.6 L366.9 191.3 L367.6 192.1 Z" fill="var(--deep, #8262f2)"/>
        </g>
    </g>
    <g id="sticker-reaction-heart-diecut" data-layer="diecut">
      <path d="M88 283.5 L91.5 297.9 L98.4 310.7 L108.9 322.5 L121.6 332.3 L135.2 340.3 L150.7 347.6 L240.2 380.2 L250.5 385.1 L264 393.3 L274.8 403.9 L279.3 405.5 L284.2 405.1 L290.1 401.3 L310.3 374.8 L312 370.6 L312 362.3 L314.2 353.3 L321.8 337.6 L335.5 317.2 L362.3 281.1 L370.9 268.1 L378.1 254.9 L383.8 240.6 L386.8 226.3 L386.8 212.5 L383.8 200.1 L375.3 184.7 L365.8 174.7 L354.8 166.9 L338.5 159.7 L324.4 156.2 L310.1 154.9 L292.4 156.3 L278.9 159.7 L265.8 165.6 L253.6 174.3 L246 182 L232.2 199 L229.9 199.1 L211.5 191.1 L196.6 187.9 L183.8 187.2 L170.1 188.5 L155.6 192.3 L141.1 199.1 L128.2 208.6 L119.4 218.2 L99.8 243.9 L91.7 258.5 L88.4 270.8 Z" fill="var(--white, #ffffff)" stroke="none"/>
    </g>
    <g id="sticker-reaction-heart-heart" data-part="heart">
      <path d="M100 282.8 L100.1 283.6 L102.6 293.5 L102.9 294.3 L108.2 303.7 L108.7 304.4 L116.5 313.2 L117.1 313.7 L127.4 321.8 L127.9 322.1 L140.4 329.5 L140.8 329.7 L154.9 336.3 L155.2 336.4 L170.6 342.4 L170.7 342.5 L186.7 348.1 L202.7 353.5 L217.9 358.7 L218.2 358.8 L232.1 363.9 L232.5 364 L244.7 369 L245.3 369.3 L255.6 374.2 L256.2 374.5 L264.4 379.1 L265.1 379.5 L271.1 383.7 L271.8 384.2 L275.8 387.6 L276.5 388.3 L278.8 390.7 L279.4 391.5 L280.3 392.8 L280.7 393.3 L280.9 393.6 L300.3 368.2 L300.2 367.9 L300.1 367.3 L299.9 365.9 L299.9 364.9 L299.9 361.9 L300 361 L300.8 356.3 L301 355.6 L302.9 349.3 L303.1 348.7 L306.4 341 L306.7 340.5 L311.4 331.6 L311.7 331.2 L318 321.3 L318.2 321 L325.7 310.2 L325.9 310 L334.4 298.6 L343.4 286.7 L343.5 286.6 L352.3 274.5 L352.4 274.3 L360.4 262.2 L360.6 261.9 L367.2 249.8 L367.4 249.5 L367.4 249.4 L372.2 237.6 L372.3 237.1 L374.8 225.6 L374.9 225 L374.9 224.9 L374.9 214.1 L374.8 213.3 L372.2 203.2 L371.8 202.4 L366.7 193.2 L366.2 192.5 L358.6 184.4 L358 183.8 L348.4 177.1 L347.6 176.7 L336.4 171.6 L335.5 171.3 L323.3 168.2 L322.4 168 L322.3 168 L309.7 166.9 L308.7 166.9 L296.3 167.8 L295.3 167.9 L283.7 170.8 L282.8 171.1 L272.4 175.7 L271.6 176.1 L262.7 182.2 L262.1 182.7 L255.1 189.8 L254.6 190.4 L235.6 215.3 L233.9 215.2 L231.6 214.5 L231.5 214.5 L229.5 213.4 L229.5 213.3 L227.2 211.6 L226.7 211.3 L226.7 211.2 L226.6 211.2 L218.4 206.7 L217.8 206.4 L208.1 202.6 L207.3 202.4 L196.5 200 L195.6 199.9 L184.1 199.2 L183.1 199.2 L171.3 200.4 L170.4 200.6 L158.9 203.8 L158 204.2 L147.3 209.4 L146.5 209.8 L137.1 216.8 L136.5 217.3 L128.8 225.7 L109.5 251.1 L109 251.7 L103.6 261.1 L103.3 261.9 L100.4 271.8 L100.2 272.6 Z" fill="var(--hot-side, #b8323c)"/>
      <path d="M300 367.9 L300.2 368.2 L300.2 367.9 L300.1 367.3 L299.9 365.9 L299.8 364.9 L299.9 361.9 L300 361 L300.8 356.3 L301 355.5 L302.8 349.3 L303.1 348.6 L306.4 341 L306.6 340.5 L311.4 331.6 L311.7 331.2 L317.9 321.3 L318.1 321 L325.7 310.2 L325.8 310 L334.4 298.6 L334.4 298.5 L343.4 286.6 L343.5 286.6 L352.3 274.5 L352.4 274.3 L360.4 262.2 L360.6 261.9 L367.2 249.8 L367.4 249.4 L372.1 237.6 L372.3 237.1 L374.8 225.6 L374.9 224.9 L374.8 214.1 L374.7 213.3 L372.1 203.2 L371.8 202.4 L366.7 193.2 L366.2 192.5 L358.6 184.4 L357.9 183.8 L348.4 177.1 L347.6 176.7 L336.4 171.6 L335.5 171.3 L323.2 168.2 L322.3 168 L309.7 166.9 L308.7 166.9 L296.3 167.8 L295.3 167.9 L283.7 170.8 L282.8 171.1 L272.4 175.7 L271.6 176.2 L262.8 182.2 L262.1 182.7 L255.1 189.8 L254.7 190.4 L249.5 198 L249.2 198.6 L245.9 206.2 L245.7 206.7 L245.1 209.3 L244.3 211.2 L242.9 212.8 L241 214.1 L238.8 215 L236.3 215.4 L233.9 215.2 L231.5 214.5 L229.5 213.4 L227.2 211.6 L226.6 211.3 L218.4 206.7 L217.8 206.4 L208.1 202.6 L207.3 202.4 L196.5 200 L195.6 199.9 L184.1 199.2 L183.1 199.2 L171.3 200.4 L170.4 200.6 L158.9 203.9 L158 204.2 L147.3 209.4 L146.5 209.8 L137.1 216.8 L136.5 217.3 L128.8 225.7 L128.4 226.4 L123 235.8 L122.6 236.5 L119.7 246.5 L119.6 247.3 L119.4 257.4 L119.5 258.2 L122 268.1 L122.3 268.9 L127.6 278.4 L128 279 L135.9 287.8 L136.4 288.3 L146.8 296.4 L147.3 296.8 L159.7 304.1 L160.1 304.3 L174.3 310.9 L174.6 311.1 L189.9 317.1 L190.1 317.2 L206 322.8 L206.1 322.8 L222 328.1 L222.1 328.1 L237.3 333.3 L237.5 333.4 L251.5 338.5 L251.8 338.7 L264.1 343.7 L264.6 343.9 L274.9 348.8 L275.5 349.1 L283.7 353.7 L284.4 354.2 L290.5 358.3 L291.2 358.9 L295.2 362.3 L295.9 362.9 L298.2 365.4 L298.8 366.2 L299.7 367.4 Z" fill="var(--hot, #f2545b)"/>
      <path d="M184.6 226.5 L185.5 224.4 L185.8 222.2 L185.3 220 L184.1 217.9 L182.3 216.2 L180 215 L177.4 214.2 L174.7 214.1 L172 214.5 L169.5 215.4 L167.4 216.9 L165.8 218.7 L152.2 240.3 L151.3 242.4 L151.1 244.6 L151.6 246.8 L152.8 248.8 L154.6 250.5 L156.9 251.8 L159.5 252.5 L162.2 252.7 L164.9 252.3 L167.4 251.3 L169.5 249.9 L171.1 248 Z" fill="var(--white, #ffffff)" stroke="none"/>
    </g>
  </g>
  <g data-layer="burst">
    <g data-layer="burst-pop">
      <path d="M97.9 136.2 L96 135.2 L93.9 134.8 L91.8 134.9 L89.7 135.5 L87.9 136.7 L86.5 138.2 L85.5 140.1 L85 142.2 L85.1 144.4 L85.7 146.4 L86.9 148.2 L88.5 149.7 L111.9 166.1 L113.8 167.1 L115.9 167.6 L118.1 167.5 L120.1 166.8 L121.9 165.7 L123.4 164.1 L124.4 162.2 L124.8 160.1 L124.7 157.9 L124.1 155.9 L122.9 154.1 L121.4 152.6 Z" fill="var(--white, #ffffff)"/>
      <path d="M58.6 221.6 L56.5 221.7 L54.4 222.4 L52.6 223.5 L51.2 225.1 L50.2 227 L49.8 229.1 L49.9 231.3 L50.6 233.3 L51.8 235.1 L53.3 236.5 L55.3 237.5 L57.4 238 L87.9 240.3 L90 240.2 L92 239.5 L93.8 238.4 L95.3 236.8 L96.2 234.8 L96.7 232.7 L96.6 230.6 L95.9 228.6 L94.7 226.8 L93.1 225.3 L91.2 224.4 L89.1 223.9 Z" fill="var(--white, #ffffff)"/>
      <path d="M260.8 66.5 L260.2 64.5 L259.1 62.6 L257.5 61.2 L255.6 60.2 L253.5 59.7 L251.4 59.8 L249.3 60.4 L247.5 61.5 L246.1 63.1 L245 65 L244.6 67.1 L244.6 69.2 L249.3 97.4 L250 99.4 L251.1 101.2 L252.7 102.7 L254.5 103.7 L256.6 104.2 L258.8 104.1 L260.8 103.5 L262.6 102.4 L264.1 100.8 L265.1 98.9 L265.6 96.8 L265.5 94.7 Z" fill="var(--white, #ffffff)"/>
    </g>
  </g>
</svg>`,
  },
  {
    file: 'skills/khe-sticker/examples/isometric-lock-clasp.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="sticker-isometric-lock-clasp" data-kind="isometric" data-diecut="none" role="img" aria-labelledby="sticker-isometric-lock-clasp-title" stroke="var(--ink, #1c1f33)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
  <title id="sticker-isometric-lock-clasp-title">Locking</title>
  <style>
    #sticker-isometric-lock-clasp [data-layer="shackle-drop"] { animation: sticker-isometric-lock-clasp-shackle-drop 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-isometric-lock-clasp-shackle-drop {
      0% { transform: translateY(-44.439px); }
      5.33% { transform: translateY(-44.439px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
      13.33% { transform: translateY(0px); }
      100% { transform: translateY(0px); }
    }
    #sticker-isometric-lock-clasp [data-layer="squash"] { transform-box: fill-box; transform-origin: 50% 100%; animation: sticker-isometric-lock-clasp-squash 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-isometric-lock-clasp-squash {
      0% { transform: scaleY(1); }
      13.33% { transform: scaleY(1); }
      15.33% { transform: scaleY(0.88); }
      20.67% { transform: scaleY(1.032); }
      26.67% { transform: scaleY(0.984); }
      32.67% { transform: scaleY(1.008); }
      38.67% { transform: scaleY(0.996); }
      44.67% { transform: scaleY(1); }
      100% { transform: scaleY(1); }
    }
    #sticker-isometric-lock-clasp [data-layer="plate-lag"] { animation: sticker-isometric-lock-clasp-plate-lag 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-isometric-lock-clasp-plate-lag {
      0% { transform: translateY(0px); }
      16.67% { transform: translateY(0px); }
      18.67% { transform: translateY(6.172px); }
      24% { transform: translateY(-1.659px); }
      30% { transform: translateY(0.83px); }
      36% { transform: translateY(-0.415px); }
      42% { transform: translateY(0.207px); }
      48% { transform: translateY(0px); }
      100% { transform: translateY(0px); }
    }
    #sticker-isometric-lock-clasp [data-layer="burst"] { opacity: 0; animation: sticker-isometric-lock-clasp-burst 2.5s steps(1, end) 1 both; }
    @keyframes sticker-isometric-lock-clasp-burst {
      0% { opacity: 0; }
      13.33% { opacity: 1; }
      68% { opacity: 0; }
      100% { opacity: 0; }
    }
    #sticker-isometric-lock-clasp [data-layer="burst-pop"] { transform-box: fill-box; transform-origin: 50% 50%; animation: sticker-isometric-lock-clasp-burst-pop 2.5s cubic-bezier(0.37, 0, 0.63, 1) 1 both; }
    @keyframes sticker-isometric-lock-clasp-burst-pop {
      0% { transform: scale(0.2); }
      13.33% { transform: scale(0.2); }
      18% { transform: scale(1.35); }
      23.33% { transform: scale(0.9); }
      28% { transform: scale(1); }
      60% { transform: scale(1); }
      68% { transform: scale(0.2); }
      100% { transform: scale(0.2); }
    }
    @media (prefers-reduced-motion: reduce) {
      #sticker-isometric-lock-clasp [data-layer] { animation: none; }
    }
  </style>
  <g id="sticker-isometric-lock-clasp-art" data-layer="art">
    <g data-layer="squash">
      <g data-layer="shackle-drop">
        <g id="sticker-isometric-lock-clasp-shackle" data-part="shackle">
          <path d="M136.9 161.8 L136.9 171 L137.3 174.1 L137.4 174.1 L139.7 183.1 L140.2 184.6 L163.9 243.6 L199.1 234.3 L208.6 221.9 L208.6 221.8 L185.3 163.6 L183.5 157 L183.5 156.9 L183.5 150.9 L184.9 145.7 L184.9 145.6 L188.5 143 L195 140 L202.1 138.1 L209.5 137.5 L216.9 138.1 L224 140 L230.5 143 L236 147 L236 147.1 L240.4 151.9 L243.8 158.2 L267.2 216.4 L302.4 207.1 L311.9 194.7 L288.3 135.7 L287.6 134.2 L283 125.8 L281 123.1 L274.4 115.7 L271.8 113.3 L263.3 107.2 L260.2 105.3 L250.4 100.7 L246.8 99.5 L236 96.6 L232.2 96 L220.9 95 L217.1 95 L205.8 96 L202 96.6 L191.2 99.5 L187.6 100.7 L177.8 105.3 L174.7 107.2 L166.2 113.3 L163.6 115.7 L157 123.1 L147.5 135.6 L145.5 138.3 L140.9 146.7 L139.7 149.7 L137.4 158.7 L137.3 158.7 Z" fill="var(--white-side, #c9d6f2)"/>
          <path d="M185.3 163.6 L183.5 157 L183.5 150.9 L185.1 145 L188.1 139.5 L192.5 134.6 L198 130.5 L204.5 127.5 L211.6 125.7 L219 125 L226.4 125.7 L233.5 127.5 L240 130.5 L245.5 134.6 L249.9 139.5 L253.4 145.7 L276.7 203.9 L311.9 194.7 L288.3 135.7 L287.6 134.2 L283 125.8 L281 123.1 L274.3 115.7 L271.8 113.4 L263.3 107.2 L260.2 105.4 L250.4 100.8 L246.8 99.5 L236 96.6 L232.2 96 L220.9 95 L217.1 95 L205.8 96 L202 96.6 L191.2 99.5 L187.7 100.8 L177.8 105.4 L174.7 107.2 L166.3 113.4 L163.7 115.7 L157 123.1 L155.1 125.8 L150.4 134.2 L149.2 137.2 L146.9 146.2 L146.5 149.3 L146.5 158.5 L146.9 161.7 L149.2 170.6 L149.7 172.2 L173.4 231.1 L208.6 221.9 Z" fill="var(--white, #ffffff)"/>
        </g>
      </g>
        <g id="sticker-isometric-lock-clasp-body" data-part="body">
          <path d="M107.2 277.2 L108.7 283.9 L146.1 377.1 L149.7 383.2 L155.1 388.3 L155.1 388.4 L162 392.2 L169.9 394.5 L178.3 395 L186.5 393.8 L355.6 349.3 L363.2 346.3 L369.5 341.9 L374.3 336.3 L397.4 306.1 L400.2 299.7 L400.8 292.9 L399.3 286.3 L361.9 193.1 L358.3 186.9 L352.9 181.8 L346 177.9 L338.1 175.7 L329.7 175.1 L321.5 176.4 L152.4 220.9 L144.8 223.8 L138.5 228.2 L133.7 233.8 L110.6 264 L107.8 270.4 Z" fill="var(--main-side, #2c4fc4)"/>
          <path d="M321.5 176.4 L152.4 220.9 L144.8 223.8 L138.5 228.2 L133.7 233.8 L130.9 240.2 L130.3 247 L131.8 253.6 L169.2 346.8 L172.8 353 L178.2 358.1 L185.1 362 L193 364.2 L201.4 364.8 L209.6 363.5 L378.7 319 L386.2 316.1 L392.6 311.7 L397.4 306.1 L400.2 299.7 L400.8 292.9 L399.3 286.3 L361.9 193.1 L358.3 186.9 L352.9 181.8 L346 177.9 L338.1 175.7 L329.7 175.1 Z" fill="var(--main, #4f7cf7)"/>
          <path d="M198.2 244.6 L200.3 243.8 L202 242.6 L203.3 241.1 L204 239.4 L204.2 237.5 L203.8 235.7 L202.8 234.1 L201.4 232.7 L199.5 231.7 L197.4 231.1 L195.1 230.9 L192.9 231.2 L160 239.9 L158 240.7 L156.3 241.9 L155 243.4 L154.3 245.1 L154.1 246.9 L154.5 248.7 L155.5 250.4 L156.9 251.8 L158.8 252.8 L160.9 253.4 L163.2 253.5 L165.4 253.2 Z" fill="var(--white, #ffffff)" stroke="none"/>
        </g>
      <g data-layer="plate-lag">
        <g id="sticker-isometric-lock-clasp-plate" data-part="plate">
          <path d="M222.2 248.9 L219.4 254.4 L217.7 260.2 L217.1 266.1 L217.1 266.2 L217.7 272.1 L219.4 277.9 L222.2 283.4 L226.1 288.5 L230.8 293 L236.4 296.9 L242.7 300 L249.5 302.3 L256.7 303.7 L264 304.2 L271.4 303.7 L278.5 302.3 L285.3 300 L291.6 296.9 L297.2 293 L302 288.5 L307.4 281.4 L311.3 276.3 L314.1 270.8 L315.8 265 L316.4 259 L315.8 253.1 L314.1 247.3 L311.3 241.8 L307.4 236.7 L302.6 232.2 L297 228.3 L290.8 225.2 L290.7 225.2 L283.9 222.9 L276.8 221.5 L269.4 221 L262.1 221.5 L254.9 222.9 L248.1 225.2 L241.9 228.3 L236.3 232.2 L231.5 236.7 L226.1 243.8 Z" fill="var(--gold-side, #d9900a)"/>
          <path d="M314.1 247.3 L311.2 241.8 L307.4 236.7 L302.6 232.2 L297 228.3 L290.7 225.2 L283.9 222.9 L276.8 221.5 L269.4 221 L262.1 221.5 L255 222.9 L248.2 225.2 L241.9 228.3 L236.3 232.2 L231.5 236.7 L227.7 241.8 L224.8 247.3 L223.1 253.1 L222.5 259 L223.1 265 L224.8 270.8 L227.7 276.3 L231.5 281.4 L236.3 285.9 L241.9 289.8 L248.2 292.9 L255 295.2 L262.1 296.6 L269.4 297 L276.8 296.6 L283.9 295.2 L290.7 292.9 L297 289.8 L302.6 285.9 L307.4 281.4 L311.2 276.3 L314.1 270.8 L315.8 265 L316.4 259 L315.8 253.1 Z" fill="var(--gold, #ffc533)"/>
          <path d="M277 242.6 L275.9 241.2 L274.5 239.8 L272.9 238.7 L271 237.8 L269.1 237.2 L267 236.8 L264.9 236.6 L262.7 236.8 L260.7 237.2 L258.7 237.8 L256.9 238.7 L255.3 239.8 L253.9 241.2 L252.8 242.6 L252 244.2 L251.5 245.9 L251.3 247.6 L251.5 249.3 L252 251 L252.8 252.6 L253.9 254.1 L255.3 255.4 L256.9 256.5 L258.7 257.4 L260.7 258.1 L261.5 258.2 L266.1 283 L289.6 276.9 L275.3 254.6 L275.9 254.1 L277 252.6 L277.8 251 L278.3 249.3 L278.4 247.6 L278.3 245.9 L277.8 244.2 Z" fill="var(--ink, #1c1f33)" stroke="none"/>
        </g>
      </g>
    </g>
  </g>
  <g data-layer="burst">
    <g data-layer="burst-pop">
      <path d="M409.5 65.9 L411.2 64.4 L412.4 62.6 L413.2 60.4 L413.3 58.2 L412.9 56 L411.9 53.9 L410.4 52.2 L408.5 51 L406.4 50.3 L404.1 50.1 L401.9 50.5 L399.9 51.5 L377.7 66.4 L376 67.8 L374.7 69.7 L374 71.8 L373.9 74.1 L374.3 76.3 L375.3 78.3 L376.8 80 L378.6 81.3 L380.8 82 L383 82.2 L385.2 81.7 L387.3 80.7 Z" fill="var(--white, #ffffff)"/>
      <path d="M416.3 129.1 L418.5 129 L420.7 128.3 L422.6 127.1 L424.1 125.4 L425.2 123.4 L425.6 121.2 L425.6 119 L424.9 116.8 L423.7 114.9 L422 113.4 L420 112.3 L417.8 111.8 L390.7 109.4 L388.4 109.5 L386.3 110.1 L384.4 111.3 L382.8 113 L381.8 115 L381.3 117.2 L381.4 119.5 L382 121.6 L383.2 123.5 L384.9 125 L386.9 126.1 L389.1 126.6 Z" fill="var(--white, #ffffff)"/>
      <path d="M98.4 100.9 L96.4 99.9 L94.2 99.5 L91.9 99.6 L89.8 100.4 L87.9 101.6 L86.4 103.3 L85.4 105.3 L85 107.5 L85.1 109.8 L85.9 111.9 L87.1 113.8 L88.8 115.3 L111 130.1 L113.1 131.1 L115.3 131.5 L117.5 131.4 L119.7 130.7 L121.5 129.4 L123 127.7 L124 125.7 L124.5 123.5 L124.3 121.2 L123.6 119.1 L122.3 117.2 L120.6 115.7 Z" fill="var(--white, #ffffff)"/>
    </g>
  </g>
</svg>`,
  },
]
// ============================================================================
// end of STICKERS
// ============================================================================

// README showcase with a cursor. Seven tiles, each the output of one skill, and
// one hand that works them in reading order: it starts a review, takes two
// fixes, turns motion on and ships; scrubs the film to the frame the name
// lands on; marks the sound's contact frame; picks a token; pulls a bezier
// handle; links the diagram; sends three stickers and clicks one shut.
//
// The loop closes on its own cause. The scene rests in the finished state with
// the mode on Ship. The first beat presses Review, which clears every tile the
// way starting a new review would; the last beats put it all back. So the
// first frame, the last frame and the poster are the same picture.

// ?record steps the stage on a virtual clock, one exact frame at a time.
const search = typeof location === 'undefined' ? '' : location.search
if (search.includes('record')) installVirtualClock({ fps: 20 })
const dark = search.includes('ground=dark')

// sticker: 0 none on the tile, 1 and 2 the first two have landed, 3 the third
// is on and held open, 4 it has been clicked and plays, 5 everything at rest.
type S = {
  tab: number; fix1: boolean; fix2: boolean; motion: boolean; shipped: boolean; checks: number
  t: number; hit: boolean; swatch: number; hx: number; hy: number; linked: boolean; sticker: number
}
const DONE: S = { tab: 2, fix1: true, fix2: true, motion: true, shipped: true, checks: 3, t: 18, hit: true, swatch: 6, hx: 64, hy: 84, linked: true, sticker: 5 }
const BLANK: S = { tab: 0, fix1: false, fix2: false, motion: false, shipped: false, checks: 0, t: 0, hit: false, swatch: 4, hx: 112, hy: 62, linked: false, sticker: 0 }
const REST = { x: 1150, y: 700 }

const WAVE = [18, 22, 44, 28, 196, 150, 108, 76, 56, 42, 34, 26, 32, 24, 20]
const HIT = 4
const RAMP = ['#eef4ff', '#d5e3ff', '#a9c4ff', '#6f9bff', '#3b72f6', '#2452c9', '#17357f', '#0e2152', '#f6f6f3', '#deded9', '#a9a9a3', '#55554f', '#fff1c9', '#ffd24a', '#f0a81e', '#b8730a']
const two = (n: number) => String(Math.round(n)).padStart(2, '0')

// What a sticker's own animation is doing: 'still' is its rested picture,
// 'hold' is frozen on its first frame, 'play' runs its story once.
const stickerMode = (slot: number, n: number) => {
  if (n === 0 || n === 5) return 'still'
  if (slot === STICKERS.length - 1) return n < 4 ? 'hold' : 'play'
  return n > slot ? 'play' : 'still'
}

const script = async (a: Act<S>) => {
  a.mark('start')
  await a.wait(800)

  // A new review clears the board
  await a.click({ at: 'tab-review', x: 0.82, y: 0.74 })
  await a.set(BLANK)
  await a.wait(550)

  // Two fixes, each taken where it is offered
  await a.click({ at: 'fix1', x: 0.9, y: 0.72 })
  await a.set({ fix1: true })
  await a.wait(450)
  await a.click({ at: 'fix2', x: 0.93, y: 0.72 })
  await a.set({ fix2: true })
  await a.wait(400)
  await a.click({ at: 'toggle', x: 0.3, y: 0.78 })
  await a.set({ motion: true })
  await a.wait(400)

  // The verdict, and the states it was waiting on
  await a.click({ at: 'ship', x: 0.82, y: 0.8 })
  await a.set({ shipped: true, tab: 2 })
  await a.stagger([1, 2, 3], (n) => a.set({ checks: n }), 150)
  await a.wait(400)

  // Scrub the film to the frame the name lands on
  const tr = a.rect('track')
  const y = tr.y + tr.height * 0.36
  await a.move({ x: tr.x + 3, y })
  await a.drag({ x: tr.x + tr.width * 0.6, y }, (p) => a.put({ t: Math.max(0, Math.min(30, ((p.x - tr.x) / tr.width) * 30)) }), { duration: 1300 })
  await a.set({ t: 18 })
  await a.wait(400)

  // The sound goes on its contact frame
  await a.click({ at: 'hit', x: 0.5, y: 0.82 })
  await a.set({ hit: true })
  await a.wait(500)

  // One token, chosen
  await a.click({ at: 'swatch', x: 0.7, y: 0.72 })
  await a.set({ swatch: 6 })
  await a.wait(400)

  // Pull the handle; the curve follows the hand
  const v = a.rect('vector')
  await a.move({ x: v.x + BLANK.hx, y: v.y + BLANK.hy })
  await a.drag({ x: v.x + DONE.hx, y: v.y + DONE.hy }, (p) => a.put({ hx: p.x - v.x, hy: p.y - v.y }), { duration: 900 })
  await a.set({ hx: DONE.hx, hy: DONE.hy })
  await a.wait(350)

  // Link the queue
  await a.click({ at: 'queue', x: 0.84, y: 0.78 })
  await a.set({ linked: true })
  await a.wait(500)

  // Send the stickers: two land and play, the lock lands open
  await a.click({ at: 'sticker-send', x: 0.5, y: 0.5 })
  await a.stagger([1, 2, 3], (n) => a.set({ sticker: n }), 130)
  await a.wait(1000)

  // Click the lock; it snaps shut once and holds
  await a.click({ at: 'sticker-hero', x: 0.56, y: 0.66 })
  await a.set({ sticker: 4 })
  await a.wait(1300)

  // Every sticker's story is 2.5s; by now each has ended on its rested still,
  // so naming that state changes nothing on screen
  await a.move(REST, { duration: 800 })
  await a.wait(450)
  await a.set({ sticker: 5 })
  await a.wait(450)
}

export default function KheReadme() {
  return (
    <Stage<S> width={1200} height={650} initial={DONE} poster={DONE} script={script}
      cursor={{ at: REST, style: 'large', idle: false }} className="kz" data-ground={dark ? 'dark' : undefined}>
      {(s) => (
        <div className="kz-grid" data-ground={dark ? 'dark' : undefined}>
          <section className="kz-tile kz-review">
            <div className="kz-panel">
              <div className="kz-card kz-seg" data-tab={s.tab}>
                <span className="kz-seg-pill" aria-hidden />
                <span className="kz-seg-item" data-target="tab-review" data-cursor="hand" data-on={s.tab === 0 || undefined}><Text>Review</Text></span>
                <span className="kz-seg-item" data-on={s.tab === 1 || undefined}><Text>Polish</Text></span>
                <span className="kz-seg-item" data-on={s.tab === 2 || undefined}><Text>Ship</Text></span>
              </div>
              <div className="kz-toggle" data-target="toggle" data-cursor="hand" data-on={s.motion || undefined} aria-hidden><i /></div>
              <div className="kz-card kz-stepper">
                <span className="kz-minus" aria-hidden />
                <Text className="kz-strong">250ms</Text>
                <span className="kz-plus" aria-hidden />
              </div>

              <div className="kz-card kz-change" data-target="fix1" data-cursor="hand" data-fixed={s.fix1 || undefined}>
                <code className="kz-old">ease-in</code>
                <span className="kz-arrow" aria-hidden />
                <code className="kz-new">ease-out</code>
              </div>
              <div className="kz-card kz-curve" data-on={s.fix1 || undefined}>
                <svg viewBox="0 0 150 124" aria-hidden>
                  <path className="kz-curve-axis" d="M14 110 H138 M14 110 V14" />
                  <path className="kz-curve-line" pathLength={100} d="M14 110 C 42 30, 78 14, 138 14" />
                  <circle className="kz-curve-dot" cx="138" cy="14" r="5" />
                </svg>
              </div>
              <div className="kz-verdict" data-target="ship" data-cursor="hand" data-done={s.shipped || undefined}>
                <span className="kz-check" aria-hidden /><Text>Ship it</Text>
              </div>

              <div className="kz-card kz-states">
                {['Hover', 'Focus', 'Empty'].map((label, n) => (
                  <div key={label} className="kz-state"><span className="kz-radio" data-on={s.checks > n || undefined} aria-hidden /><Text>{label}</Text></div>
                ))}
              </div>
              <div className="kz-card kz-change kz-change-2" data-target="fix2" data-cursor="hand" data-fixed={s.fix2 || undefined}>
                <code className="kz-old">scale(0)</code>
                <span className="kz-arrow" aria-hidden />
                <code className="kz-new">scale(0.95)</code>
              </div>
              <div className="kz-card kz-ratio"><Text className="kz-strong">4.5 : 1</Text></div>
              <div className="kz-card kz-size">
                <Text className="kz-dim">Input</Text>
                <Text className="kz-strong">16px</Text>
              </div>
            </div>
          </section>

          <section className="kz-tile kz-film">
            <div className="kz-window">
              <div className="kz-bar"><i /><i /><i /><Text className="kz-file">launch.mp4</Text></div>
              <div className="kz-screen">
                <Text className="kz-timecode">{`0:${two(s.t)}`}</Text>
                <Text className="kz-caption">name on screen at 0:18</Text>
                <div className="kz-tracks" data-target="track" data-cursor="hand">
                  <div className="kz-track">
                    <span style={{ flex: 14 }} />
                    <span style={{ flex: 46 }} />
                    <span style={{ flex: 16 }} data-on={s.t >= 17.6 || undefined} />
                    <span style={{ flex: 24 }} />
                  </div>
                  <div className="kz-track kz-track-2">
                    <span style={{ flex: 30 }} />
                    <span style={{ flex: 22 }} />
                    <span style={{ flex: 48 }} />
                  </div>
                  <b className="kz-playhead" style={{ left: `${(s.t / 30) * 100}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section className="kz-tile kz-sound">
            <div className="kz-wave" data-hit={s.hit || undefined}>
              {WAVE.map((h, n) => <span key={n} style={{ height: h, transitionDelay: `${Math.max(0, n - HIT) * 26}ms` }} data-on={n === HIT || undefined} data-tail={n >= HIT || undefined} />)}
            </div>
            <span className="kz-hitzone" data-target="hit" data-cursor="hand" aria-hidden />
            <div className="kz-frame" data-on={s.hit || undefined}><Text>f 42</Text></div>
          </section>

          <section className="kz-tile kz-tokens">
            <div className="kz-ramp">
              {RAMP.map((c, n) => <span key={c} style={{ background: c }} data-target={n === 6 ? 'swatch' : undefined} data-cursor={n === 6 ? 'hand' : undefined} />)}
              <b className="kz-ring" style={{ transform: `translate(${(s.swatch % 4) * 78}px, ${Math.floor(s.swatch / 4) * 78}px)` }} aria-hidden />
            </div>
          </section>

          <section className="kz-tile kz-vector" data-target="vector">
            <svg viewBox="0 0 183 258" preserveAspectRatio="xMinYMin meet" aria-hidden>
              <path className="kz-ink" d={`M26 222 C 26 130, ${s.hx} ${s.hy}, 96 132 S 158 222, 158 40`} />
              <line className="kz-handle" x1="26" y1="222" x2="26" y2="130" />
              <line className="kz-handle" x1="96" y1="132" x2={s.hx} y2={s.hy} />
              <circle className="kz-knob" cx="26" cy="130" r="6" />
              <circle className="kz-knob kz-knob-live" cx={s.hx} cy={s.hy} r="7" />
              <rect className="kz-anchor" x="18" y="214" width="16" height="16" rx="3" />
              <rect className="kz-anchor kz-anchor-on" x="88" y="124" width="16" height="16" rx="3" />
              <rect className="kz-anchor" x="150" y="32" width="16" height="16" rx="3" />
            </svg>
          </section>

          <section className="kz-tile kz-diagram" data-linked={s.linked || undefined}>
            <svg viewBox="0 0 183 258" preserveAspectRatio="xMinYMin meet" aria-hidden>
              <path className="kz-wire" d="M91.5 76 V104" />
              <path className="kz-wire kz-wire-2" pathLength={100} d="M91.5 154 V182" />
              <rect className="kz-box" x="24" y="24" width="135" height="52" rx="14" />
              <rect className="kz-box" x="24" y="103" width="135" height="52" rx="14" />
              <rect className="kz-box kz-box-on" data-target="queue" data-cursor="hand" x="24" y="182" width="135" height="52" rx="14" />
              <text className="kz-dtext" x="91.5" y="56.5">Client</text>
              <text className="kz-dtext" x="91.5" y="135.5">API</text>
              <text className="kz-dtext kz-dtext-on" x="91.5" y="214.5">Queue</text>
            </svg>
          </section>

          <section className="kz-tile kz-sticker">
            {/* The sheet: each sticker's silhouette marks its place while it is away */}
            <div className="kz-sheet" aria-hidden>
              {STICKERS.map((st, slot) => (
                <div key={st.file} className="kz-st-slot" data-slot={slot} data-mode="still" data-filled={s.sticker > slot || undefined} dangerouslySetInnerHTML={{ __html: st.svg }} />
              ))}
            </div>
            {STICKERS.map((st, slot) => (
              <div key={st.file} className="kz-st" data-slot={slot} data-in={s.sticker > slot || undefined} data-mode={stickerMode(slot, s.sticker)}
                data-target={slot === STICKERS.length - 1 ? 'sticker-hero' : undefined} data-cursor={slot === STICKERS.length - 1 ? 'hand' : undefined}
                dangerouslySetInnerHTML={{ __html: st.svg }} />
            ))}
            <div className="kz-compose">
              <div className="kz-compose-field"><Text className="kz-dim">Message</Text></div>
              <div className="kz-compose-send" data-target="sticker-send" data-cursor="hand"><StickerGlyph size={22} strokeWidth={2} aria-hidden /></div>
            </div>
          </section>
        </div>
      )}
    </Stage>
  )
}
