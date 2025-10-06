import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: false }
}, { _id: false });

const civicReportSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true,
        index: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    report_type: {
        type: String,
        required: true,
        enum: ['water_log', 'visibility', 'tree_fall', 'road_block']
    },
    description: {
        type: String,
        required: false
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    reporter_id: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'resolved', 'investigating']
    }
});

civicReportSchema.index({ "location.latitude": 1, "location.longitude": 1 });


const CivicReport = mongoose.model('CivicReport', civicReportSchema);

export default CivicReport;