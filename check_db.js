import mysql from 'mysql2/promise';

async function check() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akutansi_bpkad'
  });
  const [users] = await db.query('SELECT id, username, role FROM users');
  console.log('Users:', users);
  const [skp] = await db.query('SELECT id, nama_skp, uploaded_by FROM skp_documents ORDER BY id DESC LIMIT 5');
  console.log('SKP:', skp);
  await db.end();
}

check().catch(console.error);
