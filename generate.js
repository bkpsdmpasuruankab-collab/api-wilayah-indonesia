const fs = require('fs');
const path = require('path');

// Memastikan folder tujuan static/api sudah ada
fs.mkdirSync(path.join(__dirname, 'static', 'api', 'districts'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'static', 'api', 'villages'), { recursive: true });

// 1. Memproses file districts.csv
console.log('⏳ Memproses data kecamatan (districts.csv)...');
try {
  const districtsCsv = fs.readFileSync(path.join(__dirname, 'districts.csv'), 'utf-8');
  const districtsLines = districtsCsv.split('\n');
  const districtsGrouped = {};

  districtsLines.forEach(line => {
    if (!line.trim()) return;
    const [id, regency_id, name] = line.split(',');
    if (!id || !regency_id || !name) return;
    
    if (!districtsGrouped[regency_id]) {
      districtsGrouped[regency_id] = [];
    }
    districtsGrouped[regency_id].push({ id, regency_id, name: name.trim() });
  });

  Object.keys(districtsGrouped).forEach(regencyId => {
    fs.writeFileSync(
      path.join(__dirname, 'static', 'api', 'districts', `${regencyId}.json`),
      JSON.stringify(districtsGrouped[regencyId], null, 2)
    );
  });
  console.log('✅ Data kecamatan berhasil dikonversi ke JSON!');
} catch (err) {
  console.error('❌ Gagal memproses districts.csv:', err.message);
}

// 2. Memproses file villages.csv
console.log('⏳ Memproses data desa/kelurahan (villages.csv)...');
try {
  const villagesCsv = fs.readFileSync(path.join(__dirname, 'villages.csv'), 'utf-8');
  const villagesLines = villagesCsv.split('\n');
  const villagesGrouped = {};

  villagesLines.forEach(line => {
    if (!line.trim()) return;
    const [id, district_id, name] = line.split(',');
    if (!id || !district_id || !name) return;

    if (!villagesGrouped[district_id]) {
      villagesGrouped[district_id] = [];
    }
    villagesGrouped[district_id].push({ id, district_id, name: name.trim() });
  });

  Object.keys(villagesGrouped).forEach(districtId => {
    fs.writeFileSync(
      path.join(__dirname, 'static', 'api', 'villages', `${districtId}.json`),
      JSON.stringify(villagesGrouped[districtId], null, 2)
    );
  });
  console.log('✅ Data desa/kelurahan berhasil dikonversi ke JSON!');
} catch (err) {
  console.error('❌ Gagal memproses villages.csv:', err.message);
}

console.log('\n🚀 Selesai! Semua file JSON di folder static sudah diperbarui.');