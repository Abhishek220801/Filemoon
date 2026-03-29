const { default: mongoose } = require('mongoose');
const FileModel = require('../model/file.model.js')

const fetchDashboard = async (req, res) => {
    try {
        const reports = await FileModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: {
                        $arrayElemAt: [{ $split: ['$type', '/']}, 0]
                    },
                    total: { $sum: 1 }
                }
            },{
                $project: {
                    type: '$_id',
                    total: 1,
                    _id: 0,
                } 
            }
        ])
        res.status(200).json(reports)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = fetchDashboard;










