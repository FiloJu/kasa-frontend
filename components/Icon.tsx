import Image from 'next/image'

// Noms d'icônes disponibles dans /public/icons/
export type IconName =
  | 'back'
  | 'burger'
  | 'close'
  | 'delete'
  | 'heart'
  | 'grey-heart'
  | 'location'
  | 'menu'
  | 'message'
  | 'plus'
  | 'send'
  | 'star'

type IconProps = {
  name: IconName
  size?: number
  alt?: string
  className?: string
}

export default function Icon({ name, size = 24, alt = '', className }: IconProps) {
  const ext = name === 'send' ? 'png' : 'svg'

  return (
    <Image
      src={`/icons/${name}.${ext}`}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  )
}