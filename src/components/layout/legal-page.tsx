import { Header } from './header';
import { Footer } from './footer';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showAuthButtons={false} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Última atualização: {lastUpdated}
        </p>
        <p className="mt-6 text-gray-600 leading-relaxed">{intro}</p>

        <div className="mt-10 space-y-10">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

interface LegalPartProps {
  label: string;
  title: string;
  scope: string;
}

/** Groups sections that apply to a specific product or audience. */
export function LegalPart({ label, title, scope }: LegalPartProps) {
  return (
    <section className="border-l-4 border-[#FCD34D] bg-[#FEF9E7] rounded-r-lg px-5 py-4">
      <p className="text-xs font-semibold text-[#EAB308] uppercase tracking-wider">
        {label}
      </p>
      <h2 className="mt-1 text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{scope}</p>
    </section>
  );
}

interface LegalSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900">
        {number}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_strong]:text-gray-900">
        {children}
      </div>
    </section>
  );
}
