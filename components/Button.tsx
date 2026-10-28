import Link from 'next/link'

type ButtonVariant = 'primary' | 'dark' | 'light'

/**
 * Props for the Button component.
 */
type ButtonProps = {
  variant?: ButtonVariant
  icon?: React.ReactNode
  children?: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Tailwind styles for each button variant.
 * Defines colors, text color, and hover states for primary, dark, and light variants.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#99331A] text-white hover:bg-[#7D2915]',
  dark: 'bg-red-800 text-white hover:bg-red-900',
  light: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
}

/**
 * A reusable button component that can render either as a Link or HTML button element.
 * Supports multiple visual variants and optional icon.
 *
 * @param {ButtonProps} props - Component properties.
 * @returns {React.ReactElement} A button or link element with applied styles.
 */
export default function Button({
  variant = 'primary',
  icon,
  children,
  href,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base = `flex items-center justify-center gap-2.5 h-9 rounded-[10px] py-2 px-8 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#99331A] ${variantStyles[variant]} ${className}`

  // Render as a Link when href is provided; otherwise render as a button element
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={base}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {icon}
      {children}
    </button>
  )
}