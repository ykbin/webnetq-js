import { ICON_MIME_TYPE } from './MIMETypes.mjs';
import { PNG_MIME_TYPE } from './MIMETypes.mjs';
import { HTML_MIME_TYPE } from './MIMETypes.mjs';
import { TEXT_MIME_TYPE } from './MIMETypes.mjs';
import { CSS_MIME_TYPE } from './MIMETypes.mjs';
import { JSON_MIME_TYPE } from './MIMETypes.mjs';
import { SVG_MIME_TYPE } from './MIMETypes.mjs';
import { JS_MIME_TYPE } from './MIMETypes.mjs';
import { WASM_MIME_TYPE } from './MIMETypes.mjs';
import { XH_MIME_TYPE } from './MIMETypes.mjs';
import { XC_MIME_TYPE } from './MIMETypes.mjs';

const ext2mime = {
  ".ico":  ICON_MIME_TYPE,
  ".png":  PNG_MIME_TYPE,
  ".html": HTML_MIME_TYPE,
  ".htm":  HTML_MIME_TYPE,
  ".txt":  TEXT_MIME_TYPE,
  ".wat":  TEXT_MIME_TYPE,
  ".css":  CSS_MIME_TYPE,
  ".json": JSON_MIME_TYPE,
  ".svg":  SVG_MIME_TYPE,
  ".js":   JS_MIME_TYPE,
  ".wasm": WASM_MIME_TYPE,
  ".h":    XH_MIME_TYPE,
  ".hh":   XH_MIME_TYPE,
  ".hpp":  XH_MIME_TYPE,
  ".c":    XC_MIME_TYPE,
  ".cc":   XC_MIME_TYPE,
  ".cpp":  XC_MIME_TYPE,
};

export default function(ext) {
  return ext2mime.hasOwnProperty(ext) ? ext2mime[ext] : "";
};
