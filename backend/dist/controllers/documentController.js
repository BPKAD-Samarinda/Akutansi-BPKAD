"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getAllDocuments = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllDocuments = async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM documents');
        res.status(200).json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllDocuments = getAllDocuments;
const createDocument = async (req, res) => {
    try {
        const { no_sppd, tanggal_sppd, nama_kegiatan, total_biaya } = req.body;
        const file_path = req.file ? req.file.path : null;
        if (!no_sppd || !tanggal_sppd || !nama_kegiatan || !total_biaya || !file_path) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const [result] = await db_1.default.execute('INSERT INTO documents (no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, file_path) VALUES (?, ?, ?, ?, ?)', [no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, file_path]);
        res.status(201).json({ message: 'Document created successfully', data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createDocument = createDocument;
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { no_sppd, tanggal_sppd, nama_kegiatan, total_biaya } = req.body;
        if (!no_sppd || !tanggal_sppd || !nama_kegiatan || !total_biaya) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const [result] = await db_1.default.execute('UPDATE documents SET no_sppd = ?, tanggal_sppd = ?, nama_kegiatan = ?, total_biaya = ? WHERE id = ?', [no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, id]);
        res.status(200).json({ message: 'Document updated successfully', data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.execute('DELETE FROM documents WHERE id = ?', [id]);
        res.status(200).json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=documentController.js.map