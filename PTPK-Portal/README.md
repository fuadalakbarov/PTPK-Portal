# PTPK Portalı — Hissə 1 (Skeleton + Sadə Giriş)

## Quraşdırma

```bash
npm install
npm run dev
```

## ⚠️ VACİB: Supabase tənzimləməsi (2 addım)

### 1. Anonim girişi aktivləşdirin
Supabase Dashboard → **Authentication** → **Sign In / Providers** →
**Anonymous Sign-ins** → **Enable**

(Bu, RLS-in işləməsi üçündür — istifadəçi heç nə görmür, arxa planda
sakitcə bağlanır.)

### 2. İstifadəçi cədvəlini hazırlayın
Aşağıdaki SQL fayllarını ardıcıl SQL Editor-də işlədin:
1. `ptpk_istifadeciler.sql`
2. `ptpk_pin_setup.sql`

Sonra istifadəçiləri əlavə edin, məsələn:

```sql
insert into istifadeciler (email, ad, rol, pin) values
  ('admin@ptpk.local', 'Admin', 'admin', '1111'),
  ('katib@ptpk.local', 'Laçın Abbasova', 'katib', '2222'),
  ('hekim@ptpk.local', 'Dr. ...', 'hekim', '3333'),
  ('psixoloq@ptpk.local', '...', 'psixoloq', '4444'),
  ('pedaqoq@ptpk.local', '...', 'pedaqoq', '5555'),
  ('sosial@ptpk.local', '...', 'sosial_isci', '6666'),
  ('sedr@ptpk.local', 'Sənayə Cabbarova', 'sedr', '7777');
```

`email` sahəsi məcburidir (unique), amma giriş zamanı istifadə olunmur —
sadəcə ad və PIN kifayətdir.

## Giriş axını

1. Açılış ekranında adınızı siyahıdan seçirsiniz
2. 4 rəqəmli PIN yazırsınız
3. Düz olarsa → rolunuza uyğun bölmələr sidebar-da açılır
4. Seçim brauzerdə yadda saxlanılır (növbəti dəfə avtomatik daxil olur,
   "Çıxış" düyməsi ilə sıfırlanır)

## Rol → Bölmə girişi

- `admin` → bütün bölmələr
- `katib` → C Bölməsi
- `hekim` → F + B2-B8
- `psixoloq` → B1
- `pedaqoq`, `sosial_isci` → D-E
- `sedr` → Yekun Qərar

## Hazırkı vəziyyət (Hissə 1)

✅ Sadə PIN girişi
✅ Rol-əsaslı naviqasiya (sidebar)
✅ Layout skeleti
⏳ Dashboard (uşaqlar siyahısı + Excel) — **Hissə 2**
⏳ C Bölməsi formu — **Hissə 2**
⏳ F, B1, B2-B8, D-E, Yekun formaları — **Hissə 3-5**
⏳ Word export (orijinal format) — sonrakı hissə
