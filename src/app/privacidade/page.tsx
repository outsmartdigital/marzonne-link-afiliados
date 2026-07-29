import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalPart, LegalSection } from '@/components/layout/legal-page';

export const metadata: Metadata = {
  title: 'Política de Privacidade - DNA de Craque',
  description:
    'Como tratamos dados pessoais no aplicativo DNA de Craque e no programa de afiliados, conforme a LGPD.',
};

// RASCUNHO - conteúdo modelo, pendente de revisão jurídica antes da publicação.
const PLACEHOLDER = {
  razaoSocial: '[RAZÃO SOCIAL]',
  cnpj: '[CNPJ]',
  endereco: '[ENDEREÇO COMPLETO]',
  encarregado: '[NOME DO ENCARREGADO/DPO]',
  emailEncarregado: '[dpo@dnadecraque.com.br]',
  retencaoFiscal: '[5]',
};

const link = 'text-[#EAB308] underline hover:text-[#FCD34D]';

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      lastUpdated="[DD/MM/AAAA]"
      intro="Esta Política explica como coletamos, usamos, compartilhamos e protegemos dados pessoais no aplicativo DNA de Craque e na plataforma DNA de Craque Afiliados, conforme a Lei n. 13.709/2018 (LGPD). Ela vale para os dois produtos; quando uma regra se aplica somente a um deles, isso está indicado."
    >
      <LegalSection number="1" title="Controlador e Encarregado">
        <p>
          O controlador dos dados é <strong>{PLACEHOLDER.razaoSocial}</strong>,
          CNPJ {PLACEHOLDER.cnpj}, com sede em {PLACEHOLDER.endereco}.
        </p>
        <p>
          Encarregado pelo Tratamento de Dados Pessoais (DPO):{' '}
          {PLACEHOLDER.encarregado} &mdash;{' '}
          <a href={`mailto:${PLACEHOLDER.emailEncarregado}`} className={link}>
            {PLACEHOLDER.emailEncarregado}
          </a>
          .
        </p>
      </LegalSection>

      <LegalPart
        label="Parte I"
        title="Aplicativo DNA de Craque"
        scope="Dados de Atletas e Olheiros que usam o aplicativo móvel."
      />

      <LegalSection number="2" title="Dados que coletamos no Aplicativo">
        <p>
          <strong>Cadastro (todos os usuários):</strong> nome, e-mail, senha
          (armazenada de forma criptografada), CPF, telefone, data de nascimento
          e endereço (cidade e estado).
        </p>
        <p>
          <strong>Perfil de Atleta:</strong> posição em campo, altura, peso e
          clube atual.
        </p>
        <p>
          <strong>Conteúdo publicado:</strong> vídeos e miniaturas enviados pelo
          usuário, incluindo sua imagem e voz.
        </p>
        <p>
          <strong>Uso do Aplicativo:</strong> atletas e vídeos favoritados,
          status da assinatura e histórico de eventos de compra.
        </p>
        <p>
          <strong>Dados técnicos:</strong> identificador do dispositivo, modelo,
          sistema operacional, versão do app, relatórios de falha e eventos de
          uso agregados.
        </p>
        <p>
          <strong>Não coletamos</strong> dados de localização precisa nem
          utilizamos identificadores de publicidade (IDFA). O Aplicativo{' '}
          <strong>não rastreia</strong> você em apps e sites de terceiros.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Permissões do dispositivo">
        <ul>
          <li>
            <strong>Câmera</strong> &mdash; gravar vídeos de treino e jogo
            diretamente no Aplicativo.
          </li>
          <li>
            <strong>Microfone</strong> &mdash; capturar o áudio desses vídeos.
          </li>
          <li>
            <strong>Fotos e mídia</strong> &mdash; selecionar vídeos já
            existentes no dispositivo e salvar vídeos gravados.
          </li>
        </ul>
        <p>
          Todas as permissões são solicitadas no momento do uso e podem ser
          revogadas nas configurações do sistema. Sem elas, apenas os recursos
          de vídeo ficam indisponíveis.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Visibilidade do perfil e dos vídeos">
        <p>
          O propósito do Aplicativo é conectar Atletas a Olheiros. O perfil do
          Atleta e os vídeos publicados ficam <strong>visíveis</strong> aos
          Olheiros cadastrados na plataforma, que podem favoritar perfis e
          vídeos. Dados de contato direto, CPF e endereço completo{' '}
          <strong>não</strong> são exibidos a outros usuários.
        </p>
        <p>
          Considere que qualquer vídeo publicado pode ser visto e gravado por
          terceiros. Publique apenas conteúdo que você aceite tornar visível.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Crianças e adolescentes">
        <p>
          O Aplicativo trata dados de adolescentes. Esse tratamento é realizado
          no melhor interesse do titular, nos termos do art. 14 da LGPD, e
          depende de consentimento específico e destacado de ao menos um dos
          pais ou do responsável legal, que deve supervisionar o cadastro e a
          publicação de conteúdo.
        </p>
        <p>
          Não condicionamos a participação em jogos ou recursos do Aplicativo ao
          fornecimento de dados além do estritamente necessário. O responsável
          legal pode solicitar acesso, correção ou exclusão dos dados do menor a
          qualquer momento pelo contato do Encarregado.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Assinaturas e pagamentos">
        <p>
          As assinaturas são processadas pela <strong>Apple App Store</strong>{' '}
          ou pelo <strong>Google Play</strong> e gerenciadas com apoio da{' '}
          <strong>RevenueCat</strong>. Os dados de pagamento (cartão, cobrança)
          são tratados diretamente pelas lojas e{' '}
          <strong>não são acessados por nós</strong>. Recebemos apenas a
          confirmação do status da assinatura e um identificador anônimo de
          transação.
        </p>
      </LegalSection>

      <LegalPart
        label="Parte II"
        title="Programa de Afiliados"
        scope="Dados de quem participa do programa de indicação."
      />

      <LegalSection number="7" title="Dados que coletamos do Afiliado">
        <p>
          Nome completo, e-mail, telefone, senha (criptografada), documento (CPF
          ou CNPJ) e dados bancários para pagamento (banco, agência, conta, tipo
          de conta e chave Pix), além do código de afiliado, das conversões
          atribuídas e do histórico de resgates.
        </p>
        <p>
          Ao Afiliado são exibidos apenas nome, e-mail e data do cadastro das
          pessoas que ele indicou, para acompanhamento das próprias conversões.
          O Afiliado <strong>não</strong> tem acesso a vídeos, CPF, telefone ou
          demais dados dos indicados.
        </p>
      </LegalSection>

      <LegalPart
        label="Parte III"
        title="Regras comuns"
        scope="Aplica-se aos dois produtos."
      />

      <LegalSection number="8" title="Finalidades e bases legais">
        <ul>
          <li>
            <strong>Criar e manter a conta</strong> e autenticar o acesso
            &mdash; execução de contrato (art. 7º, V).
          </li>
          <li>
            <strong>Exibir perfis e vídeos</strong> a Olheiros, funcionalidade
            central do serviço &mdash; execução de contrato (art. 7º, V).
          </li>
          <li>
            <strong>Tratar dados de adolescentes</strong> &mdash; melhor
            interesse do titular com consentimento parental (art. 14).
          </li>
          <li>
            <strong>Gerenciar assinaturas</strong> e liberar recursos pagos
            &mdash; execução de contrato (art. 7º, V).
          </li>
          <li>
            <strong>Atribuir indicações e pagar comissões</strong> &mdash;
            execução de contrato e obrigação legal e fiscal (art. 7º, II e V).
          </li>
          <li>
            <strong>Moderar conteúdo e prevenir fraudes e abusos</strong>{' '}
            &mdash; legítimo interesse e proteção do titular (art. 7º, IX).
          </li>
          <li>
            <strong>Medir uso e corrigir falhas</strong> (analytics e relatórios
            de erro) &mdash; legítimo interesse (art. 7º, IX).
          </li>
          <li>
            <strong>Comunicações operacionais</strong> sobre conta, assinatura e
            comissões &mdash; execução de contrato.
          </li>
          <li>
            <strong>Comunicações de marketing</strong> &mdash; consentimento,
            revogável a qualquer momento.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Compartilhamento e operadores">
        <p>Compartilhamos dados apenas com:</p>
        <ul>
          <li>
            <strong>Supabase</strong> &mdash; autenticação, banco de dados e
            armazenamento de vídeos;
          </li>
          <li>
            <strong>Google Firebase</strong> (Analytics e Crashlytics) &mdash;
            métricas de uso e relatórios de falha, sem identificadores de
            publicidade;
          </li>
          <li>
            <strong>RevenueCat, Apple e Google</strong> &mdash; processamento e
            validação de assinaturas;
          </li>
          <li>
            <strong>Instituições financeiras e meios de pagamento</strong>{' '}
            &mdash; resgates de afiliados;
          </li>
          <li>
            <strong>Autoridades públicas</strong> &mdash; mediante requisição
            legal ou judicial.
          </li>
        </ul>
        <p>
          <strong>Não vendemos dados pessoais</strong> e não os compartilhamos
          com anunciantes ou corretores de dados.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Transferência internacional">
        <p>
          Alguns operadores acima armazenam dados fora do Brasil. Nesses casos,
          adotamos garantias contratuais adequadas, conforme os arts. 33 e
          seguintes da LGPD.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Retenção e exclusão">
        <p>
          Mantemos os dados enquanto a conta estiver ativa. A exclusão da conta
          pelo Aplicativo remove perfil, vídeos, miniaturas, favoritos e dados
          de cadastro dos nossos sistemas.
        </p>
        <p>
          Após o encerramento, retemos dados financeiros e fiscais por{' '}
          {PLACEHOLDER.retencaoFiscal} anos para cumprimento de obrigações
          legais, e registros de acesso por 6 meses, conforme o Marco Civil da
          Internet. Encerrados os prazos, os dados são eliminados ou
          anonimizados.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Seus direitos">
        <p>
          Nos termos do art. 18 da LGPD, você pode solicitar: confirmação da
          existência de tratamento; acesso aos dados; correção de dados
          incompletos ou desatualizados; anonimização, bloqueio ou eliminação de
          dados desnecessários; portabilidade; informação sobre
          compartilhamentos; revogação do consentimento; e oposição a
          tratamentos fundados em legítimo interesse.
        </p>
        <p>
          Envie sua solicitação para{' '}
          <a href={`mailto:${PLACEHOLDER.emailEncarregado}`} className={link}>
            {PLACEHOLDER.emailEncarregado}
          </a>
          . Responderemos nos prazos legais. Você também pode peticionar perante
          a Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </LegalSection>

      <LegalSection number="13" title="Segurança">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados,
          incluindo criptografia de senhas, tráfego em HTTPS, controle de acesso
          por sessão autenticada e políticas de acesso por linha (Row Level
          Security) no banco de dados. Nenhum sistema é absolutamente seguro; em
          caso de incidente relevante, comunicaremos os titulares e a ANPD.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Alterações desta Política">
        <p>
          Esta Política pode ser atualizada periodicamente. A versão vigente
          será sempre publicada nesta página, com a data da última atualização.
        </p>
        <p>
          Consulte também os{' '}
          <Link href="/termos" className={link}>
            Termos de Uso
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
