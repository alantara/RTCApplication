//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect';

//Snowflake
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Multer
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.cwd()}\\ImageDir`)
    },
    filename: function (req, file, cb) {
        let fileID = `${(uid.idFromTimestamp(Date.now())).toString()}.${file.mimetype.split("/").pop()}`
        cb(null, fileID)
    }
})
const upload = multer({ storage: storage })

const ImageRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

ImageRoute.use(upload.single("image_upload"));


//Image route
ImageRoute.post((req, res) => {
    res.status(201).json({ FILENAME: (req as any).file.filename });
});

export default ImageRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};