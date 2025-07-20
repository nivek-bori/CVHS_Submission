export default function Loading({ message }: { message: string | null }) {
  return (
    <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></span>
      {message && <div className="mt-4 max-w-xs text-center text-base font-medium break-words text-gray-700">{message}</div>}
    </div>
  );
}
