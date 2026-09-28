import { useState, useEffect, useCallback } from 'react'
import {
  Store,
  Plus,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Utensils,
  HeartPulse,
  ShoppingCart,
  Smile,
  Dumbbell,
  Hotel,
  X,
  AlertCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Tag,
} from 'lucide-react'
import { useConveniadosViewModel } from '../../viewmodels/useConveniadosViewModel'
import type { CategoriaConveniado, Conveniado } from '../../services/conveniadosService'
import './ConveniadosListView.css'

const CATEGORIAS: CategoriaConveniado[] = [
  'Alimentação', 'Saúde', 'Mercado', 'Odontológico', 'Esporte e Lazer', 'Hospedagem', 'Educação', 'Outros',
]

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

type FormCadastro = Omit<Conveniado, 'id' | 'utilizacoes' | 'dataCadastro'>

const FORM_VAZIO: FormCadastro = {
  nome: '',
  subtitulo: '',
  cnpj: '',
  categoria: 'Alimentação',
  endereco: '',
  bairro: '',
  cidade: '',
  estado: 'MG',
  status: 'Ativo',
  telefone: '',
  email: '',
  responsavel: '',
  descontoDescricao: '',
}

function formatarCNPJ(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{2}\.\d{3})(\d)/, '$1.$2')
    .replace(/(\.\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10)
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
}

export function ConveniadosListView() {
  const {
    conveniados,
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
    setConveniadoEmEdicao,
    isModalCadastroAberto,
    setIsModalCadastroAberto,
    conveniadoParaExclusao,
    setConveniadoParaExclusao,
    isExcluindo,
    feedbackMensagem,
    setFeedbackMensagem,
    handleExcluir,
    handleSalvarNovo,
  } = useConveniadosViewModel()

  const [form, setForm] = useState<FormCadastro>(FORM_VAZIO)
  const [formErro, setFormErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [utilizacoesOcultas, setUtilizacoesOcultas] = useState<Set<string>>(new Set())

  // Fechar feedback automaticamente após 4,5 segundos
  useEffect(() => {
    if (!feedbackMensagem) return
    const timer = setTimeout(() => {
      setFeedbackMensagem(null)
    }, 4500)
    return () => clearTimeout(timer)
  }, [feedbackMensagem, setFeedbackMensagem])

  const fecharModal = useCallback(() => {
    setIsModalCadastroAberto(false)
    setFormErro(null)
  }, [setIsModalCadastroAberto])

  // Fechar modais ao pressionar tecla ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (conveniadoParaExclusao && !isExcluindo) {
          setConveniadoParaExclusao(null)
        } else if (isModalCadastroAberto && !salvando) {
          fecharModal()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [conveniadoParaExclusao, isExcluindo, isModalCadastroAberto, salvando, fecharModal, setConveniadoParaExclusao])

  function toggleUtilizacoes(id: string) {
    setUtilizacoesOcultas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function abrirModal() {
    setForm(FORM_VAZIO)
    setFormErro(null)
    setIsModalCadastroAberto(true)
  }

  function handleField(field: keyof FormCadastro, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmitCadastro(e: React.FormEvent) {
    e.preventDefault()
    setFormErro(null)

    if (!form.nome.trim()) { setFormErro('O nome do parceiro é obrigatório.'); return }
    if (!form.cnpj.trim() || form.cnpj.replace(/\D/g, '').length < 14) { setFormErro('Informe um CNPJ válido com 14 dígitos.'); return }
    if (!form.endereco.trim()) { setFormErro('O endereço é obrigatório.'); return }
    if (!form.cidade.trim()) { setFormErro('A cidade é obrigatória.'); return }

    setSalvando(true)
    const ok = await handleSalvarNovo({ ...form, utilizacoes: 0 })
    setSalvando(false)

    if (ok) {
      fecharModal()
    } else {
      setFormErro('Não foi possível cadastrar o parceiro. Tente novamente.')
    }
  }

  const renderCategoriaIcon = (categoria: CategoriaConveniado) => {
    switch (categoria) {
      case 'Alimentação':
        return <Utensils size={15} />
      case 'Saúde':
        return <HeartPulse size={15} />
      case 'Mercado':
        return <ShoppingCart size={15} />
      case 'Odontológico':
        return <Smile size={15} />
      case 'Esporte e Lazer':
        return <Dumbbell size={15} />
      case 'Hospedagem':
        return <Hotel size={15} />
      default:
        return <Store size={15} />
    }
  }

  const getCategoriaClass = (categoria: CategoriaConveniado) => {
    switch (categoria) {
      case 'Alimentação':
        return 'tag-alimentacao'
      case 'Saúde':
        return 'tag-saude'
      case 'Mercado':
        return 'tag-mercado'
      case 'Odontológico':
        return 'tag-odonto'
      case 'Esporte e Lazer':
        return 'tag-esporte'
      case 'Hospedagem':
        return 'tag-hospedagem'
      default:
        return 'tag-default'
    }
  }

  return (
    <div className="conveniados-container">
      <div className="conveniados-header">
        <div className="conveniados-header__titles">
          <div className="conveniados-title-row">
            <Store className="conveniados-main-icon" size={28} />
            <h1 className="conveniados-title">Conveniados</h1>
          </div>
          <p className="conveniados-subtitle">
            Gerencie os parceiros da Fundação. Cadastre, edite e consulte as informações e utilizações.
          </p>
        </div>

        <div className="conveniados-header__actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={abrirModal}
          >
            <Plus size={18} />
            Cadastrar parceiro
          </button>
        </div>
      </div>

      {metricas && (
        <div className="conveniados-kpis-grid">
          <div className="kpi-card">
            <div className="kpi-icon-circle kpi-icon-blue">
              <Store size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total de conveniados</span>
              <div className="kpi-number">{metricas.total}</div>
              <span className="kpi-trend trend-positive">{metricas.totalCrescimento}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-circle kpi-icon-green">
              <CheckCircle2 size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Ativos</span>
              <div className="kpi-number">{metricas.ativos}</div>
              <span className="kpi-subtext">{metricas.ativosPercentual}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-circle kpi-icon-red">
              <XCircle size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Inativos</span>
              <div className="kpi-number">{metricas.inativos}</div>
              <span className="kpi-subtext">{metricas.inativosPercentual}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-circle kpi-icon-purple">
              <FileSpreadsheet size={22} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Com utilizações</span>
              <div className="kpi-number">{metricas.comUtilizacoes}</div>
              <span className="kpi-subtext">{metricas.comUtilizacoesPercentual}</span>
            </div>
          </div>
        </div>
      )}

      <div className="conveniados-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, CNPJ, categoria, cidade ou bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <div className="filter-dropdown-group">
          <label className="filter-label">Categoria</label>
          <select
            className="filter-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Saúde">Saúde</option>
            <option value="Mercado">Mercado</option>
            <option value="Odontológico">Odontológico</option>
            <option value="Esporte e Lazer">Esporte e Lazer</option>
            <option value="Hospedagem">Hospedagem</option>
          </select>
        </div>

        <button type="button" className="btn-filter-toggle">
          <SlidersHorizontal size={17} />
          Filtros
        </button>
      </div>

      <div className="conveniados-table-card">
        {isLoading ? (
          <div className="table-state-box">
            <p>Carregando parceiros conveniados...</p>
          </div>
        ) : error ? (
          <div className="table-state-box state-error">
            <p>{error}</p>
          </div>
        ) : conveniados.length === 0 ? (
          <div className="table-state-box">
            <p>Nenhum parceiro conveniado encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="conveniados-table">
              <thead>
                <tr>
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={isTodosSelecionados}
                      onChange={toggleSelecionarTodos}
                      aria-label="Selecionar todos"
                    />
                  </th>
                  <th>Parceiro</th>
                  <th>CNPJ</th>
                  <th>Categoria</th>
                  <th>Endereço</th>
                  <th>Status</th>
                  <th>Utilizações</th>
                  <th className="th-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {conveniados.map((item) => {
                  const isChecked = selecionados.includes(item.id)

                  return (
                    <tr key={item.id} className={isChecked ? 'row-selected' : ''}>
                      <td className="td-checkbox">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelecionarItem(item.id)}
                          aria-label={`Selecionar ${item.nome}`}
                        />
                      </td>

                      <td className="td-partner">
                        <div className="partner-cell">
                          <div className="partner-avatar">
                            {renderCategoriaIcon(item.categoria)}
                          </div>
                          <div className="partner-details">
                            <span className="partner-name">{item.nome}</span>
                            {item.subtitulo && (
                              <span className="partner-sub">{item.subtitulo}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="td-cnpj">{item.cnpj}</td>

                      <td>
                        <span className={`category-tag ${getCategoriaClass(item.categoria)}`}>
                          {renderCategoriaIcon(item.categoria)}
                          {item.categoria}
                        </span>
                      </td>

                      <td className="td-address">
                        <span className="address-line">{item.endereco}</span>
                        <span className="address-city">
                          {item.bairro ? `${item.bairro} - ` : ''}
                          {item.cidade}/{item.estado}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            item.status === 'Ativo' ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          <span className="status-dot" />
                          {item.status}
                        </span>
                      </td>

                      <td className="td-usages">
                        {utilizacoesOcultas.has(item.id) ? (
                          <span className="usages-hidden">••••</span>
                        ) : (
                          <>
                            <span className="usages-count">{item.utilizacoes}</span>
                            <span className="usages-label">utilizações</span>
                          </>
                        )}
                      </td>

                      <td className="td-actions">
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className={`btn-icon-action ${utilizacoesOcultas.has(item.id) ? 'btn-icon-active' : ''}`}
                            title={utilizacoesOcultas.has(item.id) ? 'Exibir utilizações' : 'Ocultar utilizações'}
                            onClick={() => toggleUtilizacoes(item.id)}
                          >
                            {utilizacoesOcultas.has(item.id) ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action"
                            title="Editar parceiro"
                            onClick={() => setConveniadoEmEdicao(item)}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action btn-icon-delete"
                            title="Excluir parceiro"
                            onClick={() => setConveniadoParaExclusao(item)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="conveniados-pagination-bar">
          <span className="pagination-info">
            Mostrando <strong>1 - {conveniados.length}</strong> de <strong>{totalItens}</strong> conveniados
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              disabled={paginaAtual <= 1}
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                className={`pagination-btn ${paginaAtual === num ? 'pagination-btn-active' : ''}`}
                onClick={() => setPaginaAtual(num)}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="pagination-btn"
              disabled={paginaAtual >= totalPaginas}
              onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
              aria-label="Próxima página"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isModalCadastroAberto && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-cadastro-titulo"
          onClick={(e) => { if (e.target === e.currentTarget) fecharModal() }}
        >
          <div className="modal-card modal-card-lg">
            <div className="modal-header">
              <div className="modal-header__info">
                <span className="modal-header__icon"><Store size={20} /></span>
                <div>
                  <h2 id="modal-cadastro-titulo" className="modal-header__title">Cadastrar Parceiro Conveniado</h2>
                  <p className="modal-header__sub">Preencha as informações do novo estabelecimento parceiro da FCV.</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={fecharModal} aria-label="Fechar modal">
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmitCadastro} noValidate>
              <div className="modal-form-body">

                <div className="modal-section-label">
                  <Tag size={14} />
                  Dados Principais
                </div>
                <div className="modal-grid modal-grid-2">
                  <div className="modal-field modal-field-full">
                    <label htmlFor="cadastro-nome">Nome do Parceiro <span className="modal-required">*</span></label>
                    <input
                      id="cadastro-nome"
                      type="text"
                      placeholder="Ex: Restaurante Sabor & Cia"
                      value={form.nome}
                      onChange={(e) => handleField('nome', e.target.value)}
                      className="modal-input"
                      required
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-cnpj">CNPJ <span className="modal-required">*</span></label>
                    <input
                      id="cadastro-cnpj"
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={form.cnpj}
                      onChange={(e) => handleField('cnpj', formatarCNPJ(e.target.value))}
                      className="modal-input"
                      required
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-categoria">Categoria <span className="modal-required">*</span></label>
                    <select
                      id="cadastro-categoria"
                      value={form.categoria}
                      onChange={(e) => handleField('categoria', e.target.value)}
                      className="modal-input modal-select"
                    >
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-status">Status <span className="modal-required">*</span></label>
                    <select
                      id="cadastro-status"
                      value={form.status}
                      onChange={(e) => handleField('status', e.target.value)}
                      className="modal-input modal-select"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>

                  <div className="modal-field modal-field-full">
                    <label htmlFor="cadastro-subtitulo">Subtítulo / Descrição curta</label>
                    <input
                      id="cadastro-subtitulo"
                      type="text"
                      placeholder="Ex: Alimentação corporativa e à la carte"
                      value={form.subtitulo}
                      onChange={(e) => handleField('subtitulo', e.target.value)}
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="modal-section-label">
                  <MapPin size={14} />
                  Endereço
                </div>
                <div className="modal-grid modal-grid-2">
                  <div className="modal-field modal-field-full">
                    <label htmlFor="cadastro-endereco">Logradouro <span className="modal-required">*</span></label>
                    <input
                      id="cadastro-endereco"
                      type="text"
                      placeholder="Ex: Av. Brasil, 123"
                      value={form.endereco}
                      onChange={(e) => handleField('endereco', e.target.value)}
                      className="modal-input"
                      required
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-bairro">Bairro</label>
                    <input
                      id="cadastro-bairro"
                      type="text"
                      placeholder="Ex: Centro"
                      value={form.bairro}
                      onChange={(e) => handleField('bairro', e.target.value)}
                      className="modal-input"
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-cidade">Cidade <span className="modal-required">*</span></label>
                    <input
                      id="cadastro-cidade"
                      type="text"
                      placeholder="Ex: Muriaé"
                      value={form.cidade}
                      onChange={(e) => handleField('cidade', e.target.value)}
                      className="modal-input"
                      required
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-estado">Estado <span className="modal-required">*</span></label>
                    <select
                      id="cadastro-estado"
                      value={form.estado}
                      onChange={(e) => handleField('estado', e.target.value)}
                      className="modal-input modal-select"
                    >
                      {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>

                <div className="modal-section-label">
                  <Phone size={14} />
                  Contato
                </div>
                <div className="modal-grid modal-grid-2">
                  <div className="modal-field">
                    <label htmlFor="cadastro-telefone">Telefone</label>
                    <input
                      id="cadastro-telefone"
                      type="text"
                      placeholder="(32) 99999-9999"
                      value={form.telefone}
                      onChange={(e) => handleField('telefone', formatarTelefone(e.target.value))}
                      className="modal-input"
                    />
                  </div>

                  <div className="modal-field">
                    <label htmlFor="cadastro-email">E-mail</label>
                    <input
                      id="cadastro-email"
                      type="email"
                      placeholder="contato@parceiro.com.br"
                      value={form.email}
                      onChange={(e) => handleField('email', e.target.value)}
                      className="modal-input"
                    />
                  </div>

                  <div className="modal-field modal-field-full">
                    <label htmlFor="cadastro-responsavel">Responsável</label>
                    <input
                      id="cadastro-responsavel"
                      type="text"
                      placeholder="Nome do responsável pelo convênio"
                      value={form.responsavel}
                      onChange={(e) => handleField('responsavel', e.target.value)}
                      className="modal-input"
                    />
                  </div>

                  <div className="modal-field modal-field-full">
                    <label htmlFor="cadastro-desconto">Descrição do Benefício / Desconto</label>
                    <textarea
                      id="cadastro-desconto"
                      placeholder="Ex: 10% de desconto no almoço para colaboradores FCV"
                      value={form.descontoDescricao}
                      onChange={(e) => handleField('descontoDescricao', e.target.value)}
                      className="modal-input modal-textarea"
                      rows={3}
                    />
                  </div>
                </div>

              </div>

              {formErro && (
                <div className="modal-error-banner">
                  <AlertCircle size={16} />
                  <span>{formErro}</span>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={fecharModal} disabled={salvando}>
                  Cancelar
                </button>
                <button type="submit" className="modal-btn-submit" disabled={salvando}>
                  {salvando ? (
                    <><span className="modal-spinner" />Cadastrando...</>
                  ) : (
                    <><Plus size={17} />Cadastrar Parceiro</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {conveniadoParaExclusao && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-exclusao-titulo"
          aria-describedby="modal-exclusao-desc"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isExcluindo) {
              setConveniadoParaExclusao(null)
            }
          }}
        >
          <div className="modal-card modal-confirm-card">
            <div className="modal-confirm-header">
              <span className="modal-confirm-icon-danger" aria-hidden="true">
                <Trash2 size={24} />
              </span>
              <div className="modal-confirm-title-area">
                <h2 id="modal-exclusao-titulo" className="modal-confirm-title">
                  Excluir parceiro conveniado
                </h2>
                <p id="modal-exclusao-desc" className="modal-confirm-subtitle">
                  Esta ação removerá o estabelecimento do catálogo de parceiros.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !isExcluindo && setConveniadoParaExclusao(null)}
                aria-label="Fechar modal"
                disabled={isExcluindo}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-confirm-body">
              <p className="modal-confirm-text">
                Tem certeza de que deseja excluir o conveniado{' '}
                <strong>{conveniadoParaExclusao.nome}</strong>?
              </p>

              <div className="modal-confirm-target-box">
                <div className="modal-confirm-target-header">
                  <span className="modal-confirm-target-name">
                    {conveniadoParaExclusao.nome}
                  </span>
                  <span className={`category-tag ${getCategoriaClass(conveniadoParaExclusao.categoria)}`}>
                    {renderCategoriaIcon(conveniadoParaExclusao.categoria)}
                    {conveniadoParaExclusao.categoria}
                  </span>
                </div>
                <div className="modal-confirm-target-meta">
                  <span>
                    <strong>CNPJ:</strong> {conveniadoParaExclusao.cnpj}
                  </span>
                  <span>
                    <MapPin size={13} />
                    {conveniadoParaExclusao.cidade}/{conveniadoParaExclusao.estado}
                  </span>
                  <span>
                    <strong>Status:</strong> {conveniadoParaExclusao.status}
                  </span>
                  <span>
                    <strong>{conveniadoParaExclusao.utilizacoes}</strong> utilizações registradas
                  </span>
                </div>
              </div>

              <div className="modal-confirm-alert">
                <AlertTriangle size={18} />
                <span>
                  <strong>Atenção:</strong> Esta ação é irreversível. Colaboradores não poderão mais usufruir de convênios com este estabelecimento.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setConveniadoParaExclusao(null)}
                disabled={isExcluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-btn-danger"
                onClick={() => handleExcluir(conveniadoParaExclusao.id)}
                disabled={isExcluindo}
              >
                {isExcluindo ? (
                  <>
                    <span className="modal-spinner" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Sim, excluir parceiro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação Toast de Feedback */}
      {feedbackMensagem && (
        <div
          className={`conveniados-toast ${
            feedbackMensagem.tipo === 'sucesso'
              ? 'conveniados-toast-success'
              : 'conveniados-toast-error'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="conveniados-toast__icon">
            {feedbackMensagem.tipo === 'sucesso' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>
          <div className="conveniados-toast__content">
            {feedbackMensagem.texto}
          </div>
          <button
            type="button"
            className="conveniados-toast__close"
            onClick={() => setFeedbackMensagem(null)}
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
