import { User } from "lucide-react"
import { useAuth } from "./auth-provider"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { userEmail } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {userEmail?.split("@")[0] || "admin"}
        </span>
      </div>
    </header>
  )
}
