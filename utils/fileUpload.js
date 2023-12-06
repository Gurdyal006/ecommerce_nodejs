import DataURIParser from "datauri/parser.js";

import path from "path";

// for file upload extension and full details
export const getDataUri = (file) => {
  // Create an instance of the DataURIParser class
  const parser = new DataURIParser();

  // Extract the file extension from the original name of the file
  const extName = path.extname(file.originalname).toString();

  // Format and return the data URI using the parser and the file's buffer
  return parser.format(extName, file.buffer);
};
