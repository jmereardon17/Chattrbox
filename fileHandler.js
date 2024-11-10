import fs from 'fs';
import path from 'path';
import extractFilePath from './extractFilePath.js';

const statusCodes = {
  ENOTFOUND: 404,
  ENOENT: 404
};

export default baseFolder => {
  const handleError = (err, res) => {
    const statusCode = statusCodes[err.code] || 500;
    const page = statusCode === 404 ? 'not-found.html' : 'error.html';
    const filePath = path.resolve(baseFolder, page);
    res.writeHead(statusCode);

    fs.readFile(filePath, (readError, data) => {
      if (readError) console.error(`File read error: ${readError.message}`);
      res.end(readError ? `An error occurred with handling the request: ${err.code}` : data);
    });
  };

  const handleFileRequest = (req, res) => {
    const filePath = extractFilePath(baseFolder, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        handleError(err, res);
        return;
      }

      const fileType = path.extname(filePath);
      let contentType;

      switch (fileType) {
        case '.mp4':
          contentType = 'video/mp4';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.txt':
          contentType = 'text/plain';
          break;
        case '.html':
          contentType = 'text/html';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.js':
          contentType = 'application/javascript';
          break;
        default:
          contentType = 'application/octet-stream';
          break;
      }

      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  };

  return { handleFileRequest };
};
