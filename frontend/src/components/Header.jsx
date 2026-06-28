export default function Header({ onHistoryOpen }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shadow-md shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.878V4.533ZM12.75 20.628A8.235 8.235 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.095Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            GYM<span className="text-indigo-600">APP</span>
          </span>
        </div>

        {/* Botón de historial */}
        <button
          id="btn-abrir-historial"
          onClick={onHistoryOpen}
          title="Ver historial de registros"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-indigo-600
                     hover:bg-indigo-50 transition-all duration-150 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className="w-5 h-5 transition-transform group-hover:rotate-12">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium hidden sm:block">Historial</span>
        </button>
      </div>
    </header>
  );
}
