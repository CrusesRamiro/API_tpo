export default function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      <div className="toast-dot" />
      <span>{message}</span>
    </div>
  )
}
