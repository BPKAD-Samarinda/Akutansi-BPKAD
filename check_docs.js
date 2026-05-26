import mysql from 'mysql2/promise';

async function check() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akuntansi_bpkad'
  });
  const [history] = await db.query({
    sql: `
      SELECT h.id, h.document_id, h.document_name, h.uploaded_by, h.status, h.file_path, h.file_size, h.created_at, h.edit_before, h.edit_after, d.tanggal_sppd 
      FROM document_history h
      LEFT JOIN documents d ON h.document_id = d.id
      WHERE h.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01 00:00:00')
      ORDER BY h.created_at DESC, h.id DESC
      LIMIT 10
    `,
    dateStrings: true
  });

  const mappedDocHist = history.map(row => {
    let docDate = row.tanggal_sppd || null;
    if (!docDate && row.edit_after) {
      try {
        const after = JSON.parse(row.edit_after);
        docDate = after.tanggal_sppd || null;
      } catch (e) {}
    }
    if (!docDate && row.edit_before) {
      try {
        const before = JSON.parse(row.edit_before);
        docDate = before.tanggal_sppd || null;
      } catch (e) {}
    }
    return {
      id: row.id,
      document_id: row.document_id,
      document_name: row.document_name,
      uploaded_by: row.uploaded_by,
      status: row.status,
      created_at: row.created_at,
      tanggal_sppd: row.tanggal_sppd,
      edit_before: row.edit_before,
      edit_after: row.edit_after,
      resolved_doc_date: docDate
    };
  });

  console.log('Mapped document history:', JSON.stringify(mappedDocHist, null, 2));
  await db.end();
}

check().catch(console.error);
