import path from 'path';

const extractFilePath = (baseFolder, url) => {
  let filePath;
  let fileName = 'index.html';

  if (url.length > 1) fileName = url.substring(1); // remove "/" character

  filePath = path.resolve(baseFolder, fileName);
  return filePath;
};

export default extractFilePath;
