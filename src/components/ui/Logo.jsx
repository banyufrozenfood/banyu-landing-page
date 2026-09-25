import logo from '../../assets/banyu-logo.svg'
import logoWhite from '../../assets/banyu-logo-white.svg'
import icon from '../../assets/banyu-icon.svg'

/**
 * Logo - Banyu Frozen Food
 * variants: 'default' (dark text on light bg), 'white' (white text on dark bg), 'icon' (square only)
 */
export default function Logo({ variant = 'default', height = 44, className = '', ...props }) {
  const src = variant === 'white' ? logoWhite : variant === 'icon' ? icon : logo
  const alt = 'Banyu Frozen Food'
  return <img src={src} alt={alt} height={height} style={{ height: `${height}px`, width: 'auto' }} className={className} {...props} />
}
