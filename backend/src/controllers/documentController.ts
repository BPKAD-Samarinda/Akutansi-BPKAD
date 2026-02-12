
import { Request, Response } from 'express';
import db from '../config/db';

export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM documents');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    try {
        const { no_sppd, tanggal_sppd, nama_kegiatan, total_biaya } = req.body;
        const file_path = req.file ? req.file.path : null;

        if (!no_sppd || !tanggal_sppd || !nama_kegiatan || !total_biaya || !file_path) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await db.execute(
            'INSERT INTO documents (no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, file_path) VALUES (?, ?, ?, ?, ?)',
            [no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, file_path]
        );

        res.status(201).json({ message: 'Document created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { no_sppd, tanggal_sppd, nama_kegiatan, total_biaya } = req.body;

        if (!no_sppd || !tanggal_sppd || !nama_kegiatan || !total_biaya) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await db.execute(
            'UPDATE documents SET no_sppd = ?, tanggal_sppd = ?, nama_kegiatan = ?, total_biaya = ? WHERE id = ?',
            [no_sppd, tanggal_sppd, nama_kegiatan, total_biaya, id]
        );

        res.status(200).json({ message: 'Document updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM documents WHERE id = ?', [id]);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
