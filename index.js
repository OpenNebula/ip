const {
  readFileSync,
  readdirSync,
  statSync,
  createWriteStream,
  unlinkSync
} = require('fs-extra');
const { parse } = require('path');

const pathFiles = [];
const defaultDefinition = {
  regex: /^msgid("|'| "| ')[a-zA-Z0-9_ ]*("|'| "| ')/g,
  removeStart: /msgid("|'| "| ')/g,
  removeEnd: /("|'| "| ')/g
};
const defaultValue = {
  regex: /^msgstr("|'| "| ')[a-zA-Z0-9_ ]*("|'| "| ')/g,
  removeStart: /msgstr("|'| "| ')/g,
  removeEnd: /("|'| "| ')/g
};
let options = {
  extension: [],
  exportPath: '',
  definition: defaultDefinition,
  value: defaultValue
};

const getTextStrings = (file = {}) => {
  if (file && file.name && file.path && file.string) {
    try {
      const lineString = readFileSync(file.path).toString();
      const lines = lineString.split(/\n|\r/g);
      lines.forEach((line, index) => {
        if (options && options.definition && options.value) {
          if (
            Array.isArray(options.definition.regex.exec(line)) &
            Array.isArray(options.value.regex.exec(lines[index + 1])) &&
            options.definition.removeStart instanceof RegExp &&
            options.definition.removeEnd instanceof RegExp &&
            options.value.removeStart instanceof RegExp &&
            options.value.removeEnd instanceof RegExp
          ) {
            let key = line.replace(options.definition.removeStart, '');
            key = key.replace(options.definition.removeEnd, '');
            let value = lines[index + 1].replace(options.value.removeStart, '');
            value = value.replace(options.value.removeEnd, '');
            // eslint-disable-next-line no-param-reassign
            file.string[key] = value;
          }
        }
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
};

const readFiles = (files = []) => {
  files.map(pathfile => {
    getTextStrings(pathfile);
  });
};

const getFiles = (dir = '') => {
  const files = readdirSync(dir);
  files.forEach(file => {
    const name = `${dir}/${file}`;
    if (statSync(name).isDirectory()) {
      getFiles(name);
    } else {
      const fileData = parse(name);
      if (
        fileData &&
        fileData.ext &&
        fileData.name &&
        options &&
        options.extension.includes(fileData.ext)
      ) {
        pathFiles.push({
          name: fileData.name,
          path: name,
          string: {}
        });
      }
    }
  });
  return pathFiles;
};

const generateFile = (remove = false ) => {
  pathFiles.forEach(file => {
    if (file && file.name && file.string && file.path) {
      try {
        const stream = createWriteStream(
          `${options.exportPath}/${file.name}.js`
        );
        stream.write(`lang="${file.name}"\r`);
        stream.write(`locale={\r`);
        const values = Object.entries(file.string);
        values.forEach(value => {
          stream.write(`  "${value[0]}":"${value[1]}",\r`);
        });
        stream.write(`}\r`);
      } catch (error) {}
      if(remove){
        try {
          unlinkSync(file.path)
        } catch(err) {
          console.error(err)
        }
      }
    }
  });
};

const createReadStream = (dir = '', opts = {}) => {
  options = opts || {};
  options.extension =
    opts.extension && Array.isArray(opts.extension) ? opts.extensions : ['.po'];
  options.exportPath = opts.exportPath || '';
  options.definition =
    opts.definition &&
    opts.definition.regex &&
    opts.definition.regex instanceof RegExp
      ? opts.definition.regex
      : defaultDefinition;
  options.value =
    opts.value && opts.value.regex && opts.value.regex instanceof RegExp
      ? opts.value.regex
      : defaultValue;
  const urlFiles = getFiles(dir);
  readFiles(urlFiles);
};

module.exports = {
  createReadStream,
  generateFile
};
