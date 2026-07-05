import MobileContainer from "@/components/layout/MobileContainer";

export default function SessionRedirect({ error }) {
  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        {error ? (
          <div className="max-w-sm text-center">
            <p className="mb-4 text-5xl">⚠️</p>
            <h1 className="mb-2 text-lg font-semibold">
              Link verification failed
            </h1>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-gray-500">
              Verifying your family link...
            </p>
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
