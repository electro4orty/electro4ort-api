import { diskStorage } from 'multer';
import { join } from 'path';

export const storage = diskStorage({
  destination: join(process.cwd(), 'uploads'),
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});
