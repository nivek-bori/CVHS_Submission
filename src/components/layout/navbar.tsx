export default function Navigation() {
  return (
    <nav className="flex h-20 w-full flex-shrink-0 items-center justify-between bg-gray-100 px-6 py-4 shadow">
      {/* Left: App Name and Links */}
      <div className="flex items-center space-x-8">
        <div className="text-2xl font-bold tracking-wide">SafeSpace</div>
        <a href="/" className="text-base font-semibold text-blue-700 hover:underline">
          Home
        </a>
      </div>
      {/* Right: Profile Button */}
      <button className="rounded bg-blue-500 px-4 py-1.5 text-base font-semibold text-white hover:bg-blue-600">Profile</button>
    </nav>
  );
}
