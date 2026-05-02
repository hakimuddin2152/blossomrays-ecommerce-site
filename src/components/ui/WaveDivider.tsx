interface WaveDividerProps {
  flip?: boolean
  color?: string
  bgColor?: string
}

export default function WaveDivider({
  flip = false,
  color = '#FFF9F7',
  bgColor = 'transparent',
}: WaveDividerProps) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ backgroundColor: bgColor, transform: flip ? 'rotate(180deg)' : 'none' }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-20"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
