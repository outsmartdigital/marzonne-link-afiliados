import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalPart, LegalSection } from '@/components/layout/legal-page';

export const metadata: Metadata = {
  title: 'Termos de Uso - DNA de Craque',
  description:
    'Termos e condições de uso do aplicativo DNA de Craque e do programa DNA de Craque Afiliados, incluindo assinaturas, conteúdo do usuário e comissões.',
};

// RASCUNHO - conteúdo modelo, pendente de revisão jurídica antes da publicação.
const PLACEHOLDER = {
  razaoSocial: '[RAZÃO SOCIAL]',
  cnpj: '[CNPJ]',
  endereco: '[ENDEREÇO COMPLETO]',
  comarca: '[COMARCA]',
  email: '[contato@dnadecraque.com.br]',
  comissao: '[X]',
  prazoValidacao: '[30]',
  valorMinimoResgate: '[R$ XX,XX]',
  prazoPagamento: '[15]',
  duracaoCookie: '[30]',
  prazoModeracao: '[24]',
};

const link = 'text-[#EAB308] underline hover:text-[#FCD34D]';

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      lastUpdated="[DD/MM/AAAA]"
      intro="Estes Termos regulam o uso do aplicativo DNA de Craque e do programa DNA de Craque Afiliados. A Parte I aplica-se a todos. A Parte II aplica-se a quem usa o aplicativo. A Parte III aplica-se a quem participa do programa de afiliados. Ao criar uma conta, você declara ter lido, compreendido e aceito as partes aplicáveis a você."
    >
      <LegalPart
        label="Parte I"
        title="Disposições gerais"
        scope="Aplica-se a todos os usuários."
      />

      <LegalSection number="1" title="Quem somos">
        <p>
          O aplicativo <strong>DNA de Craque</strong> e a plataforma DNA de
          Craque Afiliados são operados por{' '}
          <strong>{PLACEHOLDER.razaoSocial}</strong>, inscrita no CNPJ sob o n.{' '}
          {PLACEHOLDER.cnpj}, com sede em {PLACEHOLDER.endereco}.
        </p>
        <p>
          Canal oficial de contato:{' '}
          <a href={`mailto:${PLACEHOLDER.email}`} className={link}>
            {PLACEHOLDER.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection number="2" title="Definições">
        <ul>
          <li>
            <strong>Aplicativo:</strong> o app móvel DNA de Craque, para iOS e
            Android.
          </li>
          <li>
            <strong>Atleta:</strong> usuário que cria perfil esportivo e publica
            vídeos.
          </li>
          <li>
            <strong>Olheiro:</strong> usuário que busca, visualiza e favorita
            perfis de atletas.
          </li>
          <li>
            <strong>Afiliado:</strong> usuário do programa de indicação descrito
            na Parte III.
          </li>
          <li>
            <strong>Conteúdo do Usuário:</strong> vídeos, imagens, textos e
            dados publicados por Atletas e Olheiros.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Aceite e alterações">
        <p>
          O uso do Aplicativo ou da plataforma implica aceite destes Termos.
          Podemos atualizá-los a qualquer momento; a versão vigente será sempre
          publicada nesta página, com a data da última atualização. Alterações
          relevantes serão comunicadas por e-mail ou no próprio Aplicativo com
          antecedência razoável.
        </p>
      </LegalSection>

      <LegalPart
        label="Parte II"
        title="Aplicativo DNA de Craque"
        scope="Aplica-se a Atletas e Olheiros. Esta Parte constitui o contrato de licença de usuário final (EULA) do Aplicativo."
      />

      <LegalSection number="4" title="Licença de uso">
        <p>
          Concedemos a você uma licença pessoal, limitada, revogável, não
          exclusiva e intransferível para instalar e usar o Aplicativo em
          dispositivos que você possua ou controle, exclusivamente para fins
          pessoais e não comerciais, conforme estes Termos e as regras da loja
          de aplicativos utilizada.
        </p>
        <p>
          Você não pode copiar, modificar, descompilar, realizar engenharia
          reversa, sublicenciar, alugar ou revender o Aplicativo ou qualquer
          parte dele, salvo na medida permitida por lei.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Cadastro, idade e responsáveis">
        <ul>
          <li>
            O cadastro exige nome, e-mail, senha, CPF, telefone, data de
            nascimento e endereço (cidade e estado).
          </li>
          <li>
            O Aplicativo destina-se a maiores de 13 anos. Usuários entre 13 e 18
            anos somente podem se cadastrar e publicar conteúdo com
            consentimento e supervisão de ao menos um dos pais ou do responsável
            legal, que assume a responsabilidade pelo uso.
          </li>
          <li>
            O responsável legal pode, a qualquer momento, solicitar acesso,
            correção ou exclusão dos dados e do conteúdo do menor pelo canal de
            contato.
          </li>
          <li>
            Você é responsável pela veracidade dos dados informados e pela
            guarda de sua senha.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Conteúdo do Usuário">
        <p>
          Você mantém a titularidade do Conteúdo que publica. Ao publicar, você
          nos concede uma licença gratuita, mundial e não exclusiva para
          armazenar, reproduzir e exibir esse Conteúdo dentro do Aplicativo,
          para as finalidades de funcionamento do serviço. A licença termina
          quando você remove o Conteúdo ou exclui sua conta, ressalvadas cópias
          de backup e obrigações legais de retenção.
        </p>
        <p>
          Você declara que possui todos os direitos sobre o Conteúdo publicado e
          que obteve autorização de imagem de todas as pessoas identificáveis
          nos vídeos, inclusive dos responsáveis legais no caso de menores.
        </p>
      </LegalSection>

      <LegalSection
        number="7"
        title="Tolerância zero a conteúdo e conduta abusivos"
      >
        <p>
          Não toleramos conteúdo censurável nem comportamento abusivo. É
          expressamente proibido publicar ou praticar:
        </p>
        <ul>
          <li>
            conteúdo sexual, de nudez ou que explore, sexualize ou coloque em
            risco crianças e adolescentes;
          </li>
          <li>
            violência, ameaça, assédio, bullying, discurso de ódio ou
            discriminação de qualquer natureza;
          </li>
          <li>
            conteúdo ilegal, difamatório, enganoso ou que viole direitos de
            terceiros, inclusive de imagem e propriedade intelectual;
          </li>
          <li>
            spam, aliciamento, cobrança indevida ou uso do Aplicativo para
            abordar menores fora do propósito esportivo;
          </li>
          <li>
            criação de perfis falsos, uso de dados de terceiros ou automação não
            autorizada.
          </li>
        </ul>
        <p>
          <strong>Denúncia e bloqueio.</strong> Todo Conteúdo e todo perfil
          podem ser denunciados e bloqueados dentro do Aplicativo. Analisamos as
          denúncias em até {PLACEHOLDER.prazoModeracao} horas e removemos o
          conteúdo infrator, podendo suspender ou banir definitivamente a conta
          responsável, sem reembolso e sem prejuízo das medidas legais cabíveis.
        </p>
        <p>
          Denúncias também podem ser enviadas para{' '}
          <a href={`mailto:${PLACEHOLDER.email}`} className={link}>
            {PLACEHOLDER.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection number="8" title="Assinaturas e renovação automática">
        <ul>
          <li>
            O Aplicativo oferece planos de assinatura com{' '}
            <strong>renovação automática</strong>. Preço, duração do período e
            condições de cada plano são exibidos na tela de assinatura antes da
            confirmação da compra.
          </li>
          <li>
            O pagamento é debitado na conta da loja de aplicativos (Apple App
            Store ou Google Play) no momento da confirmação.
          </li>
          <li>
            A assinatura <strong>renova-se automaticamente</strong> pelo mesmo
            período, salvo se cancelada com pelo menos 24 horas de antecedência
            do fim do período vigente. A cobrança da renovação ocorre nas 24
            horas anteriores ao fim do período.
          </li>
          <li>
            O cancelamento é feito nas configurações da sua conta na loja de
            aplicativos, não no Aplicativo. Cancelar interrompe renovações
            futuras; o acesso permanece ativo até o fim do período já pago.
          </li>
          <li>
            Assinaturas podem ser restauradas em outro dispositivo pela opção{' '}
            <em>Restaurar compras</em>.
          </li>
          <li>
            Reembolsos são processados pela loja de aplicativos, conforme suas
            políticas, e não por nós.
          </li>
          <li>
            Podemos alterar preços e planos mediante aviso prévio. Alterações
            não afetam o período já pago.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Exclusão de conta">
        <p>
          Você pode excluir sua conta a qualquer momento pelo próprio
          Aplicativo. A exclusão remove seu perfil, seus vídeos e suas
          miniaturas, seus favoritos e seus dados de cadastro, ressalvados os
          dados que devemos reter por obrigação legal, conforme a{' '}
          <Link href="/privacidade" className={link}>
            Política de Privacidade
          </Link>
          .
        </p>
        <p>
          Excluir a conta não cancela automaticamente uma assinatura ativa: o
          cancelamento deve ser feito na loja de aplicativos.
        </p>
      </LegalSection>

      <LegalPart
        label="Parte III"
        title="Programa de Afiliados"
        scope="Aplica-se somente a quem se cadastra como Afiliado na plataforma DNA de Craque Afiliados."
      />

      <LegalSection number="10" title="Objeto e natureza do vínculo">
        <p>
          O programa permite ao Afiliado divulgar um link exclusivo de indicação
          e receber créditos ou comissões pelos cadastros validamente realizados
          por meio desse link. O aceite não cria vínculo empregatício,
          societário, de representação comercial ou de exclusividade.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Cadastro do Afiliado">
        <ul>
          <li>
            O cadastro é gratuito e exige nome completo, e-mail e telefone
            válidos.
          </li>
          <li>
            Somente pessoas com 18 anos ou mais, plenamente capazes, podem se
            cadastrar como Afiliado.
          </li>
          <li>
            Cada pessoa pode manter apenas uma conta de Afiliado. Contas
            duplicadas podem ser suspensas.
          </li>
          <li>
            O cadastro fica sujeito a aprovação prévia, que pode ser recusada a
            nosso critério.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="12" title="Link de afiliado e atribuição">
        <p>
          Após a aprovação, o Afiliado recebe um código e um link únicos. A
          indicação é atribuída quando o cadastro é concluído a partir desse
          link, dentro do prazo de {PLACEHOLDER.duracaoCookie} dias contados do
          primeiro acesso. Havendo múltiplas indicações para o mesmo usuário,
          prevalece o último link utilizado antes da conclusão do cadastro.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Comissões e créditos">
        <ul>
          <li>
            O Afiliado faz jus a {PLACEHOLDER.comissao} por cadastro válido,
            conforme a tabela vigente no momento da conversão.
          </li>
          <li>
            Cadastros ficam com status <strong>pendente</strong> até a
            validação, em até {PLACEHOLDER.prazoValidacao} dias.
          </li>
          <li>
            Não geram comissão: cadastros duplicados, com dados falsos ou
            incompletos, autoindicações, cadastros cancelados ou obtidos em
            violação a estes Termos.
          </li>
          <li>
            Podemos alterar valores e regras de comissionamento mediante aviso
            prévio, sem afetar comissões já aprovadas.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="14" title="Resgate e pagamento">
        <ul>
          <li>
            O resgate pode ser solicitado a partir do saldo mínimo de{' '}
            {PLACEHOLDER.valorMinimoResgate}.
          </li>
          <li>
            O pagamento ocorre em até {PLACEHOLDER.prazoPagamento} dias úteis
            após a aprovação, exclusivamente para conta bancária ou chave Pix de
            titularidade do Afiliado.
          </li>
          <li>
            Dados bancários incorretos ou desatualizados suspendem o pagamento
            até a devida correção, sem incidência de encargos.
          </li>
          <li>
            O Afiliado é responsável pelos tributos incidentes sobre os valores
            recebidos.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="15" title="Condutas proibidas ao Afiliado">
        <p>Além do disposto na seção 7, é vedado ao Afiliado:</p>
        <ul>
          <li>
            cadastrar dados de terceiros sem autorização ou criar cadastros
            fictícios;
          </li>
          <li>praticar spam ou divulgação enganosa;</li>
          <li>
            usar a marca DNA de Craque de forma não autorizada, inclusive em
            domínios, perfis ou anúncios que sugiram vínculo oficial;
          </li>
          <li>
            veicular anúncios pagos sobre a marca sem autorização prévia por
            escrito;
          </li>
          <li>usar robôs ou scripts para gerar cadastros.</li>
        </ul>
        <p>
          O descumprimento autoriza a suspensão ou o encerramento da conta com
          retenção das comissões pendentes.
        </p>
      </LegalSection>

      <LegalPart
        label="Parte IV"
        title="Disposições finais"
        scope="Aplica-se a todos os usuários."
      />

      <LegalSection number="16" title="Propriedade intelectual">
        <p>
          Marcas, logotipos, textos, layout e software do Aplicativo e da
          plataforma nos pertencem. Estes Termos concedem apenas as licenças
          limitadas descritas nas seções 4 e 10, sem transferência de qualquer
          outro direito.
        </p>
      </LegalSection>

      <LegalSection number="17" title="Suspensão e encerramento">
        <p>
          Podemos suspender ou encerrar contas em caso de descumprimento destes
          Termos, fraude ou indício de irregularidade, sem prejuízo das medidas
          legais cabíveis. Você pode encerrar sua conta a qualquer momento,
          conforme a seção 9.
        </p>
      </LegalSection>

      <LegalSection number="18" title="Limitação de responsabilidade">
        <p>
          Empenhamo-nos em manter o serviço disponível, mas não garantimos
          funcionamento ininterrupto ou livre de falhas. Não respondemos por
          indisponibilidades decorrentes de caso fortuito, força maior ou falhas
          de terceiros, nem por lucros cessantes ou expectativa de ganho.
        </p>
        <p>
          Não intermediamos, garantimos nem participamos de negociações,
          contratos ou testes esportivos entre Atletas, Olheiros, clubes ou
          empresários. O contato entre usuários ocorre por conta e risco deles.
        </p>
      </LegalSection>

      <LegalSection number="19" title="Proteção de dados">
        <p>
          O tratamento de dados pessoais está descrito na{' '}
          <Link href="/privacidade" className={link}>
            Política de Privacidade
          </Link>
          , que integra estes Termos.
        </p>
      </LegalSection>

      <LegalSection number="20" title="Lei aplicável e foro">
        <p>
          Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da
          comarca de {PLACEHOLDER.comarca}, salvo hipótese de foro obrigatório
          previsto em lei, inclusive o domicílio do consumidor.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
