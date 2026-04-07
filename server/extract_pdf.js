const fs = require('fs');
const pdf = require('pdf-parse');

async function extractAll() {
  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0');
    const file = `ip/Lecture_${num}.pdf`;
    if (!fs.existsSync(file)) continue;
    const buf = fs.readFileSync(file);
    const data = await pdf(buf);
    console.log(`\n========== LECTURE ${num} ==========`);
    console.log(data.text.substring(0, 2500));
    console.log(`\n========== END LECTURE ${num} ==========`);
  }
}

extractAll().catch(console.error);
