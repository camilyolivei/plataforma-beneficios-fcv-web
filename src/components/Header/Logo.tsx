import logoFcv from '../../assets/brand/logofcv_blue.svg'

type LogoProps = {
  className?: string
  alt?: string
}

export function Logo({
  className,
  alt = 'Fundação Cristiano Varella',
}: LogoProps) {
  return (
    <img
      src={logoFcv}
      alt={alt}
      className={className}
    />
  )
}