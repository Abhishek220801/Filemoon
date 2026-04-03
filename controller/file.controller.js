const path = require("node:path");
const FileModel = require("../model/file.model.js");
const fs = require('node:fs');

const getType = (type) => {

    if(type === 'x-msdownload' || type === 'x-msdos-program')
        return "application/exe"

    return type;
}

const createFile = async (req, res) => {
    try {
        const {filename} = req.body;
        const file = req.file;
        const payload = {
            user: req.user.id,
            path: (file.destination+file.filename),
            filename,
            type: getType(file.mimetype),
            size: req.file.size
        }
        const newFile = await FileModel.create(payload);
        res.status(200).json(newFile)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const fetchFiles = async (req, res) => {
    try {
        const {limit} = req.query;
        const files = await FileModel.find({user: req.user.id})
            .sort({createdAt: -1})
            .limit(limit);
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

const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await FileModel.findById(id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const ext = file.type.split('/').pop();
        const filePath = path.join(__dirname, '..', file.path);

        console.log('__dirname:', __dirname);
        console.log('file.path from DB:', file.path);
        console.log('constructed filePath:', filePath);

        // check if file actually exists on disk before sending
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File does not exist on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext}"`);

        res.sendFile(filePath, (err) => {
            if(err) {
                console.log('Error downloading the requested file:', err);
                if(!res.headersSent){
                    return res.status(500).json({message: 'File not found'});
                }
            }
        });

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    createFile,
    fetchFiles,
    deleteFile,
    downloadFile
}