import { CATEGORIES } from '../data/mockData'

export default function CategoryTabs({ activeCat, onChange }) {
  return (
    <div className="categories-bar">
      <button
        className={`cat-tab ${activeCat === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        Todos
      </button>
      {CATEGORIES.map(c => (
        <button
          key={c.id}
          className={`cat-tab ${activeCat === c.id ? 'active' : ''}`}
          onClick={() => onChange(c.id)}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  )
}