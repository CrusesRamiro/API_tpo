import { CATEGORIES } from '../data/mockData'

export default function CategoryFilter({ activeCat, onChange }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <span
        className={`tag ${activeCat === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        Todos
      </span>
      {CATEGORIES.map(c => (
        <span
          key={c.id}
          className={`tag ${activeCat === c.id ? 'active' : ''}`}
          onClick={() => onChange(c.id)}
        >
          {c.nombre}
        </span>
      ))}
    </div>
  )
}