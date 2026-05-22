import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('C:/laragon/www/Akutansi-BPKAD/backend/.env') });

async function fix() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
  const [users] = await db.query('SELECT id, username, role FROM users');
  console.log('Users:', users);
  
  const [skp] = await db.query('SELECT id, nama_skp, uploaded_by FROM skp_documents ORDER BY id DESC LIMIT 10');
  console.log('Recent SKP docs:', skp);

  // Fix any uploaded_by that are numeric IDs
  for (const doc of skp) {
    if (/^\d+$/.test(doc.uploaded_by)) {
      const user = users.find(u => u.id === parseInt(doc.uploaded_by));
      if (user) {
        console.log(`Fixing doc ${doc.id}: uploaded_by ${doc.uploaded_by} -> ${user.username}`);
        await db.execute('UPDATE skp_documents SET uploaded_by = ? WHERE id = ?', [user.username, doc.id]);
      }
    }
  }

  await db.end();
}

fix().catch(console.error);
