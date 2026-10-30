import Image from 'next/image'

/** Names of the icons available through the shared Icon component. */
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

/**
 * Props for the Icon component.
 */
type IconProps = {
  name: IconName
  size?: number
  alt?: string
  className?: string
}

/**
 * A utility component for rendering icons.
 * Handles special rendering for the star icon (as text) and SVG/PNG files from /public/icons/.
 * The location icon is mapped from local.svg.
 *
 * @param {IconProps} props - Component properties.
 * @returns {React.ReactElement} An image element or span containing the icon.
 */
export default function Icon({ name, size = 24, alt = '', className }: IconProps) {
  // Special case: star is rendered as a Unicode character rather than an image
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

  // Map icon names to file paths; 'send' uses .png, others use .svg; 'location' maps to local.svg
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