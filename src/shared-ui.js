// Small startup bridge for classic scripts; modules import the pure helpers directly.
import {escapeHTML,escapeHTMLString} from './html-escape.js';
import {applyAppFont} from './app-fonts.js';
window.BibleLensUI=Object.freeze({escapeHTML,escapeHTMLString,applyAppFont});
