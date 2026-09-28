/**
 * Model & Service: Conveniados
 * Gerencia os dados e operações do CRUD de parceiros conveniados da Fundação FCV.
 */

export type CategoriaConveniado = 
  | 'Alimentação'
  | 'Saúde'
  | 'Mercado'
  | 'Odontológico'
  | 'Esporte e Lazer'
  | 'Hospedagem'
  | 'Educação'
  | 'Outros'

export type StatusConveniado = 'Ativo' | 'Inativo'

export interface Conveniado {
  id: string
  nome: string
  subtitulo?: string
  cnpj: string
  categoria: CategoriaConveniado
  endereco: string
  bairro?: string
  cidade: string
  estado: string
  status: StatusConveniado
  utilizacoes: number
  telefone?: string
  email?: string
  responsavel?: string
  descontoDescricao?: string
  dataCadastro?: string
}

export interface MetricasConveniados {
  total: number
  totalCrescimento: string
  ativos: number
  ativosPercentual: string
  inativos: number
  inativosPercentual: string
  comUtilizacoes: number
  comUtilizacoesPercentual: string
}

export interface FiltrosConveniados {
  busca?: string
  status?: string
  categoria?: string
}

// Dados iniciais fiéis ao Protótipo Oficial da FCV
const DADOS_INICIAIS: Conveniado[] = [
  {
    id: '1',
    nome: 'Sabor & Cia Restaurante',
    subtitulo: 'Alimentação corporativa e à la carte',
    cnpj: '12.345.678/0001-90',
    categoria: 'Alimentação',
    endereco: 'Av. Brasil, 123',
    bairro: 'Centro',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Ativo',
    utilizacoes: 482,
    telefone: '(32) 3721-1122',
    email: 'contato@saborecia.com.br',
    responsavel: 'Carlos Alberto Mendes',
    descontoDescricao: '10% de desconto no almoço para colaboradores FCV',
    dataCadastro: '2024-03-15',
  },
  {
    id: '2',
    nome: 'FarmaVida Drogaria',
    subtitulo: 'Saúde e Bem-estar',
    cnpj: '98.765.432/0001-10',
    categoria: 'Saúde',
    endereco: 'Rua das Flores, 456',
    bairro: 'Jardim Paulista',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Ativo',
    utilizacoes: 320,
    telefone: '(32) 3722-4455',
    email: 'atendimento@farmavida.com.br',
    responsavel: 'Fernanda Lima',
    descontoDescricao: '15% em medicamentos genéricos e 5% em perfumaria',
    dataCadastro: '2024-04-10',
  },
  {
    id: '3',
    nome: 'Supermercado Bom Preço',
    subtitulo: 'Compras do mês e conveniência',
    cnpj: '45.678.901/0001-23',
    categoria: 'Mercado',
    endereco: 'Rua Central, 789',
    bairro: 'Centro',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Ativo',
    utilizacoes: 276,
    telefone: '(32) 3728-9900',
    email: 'gerencia@bompreco.com.br',
    responsavel: 'Marcos Vinicius Silva',
    descontoDescricao: 'Cashback de 3% nas compras do convênio',
    dataCadastro: '2024-05-02',
  },
  {
    id: '4',
    nome: 'OdontoTop Clínica',
    subtitulo: 'Consultório Odontológico',
    cnpj: '11.222.333/0001-44',
    categoria: 'Odontológico',
    endereco: 'Av. Constantino Pinto, 1000',
    bairro: 'Armação',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Inativo',
    utilizacoes: 125,
    telefone: '(32) 3729-3322',
    email: 'recepcao@odontotop.com.br',
    responsavel: 'Dra. Camila Ferreira',
    descontoDescricao: 'Avaliação gratuita e 20% em procedimentos clínicos',
    dataCadastro: '2023-11-20',
  },
  {
    id: '5',
    nome: 'FitLife Academia',
    subtitulo: 'Esporte e Lazer',
    cnpj: '66.777.888/0001-55',
    categoria: 'Esporte e Lazer',
    endereco: 'Rua do Sol, 321',
    bairro: 'Vila Mariana',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Ativo',
    utilizacoes: 198,
    telefone: '(32) 3725-8877',
    email: 'contato@fitlifeacademia.com.br',
    responsavel: 'Lucas Guimarães',
    descontoDescricao: 'Isenção de taxa de matrícula e 15% na mensalidade',
    dataCadastro: '2024-01-18',
  },
  {
    id: '6',
    nome: 'Hotel Aurora',
    subtitulo: 'Hospedagem e Eventos corporativos',
    cnpj: '33.444.555/0001-66',
    categoria: 'Hospedagem',
    endereco: 'Av. Independência, 987',
    bairro: 'Centro',
    cidade: 'Muriaé',
    estado: 'MG',
    status: 'Ativo',
    utilizacoes: 64,
    telefone: '(32) 3726-1200',
    email: 'reservas@hotelaurora.com.br',
    responsavel: 'Mariana Duarte',
    descontoDescricao: 'Tarifa corporativa diferenciada para estadias',
    dataCadastro: '2024-02-28',
  },
]

const STORAGE_KEY = 'fcv_conveniados_db'

function carregarDoStorage(): Conveniado[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Falha silenciosa de parsing
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DADOS_INICIAIS))
  return DADOS_INICIAIS
}

function salvarNoStorage(lista: Conveniado[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  } catch (err) {
    console.error('Erro ao salvar conveniados no storage:', err)
  }
}

// ------------------- OPERAÇÕES DO CRUD -------------------

export async function listarConveniados(filtros?: FiltrosConveniados): Promise<Conveniado[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulação de latência
  let lista = carregarDoStorage()

  if (filtros?.busca && filtros.busca.trim()) {
    const termo = filtros.busca.trim().toLowerCase()
    lista = lista.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.cnpj.toLowerCase().includes(termo) ||
        c.categoria.toLowerCase().includes(termo) ||
        c.cidade.toLowerCase().includes(termo) ||
        (c.bairro && c.bairro.toLowerCase().includes(termo))
    )
  }

  if (filtros?.status && filtros.status !== 'Todos') {
    lista = lista.filter((c) => c.status === filtros.status)
  }

  if (filtros?.categoria && filtros.categoria !== 'Todas') {
    lista = lista.filter((c) => c.categoria === filtros.categoria)
  }

  return lista
}

export async function obterConveniadoPorId(id: string): Promise<Conveniado | null> {
  const lista = carregarDoStorage()
  const encontrado = lista.find((c) => c.id === id)
  return encontrado || null
}

export async function criarConveniado(dados: Omit<Conveniado, 'id'>): Promise<Conveniado> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  const lista = carregarDoStorage()

  const novo: Conveniado = {
    ...dados,
    id: String(Date.now()),
    utilizacoes: dados.utilizacoes || 0,
    dataCadastro: new Date().toISOString().split('T')[0],
  }

  const novaLista = [novo, ...lista]
  salvarNoStorage(novaLista)
  return novo
}

export async function atualizarConveniado(id: string, dados: Partial<Conveniado>): Promise<Conveniado> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  const lista = carregarDoStorage()
  const index = lista.findIndex((c) => c.id === id)

  if (index === -1) {
    throw new Error('Conveniado não encontrado para atualização.')
  }

  const atualizado = { ...lista[index], ...dados }
  lista[index] = atualizado
  salvarNoStorage(lista)
  return atualizado
}

export async function excluirConveniado(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const lista = carregarDoStorage()
  const novaLista = lista.filter((c) => c.id !== id)
  salvarNoStorage(novaLista)
  return true
}

export async function obterMetricasConveniados(): Promise<MetricasConveniados> {
  const lista = carregarDoStorage()
  const total = lista.length
  const ativos = lista.filter((c) => c.status === 'Ativo').length
  const inativos = lista.filter((c) => c.status === 'Inativo').length
  const comUtilizacoes = lista.filter((c) => c.utilizacoes > 0).length

  return {
    total,
    totalCrescimento: '↑ 5% em relação ao mês anterior',
    ativos,
    ativosPercentual: total > 0 ? `${Math.round((ativos / total) * 100)}% do total` : '0%',
    inativos,
    inativosPercentual: total > 0 ? `${Math.round((inativos / total) * 100)}% do total` : '0%',
    comUtilizacoes,
    comUtilizacoesPercentual: total > 0 ? `${Math.round((comUtilizacoes / total) * 100)}% do total` : '0%',
  }
}
