import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  listarConveniados,
  obterMetricasConveniados,
  excluirConveniado,
  criarConveniado,
  atualizarConveniado,
  type Conveniado,
  type MetricasConveniados,
} from '../services/conveniadosService'

export function useConveniadosViewModel() {
  const [conveniados, setConveniados] = useState<Conveniado[]>([])
  const [metricas, setMetricas] = useState<MetricasConveniados | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [busca, setBusca] = useState<string>('')
  const [statusFiltro, setStatusFiltro] = useState<string>('Todos')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas')

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState<number>(1)
  const itensPorPagina = 6

  // Seleção múltipla
  const [selecionados, setSelecionados] = useState<string[]>([])

  // Estado para modais
  const [conveniadoEmVisualizacao, setConveniadoEmVisualizacao] = useState<Conveniado | null>(null)
  const [conveniadoEmEdicao, setConveniadoEmEdicao] = useState<Conveniado | null>(null)
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState<boolean>(false)
  const [conveniadoParaExclusao, setConveniadoParaExclusao] = useState<Conveniado | null>(null)

  // Carregar dados
  const carregarDados = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [lista, kpis] = await Promise.all([
        listarConveniados({
          busca,
          status: statusFiltro,
          categoria: categoriaFiltro,
        }),
        obterMetricasConveniados(),
      ])
      setConveniados(lista)
      setMetricas(kpis)
    } catch (err) {
      setError('Falha ao carregar a lista de conveniados.')
    } finally {
      setIsLoading(false)
    }
  }, [busca, statusFiltro, categoriaFiltro])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // Itens paginados
  const totalItens = conveniados.length
  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina))

  const conveniadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina
    return conveniados.slice(inicio, inicio + itensPorPagina)
  }, [conveniados, paginaAtual, itensPorPagina])

  // Handlers de seleção
  const isTodosSelecionados = useMemo(() => {
    if (conveniadosPaginados.length === 0) return false
    return conveniadosPaginados.every((c) => selecionados.includes(c.id))
  }, [conveniadosPaginados, selecionados])

  const toggleSelecionarTodos = () => {
    if (isTodosSelecionados) {
      const idsPagina = conveniadosPaginados.map((c) => c.id)
      setSelecionados((prev) => prev.filter((id) => !idsPagina.includes(id)))
    } else {
      const novosIds = conveniadosPaginados.map((c) => c.id)
      setSelecionados((prev) => Array.from(new Set([...prev, ...novosIds])))
    }
  }

  const toggleSelecionarItem = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Ações CRUD
  const handleExcluir = async (id: string) => {
    try {
      await excluirConveniado(id)
      setConveniadoParaExclusao(null)
      await carregarDados()
      return true
    } catch {
      setError('Erro ao excluir conveniado.')
      return false
    }
  }

  const handleSalvarNovo = async (dados: Omit<Conveniado, 'id'>) => {
    try {
      await criarConveniado(dados)
      setIsModalCadastroAberto(false)
      await carregarDados()
      return true
    } catch {
      setError('Erro ao cadastrar conveniado.')
      return false
    }
  }

  const handleAtualizar = async (id: string, dados: Partial<Conveniado>) => {
    try {
      await atualizarConveniado(id, dados)
      setConveniadoEmEdicao(null)
      await carregarDados()
      return true
    } catch {
      setError('Erro ao atualizar conveniado.')
      return false
    }
  }

  return {
    conveniados: conveniadosPaginados,
    totalItens,
    totalPaginas,
    paginaAtual,
    setPaginaAtual,
    metricas,
    isLoading,
    error,
    busca,
    setBusca,
    statusFiltro,
    setStatusFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    selecionados,
    isTodosSelecionados,
    toggleSelecionarTodos,
    toggleSelecionarItem,
    // Modais e ações
    conveniadoEmVisualizacao,
    setConveniadoEmVisualizacao,
    conveniadoEmEdicao,
    setConveniadoEmEdicao,
    isModalCadastroAberto,
    setIsModalCadastroAberto,
    conveniadoParaExclusao,
    setConveniadoParaExclusao,
    handleExcluir,
    handleSalvarNovo,
    handleAtualizar,
    recarregar: carregarDados,
  }
}
