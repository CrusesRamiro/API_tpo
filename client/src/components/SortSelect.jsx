const OPCIONES = [
  { value: 'default', label: 'Ordenar por…' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A–Z' },
]

export default function SortSelect({ value, onChange }) {
  return (
    <select
      className="form-select"
      style={{ width: 'auto', minWidth: '180px' }}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {OPCIONES.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}