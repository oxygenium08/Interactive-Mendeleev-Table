import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';

interface Element {
  atomic_number: number;
  symbol: string;
  name: string;
  atomic_weight: number;
  group: number | null;
  period: number | null;
  category: string;
  electron_configuration: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const CATEGORY_COLORS: Record<string, string> = {
  'Alkali Metal': '#ff6666',
  'Alkaline Earth Metal': '#ffdead',
  'Lanthanide': '#ffbfff',
  'Actinide': '#ff99cc',
  'Transition Metal': '#ffc0c0',
  'Post-transition Metal': '#cccccc',
  'Metalloid': '#cccc99',
  'Nonmetal': '#b3e3b5',
  'Halogen': '#ffff99',
  'Noble Gas': '#b2ffff',
  'Unknown': '#e0e0e0',
};

const PERIODS = 7;
const GROUPS = 18;

function App() {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Element | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/elements/`)
      .then(res => {
        setElements(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch elements');
        setLoading(false);
      });
  }, []);

  // Prepare grid: periods x groups
  const grid: (Element | null)[][] = Array.from({ length: PERIODS }, () => Array(GROUPS).fill(null));
  const lanthanides: Element[] = [];
  const actinides: Element[] = [];

  elements.forEach(el => {
    if (el.category === 'Lanthanide') {
      lanthanides.push(el);
    } else if (el.category === 'Actinide') {
      actinides.push(el);
    } else if (el.period && el.group) {
      grid[el.period - 1][el.group - 1] = el;
    }
  });

  // Sort lanthanides and actinides by atomic number
  lanthanides.sort((a, b) => a.atomic_number - b.atomic_number);
  actinides.sort((a, b) => a.atomic_number - b.atomic_number);

  // Helper for color
  const getColor = (category: string) => CATEGORY_COLORS[category] || '#e0e0e0';

  const openModal = (el: Element) => {
    setSelected(el);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

  return (
    <div className="App">
      <div className="background-gradient" />
      <h1>Interactive Mendeleev Table</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="legend">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="legend-item" style={{ background: color }}>{cat}</span>
        ))}
      </div>
      <div className="ptable-grid">
        {/* Group (column) labels */}
        <div className="ptable-row ptable-header-row">
          <div className="ptable-corner" />
          {Array.from({ length: GROUPS }, (_, i) => (
            <div className="ptable-header" key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Table rows with period (row) labels */}
        {grid.map((row, periodIdx) => (
          <div className="ptable-row" key={periodIdx}>
            <div className="ptable-period-label">{periodIdx + 1}</div>
            {row.map((el, groupIdx) => (
              <div className="ptable-cell" key={groupIdx}>
                {el && (
                  <div
                    className="element-card"
                    style={{ background: getColor(el.category) }}
                    title={el.name}
                    onClick={() => openModal(el)}
                  >
                    <div className="symbol">{el.symbol}</div>
                    <div className="atomic-number">{el.atomic_number}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ptable-row lanthanides-row">
        <span className="row-label">57-71</span>
        {lanthanides.map(el => (
          <div
            className="element-card"
            key={el.atomic_number}
            style={{ background: getColor(el.category) }}
            title={el.name}
            onClick={() => openModal(el)}
          >
            <div className="symbol">{el.symbol}</div>
            <div className="atomic-number">{el.atomic_number}</div>
          </div>
        ))}
      </div>
      <div className="ptable-row actinides-row">
        <span className="row-label">89-103</span>
        {actinides.map(el => (
          <div
            className="element-card"
            key={el.atomic_number}
            style={{ background: getColor(el.category) }}
            title={el.name}
            onClick={() => openModal(el)}
          >
            <div className="symbol">{el.symbol}</div>
            <div className="atomic-number">{el.atomic_number}</div>
          </div>
        ))}
      </div>
      {modalOpen && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-symbol" style={{ background: getColor(selected.category) }}>{selected.symbol}</div>
            <div className="modal-title">{selected.name} <span className="modal-atomic-number">({selected.atomic_number})</span></div>
            <div className="modal-details">
              <div><b>Category:</b> {selected.category}</div>
              <div><b>Atomic Weight:</b> {selected.atomic_weight}</div>
              <div><b>Group:</b> {selected.group}</div>
              <div><b>Period:</b> {selected.period}</div>
              <div><b>Electron Configuration:</b> <span className="mono">{selected.electron_configuration}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
