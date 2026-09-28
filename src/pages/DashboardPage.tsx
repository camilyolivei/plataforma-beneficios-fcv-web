import { Activity, CalendarDays, CheckCircle2, ChevronDown, CircleAlert, Gift, MoreHorizontal, Users } from 'lucide-react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'
import { useDashboardNavigationViewModel } from '../viewmodels/useDashboardNavigationViewModel'
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel'
import { ConveniadosListView } from '../components/Conveniados/ConveniadosListView'
import './DashboardPage.css'
import './DashboardTheme.css'
import './DashboardPanels.css'
import './RecentPanel.css'
import './PartnersPanel.css'
import './BenefitsPanel.css'
import './DashboardMobile.css'

const chartColors = ['#1765c0', '#347fbd', '#5799ca', '#79add2', '#9bc4df', '#bfd9ea']

function DashboardOverview({ userName }: { userName?: string }) {
  const dashboard = useDashboardViewModel()
  const total = dashboard.filteredUtilizacoes.length
  const topBenefits = dashboard.benefitStats.slice(0, 3).filter(({ count }) => count > 0).map(({ nome }) => nome).join(', ') || 'Sem utilizações no período'
  const lowBenefits = dashboard.benefitStats.slice(-2).filter(({ count }) => count === 0).map(({ nome }) => nome).join(' e ') || 'Nenhum benefício sem utilização'
  const chartPoints = dashboard.monthlyStats.map(({ count }, index) => `${(index / 11) * 680},${188 - (count / dashboard.maxMonthlyCount) * 165}`).join(' ')

  return (
    <div className="overview">
      <div className="overview-heading">
        <div><h1>Olá, {userName?.split(' ')[0] || 'Camily'}!</h1><p>Aqui está um resumo das utilizações e dos benefícios da Fundação.</p></div>
        <div className="dashboard-filter dashboard-date-filter">
          <div className="date-filter-title"><CalendarDays size={16} /><span>Filtrar por data</span></div>
          <label><span>Data inicial</span><input type="date" value={dashboard.startDate} onChange={(event) => dashboard.setStartDate(event.currentTarget.value)} /></label>
          <span className="date-filter-divider">até</span>
          <label><span>Data final</span><input type="date" value={dashboard.endDate} min={dashboard.startDate} onChange={(event) => dashboard.setEndDate(event.currentTarget.value)} /></label>
          <button className="apply-filter" type="button" onClick={dashboard.applyFilter}>Aplicar</button>
        </div>
      </div>
      <div className="stats-grid"><StatCard icon={<CheckCircle2 />} iconClass="blue-dark" label="Total de utilizações" value={total.toLocaleString('pt-BR')} detail="registros de utilização" /><StatCard icon={<Gift />} iconClass="blue-mid" label="Benefícios mais utilizados" value={dashboard.benefitStats.filter(({ count }) => count > 0).length.toString()} detail={topBenefits} /><StatCard icon={<CircleAlert />} iconClass="blue-light" label="Benefícios sem utilização" value={dashboard.benefitStats.filter(({ count }) => count === 0).length.toString()} detail={lowBenefits} /><StatCard icon={<Users />} iconClass="blue-pale" label="Colaboradores ativos" value={dashboard.activeCollaborators.toLocaleString('pt-BR')} detail="status ATIVO na modelagem" /></div>
      <div className="dashboard-grid dashboard-grid-main">
        <section className="panel usage-panel"><PanelHeading title="Utilizações por período" action="Dados filtrados" /><div className="line-chart"><div className="chart-y-axis"><span>{dashboard.maxMonthlyCount}</span><span>{Math.round(dashboard.maxMonthlyCount / 2)}</span><span>0</span></div><svg viewBox="0 0 680 190" role="img" aria-label="Utilizações por mês"><g className="chart-grid-lines"><path d="M0 20H680M0 104H680M0 188H680" /></g><polyline className="chart-line" points={chartPoints} />{dashboard.monthlyStats.map(({ count }, index) => <circle key={index} cx={(index / 11) * 680} cy={188 - (count / dashboard.maxMonthlyCount) * 165} r="4" />)}</svg><div className="chart-x-axis">{dashboard.monthlyStats.map(({ label }) => <span key={label}>{label}</span>)}</div></div></section>
        <section className="panel category-panel"><PanelHeading title="Benefícios mais utilizados" /><div className="donut-content"><div className="donut-chart"><div><strong>{total.toLocaleString('pt-BR')}</strong><span>Utilizações</span></div></div><div className="legend">{dashboard.benefitStats.map((benefit, index) => <div className="legend-item" key={benefit.id} data-tooltip={benefit.nome}><i style={{ backgroundColor: chartColors[index] }} />{benefit.nome}<b>{benefit.percentage}%</b></div>)}</div></div></section>
        <section className="panel low-usage-panel"><PanelHeading title="Benefícios sem utilização" /><div className="low-usage-list">{dashboard.benefitStats.filter(({ count }) => count === 0).slice(0, 2).map((benefit) => <LowUsage key={benefit.id} name={benefit.nome} uses="0 utilizações no período" />)}{dashboard.benefitStats.every(({ count }) => count > 0) && <p className="empty-panel">Todos os benefícios tiveram utilização.</p>}</div></section>
      </div>
      <div className="dashboard-grid dashboard-grid-bottom"><section className="panel partners-panel"><PanelHeading title="Conveniados mais utilizados" /><div className="partners-list">{dashboard.partnerStats.slice(0, 5).map((partner, index) => <div className="partner-row" key={partner.id}><span className="rank">{index + 1}</span><span className="partner-logo blue">{partner.nome_fantasia.charAt(0)}</span><div className="partner-info"><strong data-tooltip={partner.nome_fantasia}>{partner.nome_fantasia}</strong><span>{partner.count} utilizações</span><div className="progress"><i style={{ width: `${partner.percentage}%` }} /></div></div><small>{partner.percentage}% do total</small></div>)}</div></section><section className="panel bars-panel"><PanelHeading title="Utilizações por benefício" /><div className="bars-chart">{dashboard.benefitStats.map((benefit, index) => <div className="bar-column" key={benefit.id}><strong>{benefit.count}</strong><i style={{ height: `${(benefit.count / Math.max(dashboard.maxMonthlyCount, 1)) * 120}px`, backgroundColor: chartColors[index] }} /><span data-tooltip={benefit.nome}>{benefit.nome.charAt(0)}</span><small data-tooltip={benefit.nome}>{benefit.nome}</small></div>)}</div></section><section className="panel recent-panel"><PanelHeading title="Últimas utilizações" /><div className="recent-list">{dashboard.recentUtilizacoes.map((utilizacao) => <div className="recent-row" key={utilizacao.id}><span className="recent-icon"><Activity size={16} /></span><div><strong data-tooltip={dashboard.getBenefit(utilizacao)?.nome}>{dashboard.getBenefit(utilizacao)?.nome || 'Benefício'}</strong><span data-tooltip={dashboard.getPartner(utilizacao)?.nome_fantasia}>{dashboard.getPartner(utilizacao)?.nome_fantasia || 'Sem conveniado'}</span></div><time>{new Date(utilizacao.data_solicitacao).toLocaleDateString('pt-BR')}</time><em className={`status ${utilizacao.status.toLowerCase()}`}>{utilizacao.status}</em></div>)}</div></section></div>
    </div>
  )
}

function StatCard({ icon, iconClass, label, value, detail }: { icon: React.ReactNode; iconClass: string; label: string; value: string; detail: string }) { return <article className="stat-card"><span className={`stat-icon ${iconClass}`}>{icon}</span><div><span className="stat-label">{label}</span><strong>{value}</strong><small>{detail}</small></div></article> }
function PanelHeading({ title, action }: { title: string; action?: string }) { return <div className="panel-heading"><h2>{title}</h2>{action && <span className="panel-action">{action}<ChevronDown size={13} /></span>}</div> }
function LowUsage({ name, uses }: { name: string; uses: string }) { return <div className="low-usage"><span className="low-icon blue">{name.charAt(0)}</span><div><strong>{name}</strong><span>{uses}</span><div className="low-progress"><i /></div></div><MoreHorizontal size={16} /></div> }

export function DashboardPage() {
  const { activeSection, currentSection, navigateTo, logout } = useDashboardNavigationViewModel()
  const { user } = useAuthViewModel()
  if (!user) return null
  return <DashboardLayout activeSection={activeSection} onNavigate={navigateTo} onLogout={logout} userName={user.name} userRole={user.role} userAvatarUrl={user.avatarUrl}>{activeSection === 'conveniados' ? <ConveniadosListView /> : activeSection === 'dashboard' ? <DashboardOverview userName={user.name} /> : <><h1 className="dashboard-page-title">{currentSection.title}</h1><div className="dashboard-card"><p>{currentSection.description}</p>{activeSection !== 'ajuda' && <p className="dashboard-placeholder">Esta área está preparada para receber o conteúdo do módulo.</p>}</div></>}</DashboardLayout>
}
