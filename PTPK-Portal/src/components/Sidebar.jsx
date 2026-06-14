import {
  IconUsers,
  IconClipboardList,
  IconStethoscope,
  IconBrain,
  IconActivity,
  IconSchool,
  IconGavel,
  IconLogout,
} from '@tabler/icons-react';

// Bölmələrin tam siyahısı — hər birinin hansı rola açıq olduğu göstərilir
export const SECTIONS = [
  {
    key: 'C',
    title: 'C Bölməsi',
    subtitle: 'Uşaq Qeydiyyatı',
    icon: IconClipboardList,
    roles: ['admin', 'katib'],
  },
  {
    key: 'F',
    title: 'F Bölməsi',
    subtitle: 'Tibbi Müayinə (Həkim)',
    icon: IconStethoscope,
    roles: ['admin', 'hekim'],
  },
  {
    key: 'B1',
    title: 'B1 Bölməsi',
    subtitle: 'Psixi Funksiyalar (Psixoloq)',
    icon: IconBrain,
    roles: ['admin', 'psixoloq'],
  },
  {
    key: 'B2B8',
    title: 'B2-B8 Bölməsi',
    subtitle: 'Sensor və Hərəkət (Həkim)',
    icon: IconActivity,
    roles: ['admin', 'hekim'],
  },
  {
    key: 'DE',
    title: 'D-E Bölməsi',
    subtitle: 'Pedaqoq və Sosial İşçi',
    icon: IconSchool,
    roles: ['admin', 'pedaqoq', 'sosial_isci'],
  },
  {
    key: 'YEKUN',
    title: 'Yekun Qərar',
    subtitle: 'PTPK Komissiyası',
    icon: IconGavel,
    roles: ['admin', 'sedr'],
  },
];

export default function Sidebar({
  view,
  setView,
  selectedUsaq,
  profile,
  onSignOut,
}) {
  const rol = profile?.rol || '';

  function canAccess(section) {
    // admin və katib bütün bölmələri doldura bilər
    // (katib komputeri komissiya üzvlərinin qarşısına qoyub məlumatları özü yazır)
    if (rol === 'admin' || rol === 'katib') return true;
    return section.roles.includes(rol);
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo / başlıq */}
      <div className="px-5 py-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-bold">P</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900 leading-tight">
            PTPK Portalı
          </h1>
          <p className="text-xs text-slate-400">Komissiya idarəetməsi</p>
        </div>
      </div>

      {/* Naviqasiya */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <button
          onClick={() => setView({ name: 'dashboard' })}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            view.name === 'dashboard'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <IconUsers size={18} />
          <span>Uşaqlar Siyahısı</span>
        </button>

        {selectedUsaq && (
          <>
            <div className="px-3 pt-4 pb-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {selectedUsaq.c1_saa || 'Seçilmiş uşaq'}
              </p>
            </div>

            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const allowed = canAccess(section);
              const active =
                view.name === 'usaq' && view.section === section.key;

              return (
                <button
                  key={section.key}
                  disabled={!allowed}
                  onClick={() =>
                    allowed &&
                    setView({
                      name: 'usaq',
                      usaqId: selectedUsaq.id,
                      section: section.key,
                    })
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : allowed
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  title={
                    !allowed
                      ? 'Bu bölməni doldurmaq icazəniz yoxdur'
                      : undefined
                  }
                >
                  <Icon size={18} />
                  <div className="text-left">
                    <div className="leading-tight">{section.title}</div>
                    <div className="text-xs text-slate-400 leading-tight">
                      {section.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* İstifadəçi məlumatı */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600 flex-shrink-0">
            {(profile?.ad || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {profile?.ad || 'İstifadəçi'}
            </p>
            <p className="text-xs text-slate-400 capitalize">{rol}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors"
        >
          <IconLogout size={16} />
          Çıxış
        </button>
      </div>
    </aside>
  );
}
