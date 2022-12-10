import multer from 'multer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: async (req, file, cb) => {
    const fileName =
      new Date().toISOString().replace(/:/gi, '') + '-' + file.originalname;

    req.fileName = fileName;

    cb(null, fileName);
  },
});

const types = ['image/png', 'image.PNG', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
