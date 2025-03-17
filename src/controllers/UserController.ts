import { Request, Response } from "express";
import { User } from "../types";
import { signup } from "../middlewares/UserMiddleware";
import { S3Client } from "@aws-sdk/client-s3"; 
import multer from "multer";
import multerS3 from "multer-s3"; 

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const upload = multer({
    storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME!,
            acl: "public-read", 
            key: function (req, file, cb) {
            const fileName = `profile-images/${Date.now().toString()}-${file.originalname}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (validFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

export const register = async (request: Request, response: Response) => {
    try {
        upload.single("image")(request, response, async(err) => {
            if (err instanceof multer.MulterError) {
                response.status(400).json({ message: err.message }); 
                return ;
            } else if (err) {
                response.status(400).json({ message: err.message }); 
                return ;
            }
            const { firstName, lastName, email, password } = request.body;
            const file = request.file as Express.MulterS3.File;
            if (!file) {
                return response.status(400).json({ message: "File upload failed" });
            }
            const avatarURI = file.location;
            if (!firstName || !lastName || !email || !password) {
                response.status(400).json({ message: "Required all attributes" })
                return;
            }
            const userExists = await signup({firstName, lastName, email, password, avatarURI} as User);
            if(userExists) {
                response.status(401).json({message: "User already exists"});
                return ;
            }
            response.status(200).json({message: "Successfully created user"});
        });
    } catch (error) {
        response.status(500).json({ message: "Internal server error", error });
    }
};