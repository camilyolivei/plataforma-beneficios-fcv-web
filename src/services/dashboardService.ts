export type DashboardBenefit = {
  id: string
  nome: string
  status: 'ATIVO' | 'INATIVO' | 'DESCONTINUADO'
}

export type DashboardConveniado = {
  id: string
  nome_fantasia: string
  categoria: string
  status: 'ATIVO' | 'INATIVO' | 'EM_ANALISE'
}

export type DashboardBenefitConveniado = {
  id: string
  beneficio_id: string
  conveniado_id: string
  status: 'ATIVO' | 'INATIVO'
}

export type DashboardColaborador = {
  id: string
  status: 'ATIVO' | 'INATIVO' | 'AFASTADO'
}

export type DashboardUtilizacao = {
  id: string
  colaborador_id: string
  beneficio_conveniado_id?: string
  beneficio_campanha_conveniado_id?: string
  token_qrcode: string
  data_solicitacao: string
  data_confirmacao?: string
  valor_aplicado: number
  canal_validacao: 'APP_CONVENIADO' | 'TERMINAL_IOT'
  status: 'PENDENTE' | 'APROVADA' | 'REPROVADA' | 'ESTORNADA'
  observacoes?: string
}

export type DashboardData = {
  beneficios: DashboardBenefit[]
  conveniados: DashboardConveniado[]
  beneficiosConveniados: DashboardBenefitConveniado[]
  colaboradores: DashboardColaborador[]
  utilizacoes: DashboardUtilizacao[]
}

export const dashboardData: DashboardData = {
  beneficios: [
    { id: 'beneficio-alimentacao', nome: 'Alimentação', status: 'ATIVO' },
    { id: 'beneficio-saude', nome: 'Saúde e Bem-estar', status: 'ATIVO' },
    { id: 'beneficio-transporte', nome: 'Transporte', status: 'ATIVO' },
    { id: 'beneficio-odontologico', nome: 'Odontológico', status: 'ATIVO' },
    { id: 'beneficio-cultura', nome: 'Cultura e Lazer', status: 'ATIVO' },
    { id: 'beneficio-esporte', nome: 'Esporte e Lazer', status: 'ATIVO' },
  ],
  conveniados: [
    { id: 'conveniado-sabor', nome_fantasia: 'Sabor & Cia Restaurante', categoria: 'Alimentação', status: 'ATIVO' },
    { id: 'conveniado-farmacia', nome_fantasia: 'Farmácia Vida', categoria: 'Saúde e Bem-estar', status: 'ATIVO' },
    { id: 'conveniado-academia', nome_fantasia: 'Academia FitLife', categoria: 'Saúde e Bem-estar', status: 'ATIVO' },
    { id: 'conveniado-supermercado', nome_fantasia: 'Supermercado Bom Preço', categoria: 'Alimentação', status: 'ATIVO' },
    { id: 'conveniado-otica', nome_fantasia: 'Ótica Visão', categoria: 'Saúde e Bem-estar', status: 'ATIVO' },
  ],
  beneficiosConveniados: [
    { id: 'oferta-sabor', beneficio_id: 'beneficio-alimentacao', conveniado_id: 'conveniado-sabor', status: 'ATIVO' },
    { id: 'oferta-farmacia', beneficio_id: 'beneficio-saude', conveniado_id: 'conveniado-farmacia', status: 'ATIVO' },
    { id: 'oferta-academia', beneficio_id: 'beneficio-saude', conveniado_id: 'conveniado-academia', status: 'ATIVO' },
    { id: 'oferta-supermercado', beneficio_id: 'beneficio-alimentacao', conveniado_id: 'conveniado-supermercado', status: 'ATIVO' },
    { id: 'oferta-otica', beneficio_id: 'beneficio-odontologico', conveniado_id: 'conveniado-otica', status: 'ATIVO' },
  ],
  colaboradores: [
    { id: 'colaborador-001', status: 'ATIVO' },
    { id: 'colaborador-002', status: 'ATIVO' },
    { id: 'colaborador-003', status: 'ATIVO' },
    { id: 'colaborador-004', status: 'INATIVO' },
  ],
  utilizacoes: [
    { id: 'utilizacao-001', colaborador_id: 'colaborador-001', beneficio_conveniado_id: 'oferta-sabor', token_qrcode: 'qr-001', data_solicitacao: '2025-10-13T12:45:00', data_confirmacao: '2025-10-13T12:46:00', valor_aplicado: 42, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-002', colaborador_id: 'colaborador-002', beneficio_conveniado_id: 'oferta-farmacia', token_qrcode: 'qr-002', data_solicitacao: '2025-10-18T07:30:00', data_confirmacao: '2025-10-18T07:31:00', valor_aplicado: 35, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-003', colaborador_id: 'colaborador-003', beneficio_conveniado_id: 'oferta-academia', token_qrcode: 'qr-003', data_solicitacao: '2025-10-22T08:15:00', valor_aplicado: 80, canal_validacao: 'TERMINAL_IOT', status: 'PENDENTE' },
    { id: 'utilizacao-004', colaborador_id: 'colaborador-001', beneficio_conveniado_id: 'oferta-supermercado', token_qrcode: 'qr-004', data_solicitacao: '2025-10-28T14:30:00', data_confirmacao: '2025-10-28T14:31:00', valor_aplicado: 120, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-005', colaborador_id: 'colaborador-002', beneficio_conveniado_id: 'oferta-otica', token_qrcode: 'qr-005', data_solicitacao: '2025-11-02T19:12:00', data_confirmacao: '2025-11-02T19:13:00', valor_aplicado: 55, canal_validacao: 'APP_CONVENIADO', status: 'REPROVADA' },
    { id: 'utilizacao-006', colaborador_id: 'colaborador-003', beneficio_conveniado_id: 'oferta-sabor', token_qrcode: 'qr-006', data_solicitacao: '2025-11-04T12:10:00', data_confirmacao: '2025-11-04T12:11:00', valor_aplicado: 28, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-007', colaborador_id: 'colaborador-001', beneficio_conveniado_id: 'oferta-farmacia', token_qrcode: 'qr-007', data_solicitacao: '2025-11-06T09:05:00', data_confirmacao: '2025-11-06T09:06:00', valor_aplicado: 24, canal_validacao: 'TERMINAL_IOT', status: 'APROVADA' },
    { id: 'utilizacao-008', colaborador_id: 'colaborador-002', beneficio_conveniado_id: 'oferta-academia', token_qrcode: 'qr-008', data_solicitacao: '2025-11-08T07:40:00', data_confirmacao: '2025-11-08T07:41:00', valor_aplicado: 80, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-009', colaborador_id: 'colaborador-003', beneficio_conveniado_id: 'oferta-sabor', token_qrcode: 'qr-009', data_solicitacao: '2025-11-10T12:20:00', data_confirmacao: '2025-11-10T12:21:00', valor_aplicado: 38, canal_validacao: 'APP_CONVENIADO', status: 'APROVADA' },
    { id: 'utilizacao-010', colaborador_id: 'colaborador-001', beneficio_conveniado_id: 'oferta-supermercado', token_qrcode: 'qr-010', data_solicitacao: '2025-11-12T16:25:00', valor_aplicado: 95, canal_validacao: 'TERMINAL_IOT', status: 'PENDENTE' },
  ],
}
