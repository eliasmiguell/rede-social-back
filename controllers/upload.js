import multer from 'multer';

const storege = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "../client/rede-social/public/upload")
  },
  filename: function (req, file, cd) {
    cd(null, Date.now()+file.originalname)
  }
});

export const upload = multer({storage:storege});

export const uploadController = (req, res)=>{
     const file = req.file
    return  res.status(200).json(file.filename)
}