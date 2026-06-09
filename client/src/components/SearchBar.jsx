export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <input
      className="form-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}