const FileModel = require("../model/file.model.js");
const fs = require('node:fs');

const createFile = async (req, res) => {
    try {
        const file = req.file;
        const payload = {
            path: (file.destination+file.filename),
            filename: file.filename,
            type: file.mimetype.split('/')[0],
            size: req.file.size
        }
        console.log(payload)
        const newFile = await FileModel.create(payload);
        res.status(200).json(newFile)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const fetchFiles = async (req, res) => {
    try {
        const files = await FileModel.find();
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await FileModel.findById(id);

        if(!file) return res.status(404).json({message: 'No such file exists'});
        
        console.log(file);
        if(fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        };

        await FileModel.findByIdAndDelete(id);
        res.status(200).json({message: 'File deleted successfully'});
    } 
    catch (err) 
    {
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    createFile,
    fetchFiles,
    deleteFile
}