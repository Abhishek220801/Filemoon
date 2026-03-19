const FileModel = require("../model/file.model.js");

const createFile = async (req, res) => {
    try {
        const file = req.file;
        const payload = {
            filename: `${file.destination}${file.filename}`,
            type: file.mimetype.split('/')[0],
            size: req.file.size
        }
        const newFile = await FileModel.create(payload);
        res.status(200).json(newFile)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    createFile
}