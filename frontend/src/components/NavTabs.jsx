const TABS = [
  { id: 'planes', label: 'Planes' },
  { id: 'membresias', label: 'Membresías' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'asistencias', label: 'Asistencias' },
];

export default function NavTabs({ activeTab, onTabChange }) {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
