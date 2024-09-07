import path from 'path'
import express from 'express'
import multer from 'multer'


const router=express.Router()

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        const extname=path.extname(file.originalname)
        cb(null,`${file.filename}-${Date.now()}${extname}`) 
    }
})

const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
  
    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Images only"), false);
    } 
  };

  const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");


router.post('/',(req,res)=>{
    uploadSingleImage(req, res, (err) => {
        if (err) {
          res.status(400).send({ message: err.message });
        } else if (req.file) {
          res.status(200).send({
            message: "Image uploaded successfully",
            image: `/${req.file.path}`,
          });
        } else {
          res.status(400).send({ message: "No image file provided" });
        }
      });
    })
    
export default router;














// import path from 'path'
// import express from 'express'

// const router=express.Router()

// router.post('/',(req,res)=>{
//   const { image } = req.body;

//   if (!image) {
//     return res.status(400).send({ message: "No image provided" });
//   }

//   // Check if the image is a URL link
//   if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))) {
//     return res.status(200).send({
//       message: "Image uploaded successfully",
//       image: image,
//     });
//   }

//   // Check if the image is a file
//   if (req.file) {
//     const extname=path.extname(req.file.originalname)
//     res.status(200).send({
//       message: "Image uploaded successfully",
//       image: `/${req.file.path}${extname}`,
//     });
//   } else {
//     res.status(400).send({ message: "Invalid image format" });
//   }
// })

// export default router;