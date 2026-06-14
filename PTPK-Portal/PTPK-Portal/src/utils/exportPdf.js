import { supabase } from '../lib/supabase';

const CINSI_LABEL = { qadin: 'Qadın', kisi: 'Kişi' };
const YASAYIS_LABEL = { seher: 'Şəhər (1)', rayon_merkezi: 'Rayon mərkəzi (2)', kend: 'Kənd (3)' };
const HIMAYE_LABEL = {
  her_iki_valideyn: 'a) Hər iki valideyn (1)',
  tek_ana: 'b) Tək ana (2)',
  tek_ata: 'c) Tək ata (3)',
  resmi_qeyyum: 'd) Rəsmi qəyyum/himayəçi (4)',
  kimsesiz: 'e) Kimsəsiz (5)',
};
const SCORE_LABEL = { 0: '0 – Tam məhdud', 1: '1 – Məhdud', 2: '2 – Yaxşı' };

const TEHSIL_FORMASI_LABEL = { eyani: 'Əyani', mesafeden: 'Məsafədən (distant)', ferdi: 'Fərdi (evdə)' };
const MUESSISE_TIPI_LABEL = {
  umumi: 'Ümumi təhsil müəssisəsi',
  xususi: 'Xüsusi təhsil müəssisəsi',
  inkluziv: 'İnklüziv təhsil (ümumi məktəbdə)',
};
const TEHSIL_PROQRAMI_LABEL = {
  umumi: 'Ümumi təhsil proqramı (1)',
  ferdilesdirilmis: 'Fərdiləşdirilmiş tədris proqramı (FTP)',
  xususi: 'Xüsusi (korreksiyaedici) proqram',
};

function val(v) { return v || ''; }

function scoreTableHtml(items, form) {
  const rows = items.map(({ code, label }) => {
    const v = form[code];
    const scoreText = (v !== null && v !== undefined) ? SCORE_LABEL[v] : '';
    return `<tr>
      <td style="width:70px;padding:3px 6px;border:1px solid #999;font-size:10px;font-family:monospace">${code.toUpperCase()}</td>
      <td style="padding:3px 6px;border:1px solid #999;font-size:10px">${label}</td>
      <td style="width:130px;padding:3px 6px;border:1px solid #999;font-size:10px;text-align:center">${scoreText}</td>
    </tr>`;
  }).join('');
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:8px">
    <thead><tr>
      <th style="width:70px;padding:3px 6px;border:1px solid #999;font-size:10px;background:#f0f0f0;text-align:left">Kod</th>
      <th style="padding:3px 6px;border:1px solid #999;font-size:10px;background:#f0f0f0;text-align:left">Göstərici</th>
      <th style="width:130px;padding:3px 6px;border:1px solid #999;font-size:10px;background:#f0f0f0;text-align:center">0 – Tam məhdud | 1 – Məhdud | 2 – Yaxşı</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function sectionH2(text) {
  return `<h3 style="font-size:11px;font-weight:bold;margin:14px 0 4px;background:#dbeafe;padding:4px 8px;border-left:4px solid #1e40af">${text}</h3>`;
}

function blankLine(label, value, width) {
  const w = width || '100%';
  return `<div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:6px;width:${w}">
    <span style="font-size:11px;white-space:nowrap">${label}</span>
    <span style="flex:1;border-bottom:1px solid #333;font-size:11px;padding-bottom:1px">${val(value)}</span>
  </div>`;
}

export async function generateUsaqPdf(usaqId) {
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

  const sedr = val(y.sedr_ad) || 'Sənayə Cabbarova';
  const katib = val(y.katib_ad) || 'Laçın Abbasova';
  const uzv1 = val(y.uzv1_ad) || 'Sunbul Əsədova';
  const uzv2 = val(y.uzv2_ad) || 'Sabitə Nəsibova';
  const uzv3 = val(y.uzv3_ad) || 'Ceyhun Həsənov';

  function sigRow(ad, vezife) {
    return `<tr>
      <td style="padding:6px 8px;font-size:11px;width:120px"><em>imza</em></td>
      <td style="padding:6px 8px;font-size:11px;font-weight:bold;width:100px">${vezife}:</td>
      <td style="padding:6px 8px;font-size:11px;width:160px;border-bottom:1px solid #333"></td>
      <td style="padding:6px 8px;font-size:11px">${ad}</td>
    </tr>`;
  }

  const b1Items = [
    { code: 'b110', label: 'Davamlı qaydada şüurun aydınlığı' },
    { code: 'b117', label: 'İntellektin inkişaf səviyyəsi' },
    { code: 'b134', label: 'Rahat yuxuya getmə və sabit yuxu' },
    { code: 'b140', label: 'Fəaliyyətlərə yaxud insanlara diqqətin cəmlənməsi' },
    { code: 'b144', label: 'Məlumatın yadda saxlanması və xatırlanması' },
    { code: 'b147', label: 'Motor və psixi funksiyaların idarə olunması (əllə gözün koordinasiyası, ardıcıl hərəkətlərin yerinə yetrilməsi)' },
    { code: 'b152', label: 'Təfəkkür prosesinin affektiv komponentləri və hisslərin idarə olunması (emosiyanın adekvatlığı, tənzimlənməsi, affekt)' },
    { code: 'b156', label: 'Eşitmə, görmə, qoxubilmə, dadbilmə, lamisə hisslərini tanıması və ifadə etməsi' },
    { code: 'b164', label: 'Abstrakt düşüncə və çətin problemlərin həlli bacarığı' },
  ];

  const b2b8Items = [
    { code: 'b210', label: 'Görmə qabiliyyəti' },
    { code: 'b230', label: 'Eşitmə qabiliyyəti' },
    { code: 'b235', label: 'Vestibulyar duyğular' },
    { code: 'b250', label: 'Dadların duyulması' },
    { code: 'b255', label: 'Qoxu hissi (anosmiya və ya hiposmiya kimi pozuntular)' },
    { code: 'b260', label: 'Propriosepsiya hissi (bədən üzüvlərinin nisbi mövqeyinin hiss edilməsi)' },
    { code: 'b265', label: 'Lamisə duyğusu (səthlər, onların fakturaları və ya keyfiyyətinin duyulması)' },
    { code: 'b280', label: 'Bədənin hər hansı bir orqanında potensial və ya faktiki zədələnməsinə işarə edən narahatlığın (ağrıların) hiss olunması' },
    { code: 'b310', label: 'Havanın qırtlaqdan keçməsi yolu ilə müxtəlif səslərin yaranması funksiyaları' },
    { code: 'b320', label: 'Artikulyasiya (Danışıq səslərinin yaranması)' },
    { code: 'b330', label: 'Səlis və ritmli nitqin olması (Kəkələmə, pəltəkləmə, bradilaliya və taxilaliya kimi pozuntular)' },
    { code: 'b410', label: 'Ürəyin bütün bədən boyunca yetərli və zəruri miqdarda qanla təmin etməsi' },
    { code: 'b420', label: 'Arteriyalar daxilində qan təzyiqinin sabit və normada olması' },
    { code: 'b430', label: 'Qanın yaranması, qanın laxdalanması, qazların, metabolitlərin nəqli' },
    { code: 'b435', label: 'Hər hansı bir canlıya, bitkiyə və qıdaya qarşı allerqik reaksiya yaxud hiperhəssaslığın olmaması' },
    { code: 'b440', label: 'Nəfəs alma, hava və qan arasındakı qaz mübadiləsində məhdudiyyətin olmaması' },
    { code: 'b510', label: 'Qidanın ağızda çeynənməsi və udulması' },
    { code: 'b515', label: 'Qəbul olunmuş qidanın mədə-bağırsaq traktı ilə nəqli, parçalanması və nutriyentlərin sorulması' },
    { code: 'b525', label: 'Bağırsaqların fəaliyyəti və defekasiya' },
    { code: 'b540', label: 'Karbohidratlar, zülallar və yağlar kimi bədənin zəruri komponentlərinin tənzimlənməsi funksiyaları' },
    { code: 'b610', label: 'Sidiyin böyrəklərdən süzülməsi və sidik kisəsində saxlanılması' },
    { code: 'b620', label: 'Sidiyin sidik kisəsindən ifrazı' },
    { code: 'b640', label: 'Cinsi oyanmanın yaşa uyğun olması' },
    { code: 'b710', label: 'Fəqərə sütunu, bazu, dirsək, bilək, bud çanaq, diz, pəncə və digər xırda oynaqların sərbəst və rahat hərəkət etdirilməsi' },
    { code: 'b730', label: 'Bədən əzələlərində süstlüyün (hipotonus) olmaması' },
    { code: 'b735', label: 'Bədən əzələlərində gərginliyin (hipertonusun) olmaması' },
    { code: 'b750', label: 'Əzələlərdə qeyri-iradi əzələ yığılmasının (kontraktsiya) olmaması' },
    { code: 'b755', label: 'Bədənin tarazlığının saxlanması və bədənin idarə olunması' },
    { code: 'b760', label: 'Əl və ayaq hərəkətlərinin idarə olunması' },
    { code: 'b810', label: 'Dəri həssaslığının və qıcıqlamasının olmaması' },
    { code: 'b850', label: 'Tüklərin piqmentasiyası və görünüş (tüklərin tökülməsi və ya dazlaşma)' },
  ];

  const dItems = [
    { code: 'd120', label: 'Duyğu və hisslər vasitəsilə (əşyaları toxunaraq, qoxulayaraq, dadına baxaraq) ətraf mühiti qavraması' },
    { code: 'd130', label: 'Nümayiş olunan jestləri, mimikaları yaxud səsləri yamsılaması' },
    { code: 'd133', label: 'Sözlər və cümlələr vasitəsilə fikirlərin ifadə edilməsi' },
    { code: 'd137', label: 'Miqdar, ölçü, uzunluq, oxşarlıq və fərqlik kimi anlayışların dərk edilməsi' },
    { code: 'd140', label: 'Oxu bacarığının formalaşması üçün məhdudiyyətin olmaması (hərf, simvol və sözləri tələffüz etməyin elementar üsullarını qavramaq bacarığının olması. Söz və ifadələrin mənasını anlaması)' },
    { code: 'd145', label: 'Yazı bacarıqlarının mənimsənilməsi üçün məhdudiyyətin olmaması (qələm, təbaşir və ya fırçanı əldə tutması, klaviatura istifadə etməklə işarə və ya simvol yazması)' },
    { code: 'd150', label: 'Hesablama bacarıqlarının mənimsənilməsi üçün məhdudiyyətin olmaması (saylar, riyazi işarələri tanıması və istifadə etməsi, say və miqdar anlayışlarını mənimsəmək üçün elementar bacarıqların olması)' },
    { code: 'd160', label: 'Diqqətin məqsədyönlü şəkildə müəyyən fəaliyyət yaxud əşya üzərində cəmləşdirilməsi (diqqəti yayındıran səs-küyə fikir verməməsi)' },
    { code: 'd175', label: 'Sadə və mürəkkəb problemlərin həlli' },
    { code: 'd176', label: 'Təhsil aldığı proqram üzrə keçdiyi dərslərin mənimsənməsi' },
    { code: 'd210', label: 'Hər hansı bir sadə və ya mürəkkəb tapşırığın müstəqil surətdə və ya qrup şəklində yerinə yetrilməsi' },
    { code: 'd220', label: 'Bir neçə sadə yaxud mürəkkəb tapşırığın ardıcıl surətdə və ya eyni zamanda müstəqil və ya qrup şəklində yerinə yetrilməsi' },
    { code: 'd230', label: 'Valideynlərin təlimatlarına uyğun olaraq gündəlik ev işlərinin və ya vəzifələrinin yerinə yetrilməsi' },
    { code: 'd250', label: 'Yeni mühitdə və ya yeni insanlarla qarşılaşan zaman başqaları ilə müsbət davranması və fəallıq səviyyəsini tələblərə müvafiq uyğunlaşdırılması' },
    { code: 'd310', label: 'Başqalarının danışığını başa düşməsi' },
    { code: 'd315', label: 'Şəkillərin, jestlərin mənasının başa düşülməsi (gözlərini ovuşduran uşağın yorğun olduğunu anlamaq)' },
    { code: 'd330', label: 'Danışmağı bacarması' },
    { code: 'd335', label: 'Ünsiyyətə girmək məqsədi ilə jestlərdən, simvollardan, şəkillərdən istifadə olunması' },
    { code: 'd410', label: 'Müstəqil şəkildə bədənin vəziyyətinin dəyişdirilə bilməsi bacarığı (çevrilmək, oturmaq, durmaq, uzanmaq)' },
    { code: 'd415', label: 'Tapşırıq əsasında bədənin vəziyyətini sabit vəziyyətdə saxlaması (ayaq üstə və ya oturaq vəziyyətdə qalmaq)' },
    { code: 'd430', label: 'Əşya və ya obyektlərin qaldırılması və daşınması' },
    { code: 'd435', label: 'Əşya və ya obyektlərin aşağı ətrafların köməyi ilə hərəkət etdirilməsi' },
    { code: 'd445', label: 'Əllər və qollardan istifadə (əşyaları özünə tərəf çəkmək və ya itələmə; əlləri və ya qolları çevirmə, yaxud burma; tullama; əşyanı atıb-tutmaq)' },
    { code: 'd450', label: 'Yerimək bacarığının olması' },
    { code: 'd510', label: 'Bədənin yaxud bədən hissələrinin yuyulması və qurulanması (çimmək, əlləri, ayaqları, üzü və saçları yumaq, dəsmal ilə qurulama)' },
    { code: 'd530', label: 'Sidik və defekasiya ehtiyacının yaranmasının hiss edilməsi, tualetdən istifadə etmək və sonrakı gigiyenik tədbirlərin icrası' },
    { code: 'd540', label: 'Paltar və ayaqqabıların geyinilməsi və çıxarılması' },
    { code: 'd550', label: 'Qida qəbulu zərurətinin yaranması və müstəqil olaraq qidanın qəbul edilməsi' },
    { code: 'd560', label: 'İçki qəbulu zərurətinin yaranması və müstəqil olaraq içkinin qəbul edilməsi' },
    { code: 'd571', label: 'Özünə qarşı fəsada səbəb ola biləcək təhlükələrdən qorunmaq' },
    { code: 'd710', label: 'Başqaları ilə qarşılıqlı əlaqələrin saxlanması (başqalarının hisslərinə qarşılıq verilməsi, hörmət və dözümlülüyün nümayiş etdirilməsi, münasibətlərdə müvafiq fiziki təmasdan istifadə)' },
    { code: 'd720', label: 'Başqaları ilə fəal sosial qaydalara müvafiq əlaqələrin qurulması və saxlanması (qrup oyunlarında fəal iştirak, emosiyaların idarə olunması, sosial qayda və ənənələrə müvafiq hərəkət etmə)' },
    { code: 'd815', label: 'Məktəbəqədər proqram üzrə biliklərin evdə və ya təhsil müəssisəsində əldə edilməsi' },
    { code: 'd880', label: 'Təkbaşına yaxud qrupda müxtəlif oyun fəaliyyətlərində iştirak etməsi' },
  ];

  const e1Items = [
    { code: 'e100', label: 'Ailə uşağa yaxşı qayğı göstərir. Ailədə uşağa qarşı etinasızlıq, zorakılıq və istismar halları yoxdur.' },
    { code: 'e110', label: 'Uşaq tam ailədə yaşayır' },
    { code: 'e120', label: 'Uşağın rifahını təmin edən, onun yaşaması üçün heç bir təhlükə yaratmayan lazımı mebel və avadanlıqla təmin olunmuş evi vardır' },
    { code: 'e130', label: 'Uşağın sağlamlığı ilə bağlı ehtiyacları qarşılanır (peyvənd olunub və digər profilaktik işlər aparılır; xəstələndikdə müalicə olunur)' },
    { code: 'e140', label: 'Uşağın yemək rastionu zəngindir və sağlam qidalanma rejimi vardır (gündə 3-4 dəfə, o cümlədən meyvə, tərəvəz, süd məhsulları, ət, balıq və un məmulatları)' },
    { code: 'e145', label: 'Uşağın xüsusi ehtiyacları müəyyən edilmişdir və o bütün imtiyazlardan istifadə edir. Valideynləri uşağın xüsusi ehtiyaclarının qarşılanmasına dair bilik və bacarıqlara malikdirlər.' },
    { code: 'e146', label: 'Uşaq ailə üzvləri ilə və həyətdə həmyaşıdları ilə fəal ünsiyyətdədir. Müntəzəm olaraq həyətə çıxaraq uşaqlarla oynayır.' },
  ];

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>PTPK Qiymətləndirmə — ${val(u.c1_saa)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px 28px; color: #1a1a1a; font-size: 11px; }
  h1 { font-size: 13px; text-align: center; margin: 0; font-weight: bold; }
  h2 { font-size: 12px; text-align: center; font-weight: bold; margin: 2px 0 16px; }
  .section-title { font-size: 11px; font-weight: bold; background: #e8edf5; padding: 4px 8px; margin: 12px 0 6px; border-left: 3px solid #2563eb; }
  table { border-collapse: collapse; }
  .info-table { width: 100%; margin-bottom: 8px; }
  .info-table td { padding: 3px 6px; font-size: 11px; vertical-align: top; }
  .label { color: #444; width: 200px; }
  .blank { border-bottom: 1px solid #555; min-width: 120px; }
  .checkbox-row { display: flex; gap: 24px; flex-wrap: wrap; margin: 4px 0; }
  .checkbox-item { font-size: 11px; display: flex; align-items: center; gap: 4px; }
  @media print { body { padding: 8px 14px; } @page { margin: 1cm; } }
</style>
</head>
<body>

<!-- BAŞLIK -->
<h1>Gəncə-Daşkəsən Regional Təhsil İdarəsinin nəzdində fəaliyyət göstərən</h1>
<h2>Samux Psixoloji–tibbi–pedaqoji komissiyasının QƏRARI</h2>

<!-- YEKUN QARAR HISSESI -->
<div class="section-title">J. Qərarın Qeydiyyatı</div>
<table class="info-table">
  <tr>
    <td class="label">J.1. Qərar tarixi:</td>
    <td><span class="blank">${val(y.j1_qarar_tarixi)}</span></td>
    <td class="label" style="padding-left:24px">J.2. Qərar qeydiyyat nömrəsi:</td>
    <td><span class="blank">${val(y.j2_qarar_nomresi)}</span></td>
  </tr>
</table>

<div class="section-title">K. Komissiya Qərarı</div>
<table class="info-table">
  <tr><td class="label">K.1. Təhsil müəssisəsi:</td><td colspan="3"><span class="blank" style="display:inline-block;width:100%">${val(y.k1_tehsil_muessisesi)}</span></td></tr>
  <tr><td class="label">K.5. Qərarın qüvvədən düşmə tarixi:</td><td colspan="3"><span class="blank">${val(y.k5_quvveden_dusme)}</span></td></tr>
</table>

<div style="display:flex;gap:16px;margin-bottom:8px">
  <div style="flex:1">
    <div style="font-size:11px;font-weight:bold;margin-bottom:4px">H.8. Təhsil alma forması:</div>
    <div style="font-size:11px;border:1px solid #aaa;padding:4px 8px;min-height:20px">${TEHSIL_FORMASI_LABEL[y.h8_tehsil_formasi] || ''}</div>
  </div>
  <div style="flex:1">
    <div style="font-size:11px;font-weight:bold;margin-bottom:4px">H.9. Təhsil müəssisəsinin tipi:</div>
    <div style="font-size:11px;border:1px solid #aaa;padding:4px 8px;min-height:20px">${MUESSISE_TIPI_LABEL[y.h9_muessise_tipi] || ''}</div>
  </div>
</div>

<div style="font-size:11px;font-weight:bold;margin-bottom:2px">H.10. Təhsil proqramı:</div>
<div style="font-size:11px;border:1px solid #aaa;padding:4px 8px;margin-bottom:8px;min-height:20px">${TEHSIL_PROQRAMI_LABEL[y.h10_tehsil_proqrami] || ''}</div>

<div style="font-size:11px;font-weight:bold;margin-bottom:2px">K.6. Əsas:</div>
<div style="font-size:11px;border:1px solid #aaa;padding:4px 8px;margin-bottom:12px;min-height:36px">${val(y.k6_esas)}</div>

<!-- İMZALAR -->
<div style="font-size:11px;font-weight:bold;margin-bottom:4px">Psixoloji–tibbi–pedaqoji</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
  ${sigRow(sedr, 'Komissiyanın sədri')}
  ${sigRow(katib, 'Katib')}
  ${sigRow(uzv1, 'Üzv')}
  ${sigRow(uzv2, 'Üzv')}
  ${sigRow(uzv3, 'Üzv')}
</table>

<div style="border-top:2px solid #333;margin:20px 0 16px"></div>

<!-- QIYMETLENDIRME HISSESI -->
<h1 style="margin-bottom:2px">Sağlamlıq imkanı məhdud şəxslərin təhsil ehtiyaclarının müəyyənləşdirilməsi üçün təfsilatlı qiymətləndirmə</h1>
<h2 style="font-weight:normal;font-size:11px">Sağlamlıq imkanları məhdud şəxsin PTPK tərəfindən müayinəsinin qeydiyyatı</h2>

<!-- A BOLMESI -->
<div class="section-title">A. Qeydiyyat</div>
<table class="info-table">
  <tr>
    <td class="label">A.1. Tarix:</td>
    <td><span class="blank">${val(u.a1_tarix)}</span></td>
    <td class="label" style="padding-left:24px">A.2. Qeydiyyat nömrəsi:</td>
    <td><span class="blank">${val(u.a2_qeydiyyat_nomresi)}</span></td>
  </tr>
  <tr>
    <td class="label">A.3. Müayinə aparan PTPK:</td>
    <td colspan="3"><span class="blank" style="display:inline-block;width:80%">${val(u.a3_ptpk)}</span></td>
  </tr>
</table>

<!-- C BOLMESI -->
<div class="section-title">C. Sağlamlıq imkanları məhdud şəxs haqqında məlumat</div>
<table class="info-table">
  <tr><td class="label">C.1. S.A.A:</td><td colspan="3"><span class="blank" style="display:inline-block;width:90%">${val(u.c1_saa)}</span></td></tr>
  <tr>
    <td class="label">C.2. Cinsi:</td>
    <td>Qadın (1) [${u.c2_cinsi === 'qadin' ? '✓' : '  '}]&nbsp;&nbsp; Kişi (2) [${u.c2_cinsi === 'kisi' ? '✓' : '  '}]</td>
    <td class="label" style="padding-left:24px">C.3. Doğum tarixi:</td>
    <td><span class="blank">${val(u.c3_dogum_tarixi)}</span></td>
  </tr>
  <tr><td class="label">C.4. Yaşadığı şəhər/rayon:</td><td colspan="3"><span class="blank" style="display:inline-block;width:80%">${val(u.c4_seher)}</span></td></tr>
  <tr><td class="label">C.5. Yaşayış yerinin tipi:</td><td colspan="3">${YASAYIS_LABEL[u.c5_yasayis_yeri_tipi] || ''}</td></tr>
  <tr><td class="label">C.6. Qeydiyyat ünvanı:</td><td colspan="3"><span class="blank" style="display:inline-block;width:85%">${val(u.c6_qeydiyyat_unvan)}</span></td></tr>
  <tr><td class="label">C.7. Hazırda yaşadığı ünvan:</td><td colspan="3"><span class="blank" style="display:inline-block;width:85%">${val(u.c7_yasadigi_unvan)}</span></td></tr>
</table>

<!-- F BOLMESI -->
<div class="section-title">F. Tibbi Diaqnoz (XBT-10 Kodlar)</div>
<table class="info-table">
  <tr>
    <td class="label">F.1.1 Diaqnoz 1:</td>
    <td><span class="blank" style="min-width:180px">${val(f.f1_1_diaqnoz)}</span></td>
    <td class="label" style="padding-left:16px">Kod 1:</td>
    <td><span class="blank">${val(f.f1_1_kod)}</span></td>
  </tr>
  <tr>
    <td class="label">F.1.2 Diaqnoz 2:</td>
    <td><span class="blank" style="min-width:180px">${val(f.f1_2_diaqnoz)}</span></td>
    <td class="label" style="padding-left:16px">Kod 2:</td>
    <td><span class="blank">${val(f.f1_2_kod)}</span></td>
  </tr>
  <tr>
    <td class="label">F.1.3 Diaqnoz 3:</td>
    <td><span class="blank" style="min-width:180px">${val(f.f1_3_diaqnoz)}</span></td>
    <td class="label" style="padding-left:16px">Kod 3:</td>
    <td><span class="blank">${val(f.f1_3_kod)}</span></td>
  </tr>
</table>

<!-- G BOLMESI -->
<div class="section-title">G. Valideyn / Qəyyum / Himayəçi barədə məlumat</div>
<table class="info-table">
  <tr><td class="label">G.1. Himayə statusu:</td><td colspan="3">${HIMAYE_LABEL[u.g1_himaye_statusu] || ''}</td></tr>
  <tr><td class="label">G.2. Valideynin S.A.A:</td><td colspan="3"><span class="blank" style="display:inline-block;width:80%">${val(u.g2_valideyn_saa)}</span></td></tr>
  <tr><td class="label">G.3. Telefon nömrəsi:</td><td colspan="3"><span class="blank" style="display:inline-block;width:60%">${val(u.g3_telefon)}</span></td></tr>
</table>

<!-- H BOLMESI -->
<div class="section-title">H. Təhsil barədə məlumat</div>
<table class="info-table">
  <tr><td class="label">H.6. Təhsil aldığı sinif:</td><td><span class="blank">${val(u.h6_sinif)}</span></td>
  <td class="label" style="padding-left:16px">H.7. Tədris dili:</td><td><span class="blank">${val(u.h7_tedris_dili)}</span></td></tr>
</table>

<!-- B1 BOLMESI -->
<div class="section-title">B 1 — Psixi funksiyalar</div>
${scoreTableHtml(b1Items, b1)}

<!-- B2-B8 BOLMELERI -->
<div class="section-title">B 2 — Sensor funksiyalar</div>
${scoreTableHtml(b2b8Items.slice(0,8), b2b8)}

<div class="section-title">B 3 — Səs və nitq funksiyaları</div>
${scoreTableHtml(b2b8Items.slice(8,11), b2b8)}

<div class="section-title">B 4 — Ürək-damar, immunitet və tənəffüs funksiyaları</div>
${scoreTableHtml(b2b8Items.slice(11,16), b2b8)}

<div class="section-title">B 5 — Həzm funksiyaları</div>
${scoreTableHtml(b2b8Items.slice(16,20), b2b8)}

<div class="section-title">B 6 — Sidik-cinsiyyət və reproduktiv funksiyalar</div>
${scoreTableHtml(b2b8Items.slice(20,23), b2b8)}

<div class="section-title">B 7 — Neyro-əzələ, sümük və hərəkətlə bağlı funksiyalar</div>
${scoreTableHtml(b2b8Items.slice(23,29), b2b8)}

<div class="section-title">B 8 — Dəri və əlaqədar orqanların funksiyaları</div>
${scoreTableHtml(b2b8Items.slice(29), b2b8)}

<!-- D BOLMELERI -->
<div class="section-title">D 1 — Biliklərin öyrənilməsi və tətbiqi</div>
${scoreTableHtml(dItems.slice(0,10), d)}

<div class="section-title">D 2 — Ümumi tapşırıqlar və tələblər</div>
${scoreTableHtml(dItems.slice(10,14), d)}

<div class="section-title">D 3 — Ünsiyyət</div>
${scoreTableHtml(dItems.slice(14,18), d)}

<div class="section-title">D 4 — Hərəkət funksiyaları</div>
${scoreTableHtml(dItems.slice(18,24), d)}

<div class="section-title">D 5 — Özünə qulluq</div>
${scoreTableHtml(dItems.slice(24,30), d)}

<div class="section-title">D 7 — Şəxsiyyətlərarası əlaqələr və münasibətlər</div>
${scoreTableHtml(dItems.slice(30,32), d)}

<div class="section-title">D 8 — Həyatın əsas sahələri</div>
${scoreTableHtml(dItems.slice(32), d)}

<!-- E1 BOLMESI -->
<div class="section-title">E 1 — Uşağın ailədə təhlükəsizliyinin qiymətləndirilməsi</div>
${scoreTableHtml(e1Items, e1)}
${e1.qeyd ? `<p style="font-size:11px;margin:4px 0"><strong>Qeyd:</strong> ${e1.qeyd}</p>` : ''}

<!-- SON İMZALAR -->
<div class="section-title">Qiymətləndirməni keçirənlər</div>
<table style="width:100%;border-collapse:collapse;margin-top:8px">
  <tr>
    <th style="text-align:left;padding:4px 8px;font-size:11px;border-bottom:1px solid #ccc">A.S.</th>
    <th style="text-align:left;padding:4px 8px;font-size:11px;border-bottom:1px solid #ccc">Vəzifə</th>
    <th style="text-align:left;padding:4px 8px;font-size:11px;border-bottom:1px solid #ccc;width:180px">İmza</th>
  </tr>
  <tr><td style="padding:6px 8px;font-size:11px">${sedr}</td><td style="padding:6px 8px;font-size:11px">Sədr</td><td style="padding:6px 8px;border-bottom:1px solid #555"></td></tr>
  <tr><td style="padding:6px 8px;font-size:11px">${katib}</td><td style="padding:6px 8px;font-size:11px">Katib</td><td style="padding:6px 8px;border-bottom:1px solid #555"></td></tr>
  <tr><td style="padding:6px 8px;font-size:11px">${uzv1}</td><td style="padding:6px 8px;font-size:11px">Üzv</td><td style="padding:6px 8px;border-bottom:1px solid #555"></td></tr>
  <tr><td style="padding:6px 8px;font-size:11px">${uzv2}</td><td style="padding:6px 8px;font-size:11px">Üzv</td><td style="padding:6px 8px;border-bottom:1px solid #555"></td></tr>
  <tr><td style="padding:6px 8px;font-size:11px">${uzv3}</td><td style="padding:6px 8px;font-size:11px">Üzv</td><td style="padding:6px 8px;border-bottom:1px solid #555"></td></tr>
</table>

</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => { win.print(); }, 400);
    };
  }
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
