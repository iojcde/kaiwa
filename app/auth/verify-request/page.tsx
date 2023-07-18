const VerifyRequestPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">Verify Request</h1>
      <p className="mb-8 text-lg">
        Please check your email for a verification link.
      </p>
      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Verify
      </button>
    </div>
  )
}

export default VerifyRequestPage
