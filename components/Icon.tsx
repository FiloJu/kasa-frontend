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
  if (name === "star") {
    return (
      <span
        aria-label={alt || "Étoile"}
        role={alt ? "img" : undefined}
        className={className}
        style={{ fontSize: size, lineHeight: 1 }}
      >
        ★
      </span>
    );
  }

  const iconFile = name === "location" ? "local.svg" : `${name}.${name === "send" ? "png" : "svg"}`;

  return (
    <Image
      src={`/icons/${iconFile}`}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  )
}