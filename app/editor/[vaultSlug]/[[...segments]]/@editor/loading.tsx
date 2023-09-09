import { Loader2 } from "lucide-react"
const Loading = () => {
  return (
    <div className="p-12">
      <div className="flex items-center gap-1 text-sm text-gray-11">
        <Loader2 className="animate-spin" size={20} /> Loading...
      </div>
    </div>
  )
}
export default Loading
