const {
  readFileSync,
  readdirSync,
  statSync,
  createWriteStream
} = require('fs-extra');

const textStrings = [];
const pathFiles = [];
const quotes = ["'", '"'];

const findInObject = (c="", d={}, s="") => {
  var cs = c;
  if(s){
      cs = cs.split(s)
  }
  rtn = "";
  if(Array.isArray(cs)){
      var accumulator = d
      for (var i = 0; i < cs.length; i++){
          if(accumulator[cs[i]]){
              accumulator=accumulator[cs[i]];
               rtn = accumulator
          }else{
              rtn = ""
              break;
          }
      };
  }else{
      if(d[c]){
          rtn = d[c]
      }
  }
  return rtn;
}

const getTextStrings = (pathfile = '', opts = {}) => {
  const options = opts || {};
  options.removeStart = opts.removeStart || '';
  options.removeEnd = opts.removeEnd || '';
  options.regex = opts.regex || '';
  options.split = opts.split || null;
  options.regexTextCaptureIndex =
    opts.regexTextCaptureIndex !== undefined ? opts.regexTextCaptureIndex : 1;
  options.definitions = opts.definitions !== undefined ? opts.definitions : {};
  let lineNum = 1;
  const lineString = readFileSync(pathfile).toString();
  let matches;
  // eslint-disable-next-line no-cond-assign
  while ((matches = options.regex.exec(lineString)) !== null) {
    let text = matches[options.regexTextCaptureIndex];
    if (options.removeStart) {
      text = text.replace(options.removeStart, '');
    }
    if (options.removeEnd) {
      text = text.replace(options.removeEnd, '');
    }
    // definition
    if (quotes.indexOf(text.charAt(0))) {
      text = `"${findInObject(text, options.definitions, options.split) || text}"`;
    } else {
      text = `"${text.replace(/"|'/g, '')}"`;
    }

    const findIndex = textStrings.findIndex(
      textString => textString && textString.msgid === text
    );
    const finder = lineString.substring(0, matches.index);
    lineNum = finder.split('\n').length;
    const location = `#: ${pathfile}:${lineNum}`;

    if (findIndex >= 0) {
      if (textStrings[findIndex].location.indexOf(location) === -1) {
        textStrings[findIndex].location.push(location);
      }
    } else {
      textStrings.push({
        msgid: text,
        msgstr: matches[opts.regexTextCaptureIndex],
        location: [location]
      });
    }
    lineNum = 1;
  }
};

const readFiles = (files = [], opts = {}) => {
  files.map(pathfile => {
    getTextStrings(pathfile, opts);
  });
  return textStrings;
};

const getFiles = (dir = '') => {
  const files = readdirSync(dir);
  files.forEach(file => {
    const name = `${dir}/${file}`;
    if (statSync(name).isDirectory()) {
      getFiles(name);
    } else {
      pathFiles.push(name);
    }
  });
  return pathFiles;
};

const generateFile = (filename = '') => {
  if (filename) {
    const stream = createWriteStream(filename);
    textStrings.map(textString => {
      if (textString && textString.location) {
        stream.write(`${textString.location.join('\r')}\r`);
      }
      if (textString && textString.msgid) {
        stream.write(`msgid ${textString.msgid}\r`);
      }
      if (textString && textString.msgstr) {
        stream.write(`msgstr ""\n\n`);
      }
    });
    stream.on('finish', () => {
      console.log(`created ${filename}`);
    });
    stream.end();
  }
};

const createReadStream = (dir = '', opts = {}) => {
  const urlFiles = getFiles(dir);
  readFiles(urlFiles, opts);
};

module.exports = {
  createReadStream,
  generateFile
};
