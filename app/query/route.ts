import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function kapal() {
  const data = await sql`
    SELECT 
      nama_kapal, 
      tipe_kapal, 
      nama_kapten, 
      tujuan_kapal, 
      region_kapal, 
      status_kapal, 
      fuel_kapal
    FROM kapal;
  `;
  return data;
}

async function barang() {
  const data = await sql`
    SELECT 
      nama_lengkap,
      email,
      nomor_telepon,
      pelabuhan_asal,
      pelabuhan_tujuan,
      tanggal_pengiriman,
      jenis_kargo,
      deskripsi_kargo,
      berat_ton,
      volume_m3,
      catatan_tambahan
    FROM pengiriman_barang;
  `;
  return data;
}

export async function GET() {
  try {
    const data = await kapal();
    const dataBarang = await barang();

    const dapat_data = {
      success: true,
      message: "Data berhasil diambil",
      total_data: data.length,
      data: data,
      total_data_barang: dataBarang.length,
      data_barang: dataBarang
    };
    return new Response(JSON.stringify(dapat_data, null, 2), {
      status: 200,
      headers: {
        'tabel_data': 'isi_data',
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Gagal mengambil data", 
        error: errorMessage 
      }, null, 2), 
      { 
        status: 500,
        headers: { 'tabel_data': 'isi_data' }
      }
    );
  }
}