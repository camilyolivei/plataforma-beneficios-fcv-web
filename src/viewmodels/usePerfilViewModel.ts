import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getColaboradorByUsuarioId, saveUsuarioProfile, type Colaborador } from '../services/usuarioService'
import type { UserProfileUpdate } from '../services/authService'
import { useAuthViewModel } from './useAuthViewModel'
import { getOriginSectionFromRoute, getScreenTitleFromRoute } from './routeUtils'

type PerfilLocationState = {
  from?: string
  fromTitle?: string
}

export function usePerfilViewModel() {
  const { user, updateUser } = useAuthViewModel()
  const navigate = useNavigate()
  const location = useLocation()

  // Preservação dinâmica da rota e tela de origem
  const state = (location.state as PerfilLocationState | null) ?? null
  const previousRoute = state?.from && state.from !== '/perfil' ? state.from : '/dashboard'
  const previousScreenTitle = state?.fromTitle || getScreenTitleFromRoute(previousRoute)
  const backButtonLabel = `Voltar para ${previousScreenTitle}`
  const originSection = getOriginSectionFromRoute(previousRoute)

  // Dados originais do usuário
  const originalName = user?.name ?? ''
  const originalAvatarUrl = user?.avatarUrl ?? ''

  // Campos editáveis pelo usuário: Nome e Foto do Perfil
  const [name, setName] = useState(originalName)
  const [avatarUrl, setAvatarUrl] = useState(originalAvatarUrl)

  // Dados somente leitura do vínculo
  const [colaborador, setColaborador] = useState<Colaborador | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Mensagens e feedbacks
  const [message, setMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [error, setError] = useState('')

  // Estado da confirmação de saída com alterações não salvas
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  // Sincroniza os dados do formulário quando o usuário autenticado for carregado/atualizado
  useEffect(() => {
    if (!user) return
    setName(user.name)
    setAvatarUrl(user.avatarUrl ?? '')
    void getColaboradorByUsuarioId(user.id).then(setColaborador)
  }, [user])

  // Detecção de alterações feita estritamente no ViewModel (Nome e Foto do Perfil)
  const isNameChanged = name.trim() !== originalName.trim()
  const isAvatarChanged = (avatarUrl || '') !== (originalAvatarUrl || '')
  const hasChanges = isNameChanged || isAvatarChanged

  function handleNameChange(value: string) {
    setName(value)
    if (message) setMessage('')
    if (infoMessage) setInfoMessage('')
    if (error) setError('')
  }

  function handleAvatarChange(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG ou WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A foto selecionada deve ter no máximo 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result)
        if (message) setMessage('')
        if (infoMessage) setInfoMessage('')
        if (error) setError('')
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveAvatar() {
    setAvatarUrl('')
    if (message) setMessage('')
    if (infoMessage) setInfoMessage('')
    if (error) setError('')
  }

  function validate() {
    if (name.trim().length < 2) return 'Informe um nome válido.'
    return ''
  }

  // Salvar alterações
  async function save() {
    // Cenário 1: Sem nenhuma alteração
    if (!hasChanges) {
      setError('')
      setMessage('')
      setInfoMessage('Você não fez nenhuma alteração.')
      return
    }

    // Cenário 2: Validação
    const validationError = validate()
    if (validationError || !user) {
      setError(validationError || 'Usuário não autenticado.')
      setMessage('')
      setInfoMessage('')
      return
    }

    // Apenas os campos que realmente foram alterados
    const changes: UserProfileUpdate = {}
    if (isNameChanged) {
      changes.name = name.trim()
    }
    if (isAvatarChanged) {
      changes.avatarUrl = avatarUrl
    }

    setError('')
    setMessage('')
    setInfoMessage('')
    setIsSaving(true)

    try {
      // Chama o Model/Service para atualizar os dados mockados
      const updatedUser = await saveUsuarioProfile(user.id, changes)

      // Atualiza a fonte única da verdade (atualiza TopBar e aplicação)
      updateUser(updatedUser)
      setName(updatedUser.name)
      setAvatarUrl(updatedUser.avatarUrl ?? '')

      // Mensagem de sucesso
      setMessage('Alterações salvas com sucesso.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar as alterações.')
    } finally {
      setIsSaving(false)
    }
  }

  // Cancelar: descarta qualquer alteração e retorna imediatamente para a tela anterior
  function cancel() {
    setName(originalName)
    setAvatarUrl(originalAvatarUrl)
    setError('')
    setMessage('')
    setInfoMessage('')
    setIsConfirmDialogOpen(false)
    navigate(previousRoute)
  }

  // Voltar para a tela anterior
  function requestBack() {
    if (hasChanges) {
      setIsConfirmDialogOpen(true)
    } else {
      navigate(previousRoute)
    }
  }

  function confirmLeaveWithoutSaving() {
    setName(originalName)
    setAvatarUrl(originalAvatarUrl)
    setError('')
    setMessage('')
    setInfoMessage('')
    setIsConfirmDialogOpen(false)
    navigate(previousRoute)
  }

  function cancelLeave() {
    setIsConfirmDialogOpen(false)
  }

  return {
    user,
    name,
    avatarUrl,
    originalName,
    originalAvatarUrl,
    colaborador,
    isSaving,
    message,
    infoMessage,
    error,
    hasChanges,
    isNameChanged,
    isAvatarChanged,
    previousRoute,
    previousScreenTitle,
    backButtonLabel,
    originSection,
    isConfirmDialogOpen,
    setName: handleNameChange,
    onAvatarFileSelected: handleAvatarChange,
    onRemoveAvatar: handleRemoveAvatar,
    save,
    cancel,
    requestBack,
    confirmLeaveWithoutSaving,
    cancelLeave,
  }
}
