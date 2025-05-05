export default function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[#ccff33]/20 blur-[120px] rounded-full opacity-30" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vh] bg-[#ccff33]/10 blur-[100px] rounded-full opacity-20" />
    </div>
  )
}
