# Marzonne Afiliados

Plataforma web de afiliados para o aplicativo Marzonne. Permite que afiliados se cadastrem, compartilhem links de indicacao e acompanhem suas conversoes e comissoes.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilizacao**: Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **Formularios**: React Hook Form + Zod
- **Graficos**: Recharts
- **Icones**: Lucide React

## Funcionalidades

### Para Afiliados
- Cadastro com dados pessoais e bancarios
- Login e recuperacao de senha
- Dashboard com metricas de conversao
- Link unico de afiliado para compartilhar
- Lista detalhada de cadastros realizados
- Filtros e exportacao CSV
- Configuracoes de perfil

### Para Usuarios (via link de afiliado)
- Cadastro como Atleta ou Scout
- Integracao com o mesmo banco do app mobile
- Pagina de sucesso com links para download do app

## Instalacao

### Pre-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passos

1. Clone o repositorio:
```bash
git clone <repo-url>
cd marzonne-affiliates
```

2. Instale as dependencias:
```bash
npm install
```

3. Configure as variaveis de ambiente:
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/marzonne
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.marzonne
```

4. Execute as migrations no Supabase:
```sql
-- Copie o conteudo de supabase/migrations/001_affiliates.sql
-- e execute no SQL Editor do Supabase
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
src/
├── app/                    # Paginas (App Router)
│   ├── (auth)/            # Paginas de autenticacao
│   │   ├── login/
│   │   ├── registro/
│   │   └── esqueci-senha/
│   ├── (affiliate)/       # Painel do afiliado (protegido)
│   │   ├── dashboard/
│   │   ├── cadastros/
│   │   └── configuracoes/
│   ├── cadastro/          # Cadastro via link afiliado
│   └── sucesso/           # Pagina de sucesso
├── components/
│   ├── ui/                # Componentes base reutilizaveis
│   ├── forms/             # Formularios
│   ├── dashboard/         # Componentes do dashboard
│   ├── layout/            # Header, Sidebar, Footer
│   └── common/            # Componentes comuns
├── hooks/                 # Custom hooks
├── lib/
│   ├── supabase/          # Configuracao Supabase
│   ├── utils.ts           # Funcoes utilitarias
│   └── validations.ts     # Schemas de validacao
├── types/                 # Tipos TypeScript
└── middleware.ts          # Middleware de autenticacao
```

## Banco de Dados

### Tabelas

#### `affiliates`
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID | Chave primaria |
| user_id | UUID | Referencia ao auth.users |
| name | TEXT | Nome completo |
| email | TEXT | Email (unico) |
| phone | TEXT | Telefone |
| document | TEXT | CPF ou CNPJ |
| bank_details | JSONB | Dados bancarios |
| affiliate_code | TEXT | Codigo unico (ex: ABC12345) |
| status | TEXT | pending, approved, rejected |
| created_at | TIMESTAMP | Data de criacao |
| approved_at | TIMESTAMP | Data de aprovacao |
| approved_by | UUID | Admin que aprovou |

#### `conversions`
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID | Chave primaria |
| affiliate_id | UUID | Referencia ao afiliado |
| user_id | UUID | Usuario cadastrado |
| user_type | TEXT | athlete ou scout |
| user_email | TEXT | Email do usuario |
| user_name | TEXT | Nome do usuario |
| conversion_date | TIMESTAMP | Data da conversao |
| commission_amount | DECIMAL | Valor da comissao |
| commission_status | TEXT | pending, approved, paid |

## Scripts

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build de producao
npm run start     # Inicia servidor de producao
npm run lint      # Executa linter
```

## Fluxo de Cadastro via Afiliado

1. Usuario acessa `/cadastro?ref=CODIGO`
2. Sistema valida se o codigo existe e esta aprovado
3. Usuario escolhe tipo: Atleta ou Scout
4. Usuario preenche formulario
5. Sistema cria:
   - Usuario no Supabase Auth
   - Perfil em `user_profiles` com `referred_by`
   - Registro em `conversions`
6. Usuario e redirecionado para `/sucesso`

## Seguranca

- Row Level Security (RLS) ativado em todas as tabelas
- Autenticacao via Supabase Auth
- Protecao de rotas via middleware
- Validacao de dados com Zod
- Sanitizacao de inputs

## Deploy

### Vercel (Recomendado)

1. Conecte o repositorio ao Vercel
2. Configure as variaveis de ambiente
3. Deploy automatico a cada push

### Outros

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS Amplify
- etc.

## Licenca

Privado - Todos os direitos reservados.
