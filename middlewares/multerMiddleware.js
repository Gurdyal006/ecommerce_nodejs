import multer from "multer";

// direct upload on cloudinary server
const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");
