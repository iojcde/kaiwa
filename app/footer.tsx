import { ThemeToggle } from "@/components/theme-toggle"

export const Footer = () => {
  return (
    <footer className="container my-6 flex justify-between border-t py-6">
      <div>
        {" "}
        <span className="font-display text-2xl font-medium">Kaiwa</span>
        <p className="mt-2 text-sm text-gray-11">
          ©{new Date().getFullYear()} <a href="https://jcde.xyz">Jeeho Ahn</a>.
        </p>
      </div>

      <div>
        <ThemeToggle />
      </div>
    </footer>
  )
}
