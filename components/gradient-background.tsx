export default function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#ccff33]/30 blur-[80px] rounded-full opacity-60" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-[#ccff33]/20 blur-[70px] rounded-full opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-[35vw] h-[35vh] bg-[#7dcc00]/15 blur-[90px] rounded-full opacity-40" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
        <img 
          src="/logo-black.png" 
          alt="Logo" 
          className="w-350 h-350"
          style={{
            filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 0 5px rgba(204, 255, 51, 0.3))'
          }}
        />
      </div>
    </div>
  )
}
