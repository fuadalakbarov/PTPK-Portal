import * as XLSX from 'xlsx';

const CINSI_LABEL = {
  qadin: 'Qadın',
  kisi: 'Kişi',
};

const HIMAYE_LABEL = {
  her_iki_valideyn: 'Hər iki valideyn',
  tek_ana: 'Tək ana',
  tek_ata: 'Tək ata',
  resmi_qeyyum: 'Rəsmi qəyyum',
  kimsesiz: 'Kimsəsiz',
};

const STATUS_LABEL = {
  yeni: 'Yeni',
  hekim_gozleyir: 'Həkim gözləyir',
  psixoloq_gozleyir: 'Psixoloq gözləyir',
  pedaqoq_gozleyir: 'Pedaqoq gözləyir',
  sosial_gozleyir: 'Sosial işçi gözləyir',
  yekunlasdirilir: 'Yekunlaşdırılır',
  tamamlandi: 'Tamamlandı',
};

export function exportUsaqlarToExcel(usaqlar) {
  const rows = usaqlar.map((u) => ({
    'Qeydiyyat №': u.a2_qeydiyyat_nomresi || '',
    'Tarix': u.a1_tarix || '',
    'S.A.A': u.c1_saa || '',
    'Cinsi': CINSI_LABEL[u.c2_cinsi] || u.c2_cinsi || '',
    'Doğum tarixi': u.c3_dogum_tarixi || '',
    'Şəhər/Rayon': u.c4_seher || '',
    'Yaşayış yeri tipi': u.c5_yasayis_yeri_tipi || '',
    'Qeydiyyat ünvanı': u.c6_qeydiyyat_unvan || '',
    'Yaşadığı ünvan': u.c7_yasadigi_unvan || '',
    'Himayə statusu': HIMAYE_LABEL[u.g1_himaye_statusu] || u.g1_himaye_statusu || '',
    'Valideyn S.A.A': u.g2_valideyn_saa || '',
    'Telefon': u.g3_telefon || '',
    'Sinif': u.h6_sinif || '',
    'Tədris dili': u.h7_tedris_dili || '',
    'Status': STATUS_LABEL[u.status] || u.status || '',
    'Yaradılma tarixi': u.created_at
      ? new Date(u.created_at).toLocaleDateString('az-AZ')
      : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Sütun enlərini tənzimləyək
  worksheet['!cols'] = [
    { wch: 12 }, // Qeydiyyat №
    { wch: 12 }, // Tarix
    { wch: 28 }, // S.A.A
    { wch: 10 }, // Cinsi
    { wch: 14 }, // Doğum tarixi
    { wch: 18 }, // Şəhər/Rayon
    { wch: 16 }, // Yaşayış yeri tipi
    { wch: 28 }, // Qeydiyyat ünvanı
    { wch: 28 }, // Yaşadığı ünvan
    { wch: 18 }, // Himayə statusu
    { wch: 28 }, // Valideyn S.A.A
    { wch: 14 }, // Telefon
    { wch: 8 }, // Sinif
    { wch: 14 }, // Tədris dili
    { wch: 16 }, // Status
    { wch: 16 }, // Yaradılma tarixi
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Uşaqlar');

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `PTPK_Usaqlar_${dateStr}.xlsx`);
}
