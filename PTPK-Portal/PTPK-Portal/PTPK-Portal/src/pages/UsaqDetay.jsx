import { SECTIONS } from '../components/Sidebar';
import SectionC from '../forms/SectionC';
import SectionF from '../forms/SectionF';
import SectionB1 from '../forms/SectionB1';
import SectionB2B8 from '../forms/SectionB2B8';
import SectionDE from '../forms/SectionDE';
import SectionYekun from '../forms/SectionYekun';

// Hər bölmə hazır olduqda buraya əlavə ediləcək komponentlər
const SECTION_COMPONENTS = {
  C: SectionC,
  F: SectionF,
  B1: SectionB1,
  B2B8: SectionB2B8,
  DE: SectionDE,
  YEKUN: SectionYekun,
};

export default function UsaqDetay({ usaq, section, profile, onSaved }) {
  const sectionMeta = SECTIONS.find((s) => s.key === section);
  const SectionComponent = SECTION_COMPONENTS[section];

  if (!sectionMeta) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-500">Bölmə tapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {usaq?.c1_saa || 'Uşaq'}
        </p>
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
          {sectionMeta.title} — {sectionMeta.subtitle}
        </h1>
      </div>

      {SectionComponent ? (
        <SectionComponent usaq={usaq} profile={profile} onSaved={onSaved} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h2 className="text-sm font-medium text-slate-700">
            Bu bölmə növbəti hissələrdə hazırlanacaq
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {sectionMeta.title} formu hələ əlavə olunmayıb.
          </p>
        </div>
      )}
    </div>
  );
}
