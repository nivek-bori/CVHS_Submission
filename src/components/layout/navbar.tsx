export default function Navigation() {
  return (
    <nav className="flex h-20 w-full flex-shrink-0 items-center justify-between border-b-2 border-blue-400 px-6 py-4 shadow">
      {/* Left: App Name and Links */}
      <div className="flex items-center space-x-9">
        <div className="text-[1.7rem] font-bold tracking-wide">SafeSpace</div>
        <a href="/" className="rounded border-1 border-blue-200 bg-blue-100 px-[0.7rem] py-[0.2rem] text-base font-semibold text-blue-700 transition">
          Home
        </a>
      </div>
      {/* Right: Profile Button */}
      <button className="rounded bg-blue-500 px-4 py-1.5 text-base font-semibold text-white hover:bg-blue-600">Profile</button>
    </nav>
  );
}
