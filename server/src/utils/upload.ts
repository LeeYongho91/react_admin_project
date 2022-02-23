import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = file.originalname;
    cb(null, `${Date.now()}_${String(fileName)}`);
  },
});
const upload = multer({ storage: storage }).single('file');

export default upload;
