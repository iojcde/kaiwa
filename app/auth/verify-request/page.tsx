import { Button } from "@/components/ui/button"
import Link from "next/link"

const VerifyRequestPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">Verify Request</h1>
      <p className="mb-8 text-lg">
        Please check your email for a magic login link.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  )
}

export default VerifyRequestPage
