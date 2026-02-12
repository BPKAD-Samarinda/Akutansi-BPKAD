"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/db");
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const app = express();
// portnya hrs beda dg frontend nan
const port = process.env.PORT || 3001;
// middlewarenya
app.use(cors()); // buat permintaan dari origin yang berbeda
app.use(express.json()); // buat parsing body JSON
// api routes
// pas make `require` di ES6 `export default`, perlu akses properti `.default`
app.use('/api/auth', authRoutes.default);
app.use('/api', documentRoutes.default);
// data boongan data mock
// niru struktur data di frontend
const mockDocuments = [
    {
        id: 1,
        name: "Lampiran 26 Maret 2024",
        size: "4.687 KB",
        date: "19 Maret 2024",
        format: "PDF",
        category: "Lampiran",
    },
    {
        id: 2,
        name: "Laporan Keuangan Triwulan 1",
        size: "2.130 KB",
        date: "1 April 2024",
        format: "XLSX",
        category: "Keuangan",
    },
    {
        id: 3,
        name: "Surat Perintah Tugas No.123",
        size: "850 KB",
        date: "5 April 2024",
        format: "DOCX",
        category: "Lampiran",
    },
];
// endpoint api
app.get('/api/test', (req, res) => {
    res.json({ message: 'Halo! Ini adalah respon dari server backend Anda.' });
});
// endpoint baru buat dapat semua dokumen
app.get('/api/documents', (req, res) => {
    res.json(mockDocuments);
});
app.listen(port, () => {
    console.log(`[server]: Server backend berjalan di http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map