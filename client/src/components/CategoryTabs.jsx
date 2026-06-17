export default function CategoryTabs({ categorias = [], activeCat, onChange }) {
  return (
    <div className="categories-bar">
      <button
        className={`cat-tab ${activeCat === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        Todos
      </button>
      {categorias.map(c => (
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
