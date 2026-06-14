import { supabase } from '../lib/supabase';

const SCORE_LABEL = { 0: 'Tam məhdud (0)', 1: 'Qismən məhdud (1)', 2: 'Normal (2)' };
const CINSI_LABEL = { qadin: 'Qadın', kisi: 'Kişi' };
const YASAYIS_LABEL = { seher: 'Şəhər', rayon_merkezi: 'Rayon mərkəzi', kend: 'Kənd' };
const HIMAYE_LABEL = { her_iki_valideyn: 'Hər iki valideyn', tek_ana: 'Tək ana', tek_ata: 'Tək ata', resmi_qeyyum: 'Rəsmi qəyyum', kimsesiz: 'Kimsəsiz' };

function row(label, value) {
  return `<tr><td style="padding:4px 8px;width:45%;color:#555;font-size:12px">${label}</td><td style="padding:4px 8px;font-size:12px;font-weight:500">${value || '—'}</td></tr>`;
}

function sectionTitle(t) {
  return `<h3 style="margin:16px 0 6px;font-size:13px;font-weight:600;color:#1e40af;border-bottom:1px solid #dbeafe;padding-bottom:4px">${t}</h3>`;
}

function scoreTable(items, form) {
  const rows = items.map(({ code, label }) => {
    const val = form[code];
    const color = val === 0 ? '#dc2626' : val === 1 ? '#d97706' : val === 2 ? '#16a34a' : '#888';
    return `<tr style="border-bottom:1px solid #f1f5f9">
      <td style="padding:3px 6px;font-size:11px;color:#888;font-family:monospace">${code.toUpperCase()}</td>
      <td style="padding:3px 6px;font-size:11px">${label}</td>
      <td style="padding:3px 6px;font-size:11px;font-weight:600;color:${color}">${val !== null && val !== undefined ? SCORE_LABEL[val] : '—'}</td>
    </tr>`;
  }).join('');
  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

export async function generateUsaqPdf(usaqId) {
  // Bütün məlumatları yüklə
  const [usaqRes, fRes, b1Res, b2b8Res, dRes, e1Res, yekunRes] = await Promise.all([
    supabase.from('usaqlar').select('*').eq('id', usaqId).single(),
    supabase.from('bolme_f').select('*').eq('usaq_id', usaqId).maybeSingle(),
    supabase.from('bolme_b1').select('*').eq('usaq_id', usaqId).maybeSingle(),
    supabase.from('bolme_b2b8').select('*').eq('usaq_id', usaqId).maybeSingle(),
    supabase.from('bolme_d').select('*').eq('usaq_id', usaqId).maybeSingle(),
    supabase.from('bolme_e1').select('*').eq('usaq_id', usaqId).maybeSingle(),
    supabase.from('bolme_yekunlar').select('*').eq('usaq_id', usaqId).maybeSingle(),
  ]);

  const u = usaqRes.data || {};
  const f = fRes.data || {};
  const b1 = b1Res.data || {};
  const b2b8 = b2b8Res.data || {};
  const d = dRes.data || {};
  const e1 = e1Res.data || {};
  const y = yekunRes.data || {};

  const b1Items = [
    { code: 'b110', label: 'Şüur funksiyaları' },
    { code: 'b117', label: 'İntellektual funksiyalar' },
    { code: 'b134', label: 'Yuxu funksiyaları' },
    { code: 'b140', label: 'Diqqət funksiyaları' },
    { code: 'b144', label: 'Yaddaş funksiyaları' },
    { code: 'b147', label: 'Psixomotor funksiyalar' },
    { code: 'b152', label: 'Emosional funksiyalar' },
    { code: 'b156', label: 'Perseptiv funksiyalar' },
    { code: 'b164', label: 'Yüksək koqnitiv funksiyalar' },
  ];

  const b2b8Items = [
    { code: 'b210', label: 'Görmə funksiyaları' }, { code: 'b230', label: 'Eşitmə funksiyaları' },
    { code: 'b235', label: 'Vestibulyar funksiyalar' }, { code: 'b250', label: 'Dad bilmə' },
    { code: 'b255', label: 'İy bilmə' }, { code: 'b260', label: 'Proprioseptiv funksiya' },
    { code: 'b265', label: 'Toxunma funksiyası' }, { code: 'b280', label: 'Ağrı hissi' },
    { code: 'b310', label: 'Səs funksiyaları' }, { code: 'b320', label: 'Artikulyasiya' },
    { code: 'b330', label: 'Nitqin rəvanlığı' }, { code: 'b410', label: 'Ürək funksiyaları' },
    { code: 'b420', label: 'Qan təzyiqi' }, { code: 'b430', label: 'Hematoloji sistem' },
    { code: 'b435', label: 'İmmun sistem' }, { code: 'b440', label: 'Tənəffüs' },
    { code: 'b510', label: 'Qida qəbulu' }, { code: 'b515', label: 'Həzm funksiyaları' },
    { code: 'b525', label: 'Defekasiya' }, { code: 'b540', label: 'Metabolizm' },
    { code: 'b610', label: 'Sidik ifrazı' }, { code: 'b620', label: 'Sidik atma' },
    { code: 'b640', label: 'Cinsi funksiyalar' }, { code: 'b710', label: 'Oynaq hərəkətliliyi' },
    { code: 'b730', label: 'Əzələ gücü' }, { code: 'b735', label: 'Əzələ tonusu' },
    { code: 'b750', label: 'Motor refleks' }, { code: 'b755', label: 'İxtiyarsız hərəkətlər' },
    { code: 'b760', label: 'İxtiyari hərəkətlər' }, { code: 'b810', label: 'Dəri funksiyaları' },
    { code: 'b850', label: 'Tüklərin funksiyaları' },
  ];

  const dItems = [
    { code: 'd120', label: 'Digər məqsədli hiss etmə' }, { code: 'd130', label: 'Köçürmə/Kopyalama' },
    { code: 'd133', label: 'Dil bacarıqları' }, { code: 'd137', label: 'Anlayışların qazanılması' },
    { code: 'd140', label: 'Oxumağı öyrənmə' }, { code: 'd145', label: 'Yazmağı öyrənmə' },
    { code: 'd150', label: 'Hesablamağı öyrənmə' }, { code: 'd160', label: 'Diqqəti cəmləmə' },
    { code: 'd175', label: 'Problemləri həll etmə' }, { code: 'd176', label: 'Qərar vermə' },
    { code: 'd210', label: 'Tək tapşırığı yerinə yetirmə' }, { code: 'd220', label: 'Çoxsaylı tapşırıqlar' },
    { code: 'd230', label: 'Gündəlik fəaliyyəti planlaşdırma' }, { code: 'd250', label: 'Öz davranışını idarə' },
    { code: 'd310', label: 'Şifahi mesajları başa düşmə' }, { code: 'd315', label: 'Qeyri-şifahi mesajlar' },
    { code: 'd330', label: 'Danışma' }, { code: 'd335', label: 'Qeyri-şifahi mesaj istehsalı' },
    { code: 'd410', label: 'Bədən vəziyyətini dəyişdirmə' }, { code: 'd415', label: 'Bədən vəziyyətini saxlama' },
    { code: 'd430', label: 'Əşyaları qaldırma' }, { code: 'd435', label: 'Aşağı ətraflarla hərəkət' },
    { code: 'd445', label: 'Əl və qolun istifadəsi' }, { code: 'd450', label: 'Gəzmə/yeriş' },
    { code: 'd510', label: 'Özünü yumaq' }, { code: 'd530', label: 'Tualet ehtiyacları' },
    { code: 'd540', label: 'Geyinmə' }, { code: 'd550', label: 'Yemək' },
    { code: 'd560', label: 'İçmək' }, { code: 'd571', label: 'Öz sağlamlığına nəzarət' },
    { code: 'd710', label: 'Şəxsiyyətlərarası münasibətlər' }, { code: 'd720', label: 'Mürəkkəb münasibətlər' },
    { code: 'd815', label: 'Məktəbəqədər təhsil' }, { code: 'd880', label: 'Oyun fəaliyyəti' },
  ];

  const e1Items = [
    { code: 'e100', label: 'Ailənin maddi-məişət şəraiti' }, { code: 'e110', label: 'Ailənin gəlir səviyyəsi' },
    { code: 'e120', label: 'Mühitin təhlükəsizliyi' }, { code: 'e130', label: 'Ailədaxili münasibətlər' },
    { code: 'e140', label: 'Valideyn nəzarəti' }, { code: 'e145', label: 'Sosial xidmətlərdən istifadə' },
    { code: 'e146', label: 'Məktəblə əlaqə' },
  ];

  const sigLine = (name, role) => `
    <div style="display:flex;gap:32px;margin-bottom:12px;align-items:flex-end">
      <div style="flex:2;font-size:12px">${name}</div>
      <div style="flex:1;font-size:12px;color:#555">${role}</div>
      <div style="flex:2;border-bottom:1px solid #333;font-size:11px;padding-bottom:2px;color:#888">İmza</div>
    </div>`;

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>PTPK — ${u.c1_saa || 'Qiymətləndirmə'}</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1a1a1a; font-size: 12px; }
  h1 { font-size: 15px; text-align: center; margin: 0 0 4px; }
  h2 { font-size: 13px; text-align: center; color: #444; margin: 0 0 20px; }
  table { border-collapse: collapse; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<h1>Gəncə-Daşkəsən Regional Təhsil İdarəsinin nəzdində fəaliyyət göstərən</h1>
<h2>Samux Psixoloji–Tibbi–Pedaqoji Komissiyasının Qiymətləndirmə Sənədi</h2>

${sectionTitle('A — Ümumi Qeydiyyat')}
<table style="width:100%">
  ${row('A.1 Tarix', u.a1_tarix)}
  ${row('A.2 Qeydiyyat nömrəsi', u.a2_qeydiyyat_nomresi)}
  ${row('A.3 PTPK', u.a3_ptpk)}
</table>

${sectionTitle('C — Uşaq Haqqında Məlumat')}
<table style="width:100%">
  ${row('C.1 S.A.A', u.c1_saa)}
  ${row('C.2 Cinsi', CINSI_LABEL[u.c2_cinsi])}
  ${row('C.3 Doğum tarixi', u.c3_dogum_tarixi)}
  ${row('C.4 Şəhər/Rayon', u.c4_seher)}
  ${row('C.5 Yaşayış yeri tipi', YASAYIS_LABEL[u.c5_yasayis_yeri_tipi])}
  ${row('C.6 Qeydiyyat ünvanı', u.c6_qeydiyyat_unvan)}
  ${row('C.7 Yaşadığı ünvan', u.c7_yasadigi_unvan)}
</table>

${sectionTitle('G — Valideyn / Qəyyum')}
<table style="width:100%">
  ${row('G.1 Himayə statusu', HIMAYE_LABEL[u.g1_himaye_statusu])}
  ${row('G.2 Valideynin S.A.A', u.g2_valideyn_saa)}
  ${row('G.3 Telefon', u.g3_telefon)}
</table>

${sectionTitle('F — Tibbi Diaqnozlar')}
<table style="width:100%">
  ${row('F.1.1 Diaqnoz', f.f1_1_diaqnoz ? `${f.f1_1_diaqnoz} (${f.f1_1_kod || ''})` : null)}
  ${row('F.1.2 Diaqnoz', f.f1_2_diaqnoz ? `${f.f1_2_diaqnoz} (${f.f1_2_kod || ''})` : null)}
  ${row('F.1.3 Diaqnoz', f.f1_3_diaqnoz ? `${f.f1_3_diaqnoz} (${f.f1_3_kod || ''})` : null)}
</table>

${sectionTitle('B1 — Psixi Funksiyalar')}
${scoreTable(b1Items, b1)}

${sectionTitle('B2-B8 — Sensor, Nitq, Ürək-damar, Hərəkət, Dəri Funksiyaları')}
${scoreTable(b2b8Items, b2b8)}

${sectionTitle('D — Pedaqoq Qiymətləndirməsi')}
${scoreTable(dItems, d)}

${sectionTitle('E1 — Sosial Mühit Qiymətləndirməsi')}
${scoreTable(e1Items, e1)}
${e1.qeyd ? `<p style="margin:8px 0;font-size:12px"><strong>Qeyd:</strong> ${e1.qeyd}</p>` : ''}

${sectionTitle('J-K — Komissiya Qərarı')}
<table style="width:100%">
  ${row('J.1 Qərar tarixi', y.j1_qarar_tarixi)}
  ${row('J.2 Qərar nömrəsi', y.j2_qarar_nomresi)}
  ${row('K.1 Təhsil müəssisəsi', y.k1_tehsil_muessisesi)}
  ${row('H.8 Təhsil forması', y.h8_tehsil_formasi)}
  ${row('H.9 Müəssisə tipi', y.h9_muessise_tipi)}
  ${row('H.10 Təhsil proqramı', y.h10_tehsil_proqrami)}
  ${row('K.5 Qüvvədən düşmə tarixi', y.k5_quvveden_dusme)}
  ${row('K.6 Əsas', y.k6_esas)}
</table>

<div style="margin-top:32px">
  <h3 style="font-size:13px;font-weight:600;margin-bottom:16px">Komissiyanın İmzaları</h3>
  ${sigLine(y.sedr_ad || 'Sənayə Cabbarova', 'Sədr')}
  ${sigLine(y.katib_ad || 'Laçın Abbasova', 'Katib')}
  ${sigLine(y.uzv1_ad || 'Sunbul Əsədova', 'Üzv')}
  ${sigLine(y.uzv2_ad || 'Sabitə Nəsibova', 'Üzv')}
  ${sigLine(y.uzv3_ad || 'Ceyhun Həsənov', 'Üzv')}
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => { win.print(); }, 300);
    };
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
