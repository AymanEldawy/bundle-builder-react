import './App.css';
import { BuilderColumn } from './features/bundle/components/BuilderColumn/BuilderColumn';
import { ReviewPanel } from './features/bundle/components/ReviewPanel/ReviewPanel';

function App() {
  return (
    <div className="app">
      <main className="app-layout">
        <BuilderColumn />
        <ReviewPanel />
      </main>
    </div>
  );
}

export default App;
