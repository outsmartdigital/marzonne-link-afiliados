import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout';
import { Footer } from '@/components/layout';
import { Button } from '@/components/ui';

const features = [
  {
    icon: Users,
    title: 'Indique Atletas e Scouts',
    description:
      'Compartilhe seu link único e receba comissões por cada cadastro realizado.',
  },
  {
    icon: TrendingUp,
    title: 'Acompanhe seu Desempenho',
    description:
      'Dashboard completo com métricas, gráficos e histórico de conversões.',
  },
  {
    icon: DollarSign,
    title: 'Receba Comissões',
    description:
      'Ganhe dinheiro por cada usuário que se cadastrar usando seu link.',
  },
];

const benefits = [
  'Link único de afiliado',
  'Dashboard com métricas em tempo real',
  'Histórico de cadastros',
  'Suporte dedicado',
  'Pagamentos pontuais',
  'Sem limite de indicações',
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Ganhe dinheiro indicando talentos do esporte
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400">
              Torne-se um afiliado DNA de Craque e receba comissões por cada atleta ou
              scout que se cadastrar através do seu link.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/registro">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Quero ser Afiliado
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#FCD34D] text-[#FCD34D] hover:bg-[#FCD34D]/10"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Como funciona
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simples, rápido e lucrativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#FEF9E7] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#FCD34D]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Por que ser um afiliado DNA de Craque?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Faça parte da maior plataforma de descoberta de talentos do
                esporte e seja recompensado por suas indicações.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#FCD34D] flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/registro">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Começar agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-[#FCD34D] rounded-2xl p-8 text-black">
              <h3 className="text-2xl font-bold mb-6">Comece em 3 passos</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cadastre-se</h4>
                    <p className="text-gray-700 text-sm">
                      Crie sua conta de afiliado em poucos minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Compartilhe</h4>
                    <p className="text-gray-700 text-sm">
                      Divulgue seu link único nas redes sociais
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ganhe</h4>
                    <p className="text-gray-700 text-sm">
                      Receba comissões por cada cadastro realizado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Pronto para começar a ganhar?
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Junte-se a centenas de afiliados que já estão ganhando com o DNA de Craque.
          </p>
          <div className="mt-8">
            <Link href="/registro">
              <Button
                size="lg"
                className="bg-[#FCD34D] hover:bg-black"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Criar conta gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
