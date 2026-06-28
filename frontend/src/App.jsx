import { useState } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import PlanView from './components/PlanView';
import MembresiaView from './components/MembresiaView';
import UsuarioView from './components/UsuarioView';
import AsistenciaView from './components/AsistenciaView';
import HistoryPanel from './components/HistoryPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('planes');
  const [historyOpen, setHistoryOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'planes': return <PlanView />;
      case 'membresias': return <MembresiaView />;
      case 'usuarios': return <UsuarioView />;
      case 'asistencias': return <AsistenciaView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onHistoryOpen={() => setHistoryOpen(true)} />
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {renderContent()}
      </main>

      {/* Panel de historial deslizante */}
      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
