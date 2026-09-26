import { useState } from 'react'
import { dashboardData, type DashboardUtilizacao } from '../services/dashboardService'

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function isBetween(date: string, startDate: string, endDate: string) {
  const value = new Date(date).getTime()
  return value >= new Date(`${startDate}T00:00:00`).getTime() && value <= new Date(`${endDate}T23:59:59`).getTime()
}

export function useDashboardViewModel() {
  const [startDate, setStartDate] = useState('2025-10-13')
  const [endDate, setEndDate] = useState('2025-11-12')
  const [appliedRange, setAppliedRange] = useState({ startDate: '2025-10-13', endDate: '2025-11-12' })

  const filteredUtilizacoes = dashboardData.utilizacoes.filter((utilizacao) => isBetween(utilizacao.data_solicitacao, appliedRange.startDate, appliedRange.endDate))
  const activeCollaborators = dashboardData.colaboradores.filter(({ status }) => status === 'ATIVO').length
  const getOffer = (utilizacao: DashboardUtilizacao) => dashboardData.beneficiosConveniados.find(({ id }) => id === utilizacao.beneficio_conveniado_id)
  const getBenefit = (utilizacao: DashboardUtilizacao) => dashboardData.beneficios.find(({ id }) => id === getOffer(utilizacao)?.beneficio_id)
  const getPartner = (utilizacao: DashboardUtilizacao) => dashboardData.conveniados.find(({ id }) => id === getOffer(utilizacao)?.conveniado_id)

  const benefitStats = dashboardData.beneficios.map((benefit) => {
    const count = filteredUtilizacoes.filter((utilizacao) => getBenefit(utilizacao)?.id === benefit.id).length
    return { ...benefit, count, percentage: filteredUtilizacoes.length ? Math.round((count / filteredUtilizacoes.length) * 100) : 0 }
  }).sort((first, second) => second.count - first.count)

  const partnerStats = dashboardData.conveniados.map((partner) => {
    const count = filteredUtilizacoes.filter((utilizacao) => getPartner(utilizacao)?.id === partner.id).length
    return { ...partner, count, percentage: filteredUtilizacoes.length ? Math.round((count / filteredUtilizacoes.length) * 100) : 0 }
  }).sort((first, second) => second.count - first.count)

  const monthlyStats = monthLabels.map((label, month) => ({
    label,
    count: filteredUtilizacoes.filter(({ data_solicitacao }) => new Date(data_solicitacao).getMonth() === month).length,
  }))
  const maxMonthlyCount = Math.max(...monthlyStats.map(({ count }) => count), 1)

  function applyFilter() {
    if (startDate > endDate) return
    setAppliedRange({ startDate, endDate })
  }

  return {
    startDate,
    endDate,
    filteredUtilizacoes,
    activeCollaborators,
    benefitStats,
    partnerStats,
    monthlyStats,
    maxMonthlyCount,
    recentUtilizacoes: [...filteredUtilizacoes].sort((first, second) => second.data_solicitacao.localeCompare(first.data_solicitacao)).slice(0, 5),
    getBenefit,
    getPartner,
    setStartDate,
    setEndDate,
    applyFilter,
  }
}
