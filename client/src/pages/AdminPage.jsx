import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, ORDERS_MOCK } from '../data/mockData'

const TABS = ['Productos', 'Categorías', 'Pedidos', 'Usuarios']

const USUARIOS_MOCK = [
  { id: 1, username: 'admin', nombre: 'Admin', apellido: 'Sistema', email: 'admin@resonica.com', rol: 'ROLE_ADMIN' },
  { id: 2, username: 'user1', nombre: 'Juan', apellido: 'Pérez', email: 'juan@mail.com', rol: 'ROLE_USER' },
  { id: 3, username: 'maria99', nombre: 'María', apellido: 'González', email: 'maria@mail.com', rol: 'ROLE_USER' },
]

export default function AdminPage({ showToast }) {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Productos')

  // ── PRODUCTOS ──
  const [productos, setProductos] = useState(PRODUCTS)
  const [editProd, setEditProd] = useState(null)
  const [nuevoProd, setNuevoProd] = useState(false)
  const [formProd, setFormProd] = useState({})
  const [fotosModal, setFotasModal] = useState(null) // id del producto con modal abierto
  const [fotasMock, setFotosMock] = useState({}) // { [productoId]: [base64, ...] }

  // ── CATEGORÍAS ──
  const [categorias, setCategorias] = useState(CATEGORIES)
  const [editCat, setEditCat] = useState(null)
  const [nuevaCat, setNuevaCat] = useState(false)
  const [formCat, setFormCat] = useState({})

  // ── PEDIDOS ──
  const [pedidos, setPedidos] = useState(ORDERS_MOCK)
  const [buscarIdPedido, setBuscarIdPedido] = useState('')
  const [pedidoEncontrado, setPedidoEncontrado] = useState(null)
  const [detallePedido, setDetallePedido] = useState(null)

  // ── USUARIOS ──
  const [usuarios, setUsuarios] = useState(USUARIOS_MOCK)
  const [editUser, setEditUser] = useState(null)
  const [formUser, setFormUser] = useState({})

  if (!isLoggedIn || user?.rol !== 'ROLE_ADMIN') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ color: 'var(--text3)', marginBottom: '1rem' }}>Acceso restringido a administradores.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    )
  }

  function estadoColor(estado) {
    const map = { PENDIENTE: '#fef3c7', CONFIRMADO: '#dbeafe', ENVIADO: '#ede9fe', ENTREGADO: '#d1fae5', CANCELADO: '#fee2e2' }
    return map[estado] || '#f4f4f0'
  }
  function estadoText(estado) {
    const map = { PENDIENTE: '#92400e', CONFIRMADO: '#1e40af', ENVIADO: '#5b21b6', ENTREGADO: '#065f46', CANCELADO: '#991b1b' }
    return map[estado] || '#333'
  }

  function buscarPedido() {
    const id = Number(buscarIdPedido)
    const encontrado = pedidos.find(p => p.id === id)
    if (encontrado) {
      setPedidoEncontrado(encontrado)
    } else {
      showToast('Pedido no encontrado')
      setPedidoEncontrado(null)
    }
  }

  function handleFotoUpload(productoId, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setFotosMock(prev => ({
        ...prev,
        [productoId]: [...(prev[productoId] || []), ev.target.result]
      }))
      showToast('Foto subida correctamente')
    }
    reader.readAsDataURL(file)
  }

  const thStyle = { padding: '0.75rem 0.5rem', color: 'var(--text3)', fontWeight: 500, textAlign: 'left' }
  const tdStyle = { padding: '0.75rem 0.5rem' }

  return (
    <>
      <div className="page-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.username}</p>
      </div>

      <div className="categories-bar" style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 50 }}>
        {TABS.map(t => (
          <button key={t} className={`cat-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="section">

        {/* ══ PRODUCTOS ══ */}
        {tab === 'Productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}
                onClick={() => { setFormProd({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: 1, descuento: 0 }); setNuevoProd(true); setEditProd(null) }}>
                + Nuevo producto
              </button>
            </div>

            {/* FORM NUEVO / EDITAR */}
            {(nuevoProd || editProd) && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
                {nuevoProd ? 'Nuevo producto' : 'Editar producto'}
                </h3>
                <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={formProd.nombre || ''} onChange={e => setFormProd(f => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={formProd.categoriaId || 1} onChange={e => setFormProd(f => ({ ...f, categoriaId: Number(e.target.value) }))}>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>
                </div>
                <div className="form-group">
                <label className="form-label">Descripción</label>
                <input className="form-input" value={formProd.descripcion || ''} onChange={e => setFormProd(f => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Precio</label>
                    <input className="form-input" type="number" value={formProd.precio || ''} onChange={e => setFormProd(f => ({ ...f, precio: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" value={formProd.stock || ''} onChange={e => setFormProd(f => ({ ...f, stock: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Descuento %</label>
                    <input className="form-input" type="number" min="0" max="100" value={formProd.descuento || 0} onChange={e => setFormProd(f => ({ ...f, descuento: Number(e.target.value) }))} />
                </div>
                </div>

    {/* ── FOTOS (solo en editar, no en nuevo) ── */}
    {(
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Fotos del producto</label>

        {/* FOTOS EXISTENTES */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {(fotasMock[editProd] || []).length === 0 && (
            <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>No hay fotos cargadas.</p>
          )}
          {(fotasMock[editProd] || []).map((src, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={src} alt={`foto-${i}`} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              <button
                onClick={() => setFotosMock(prev => ({ ...prev, [editProd]: prev[editProd].filter((_, j) => j !== i) }))}
                style={{ position: 'absolute', top: '4px', right: '4px', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SUBIR FOTO */}
        <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }}
          onChange={e => handleFotoUpload(editProd, e)} />
      </div>
    )}

    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
      <button className="form-submit" onClick={() => {
        if (nuevoProd) {
          setProductos(prev => [...prev, { ...formProd, id: Date.now(), emoji: '💽', nuevo: false }])
          showToast('Producto creado')
        } else {
          setProductos(prev => prev.map(p => p.id === editProd ? { ...p, ...formProd } : p))
          showToast('Producto actualizado')
        }
        setEditProd(null); setNuevoProd(false)
      }}>Guardar</button>
      <button className="form-submit" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
        onClick={() => { setEditProd(null); setNuevoProd(false) }}>Cancelar</button>
    </div>
  </div>
)}

            {/* MODAL FOTOS */}
            {fotosModal && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)' }}>
                    Fotos — {productos.find(p => p.id === fotosModal)?.nombre}
                  </h3>
                  <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text3)' }}
                    onClick={() => setFotasModal(null)}>✕</button>
                </div>

                {/* FOTOS EXISTENTES */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {(fotasMock[fotosModal] || []).length === 0 && (
                    <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No hay fotos cargadas.</p>
                  )}
                  {(fotasMock[fotosModal] || []).map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt={`foto-${i}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                      <button
                        onClick={() => setFotosMock(prev => ({ ...prev, [fotosModal]: prev[fotosModal].filter((_, j) => j !== i) }))}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SUBIR FOTO */}
                <div>
                  <label className="form-label">Subir nueva foto</label>
                  <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }}
                    onChange={e => handleFotoUpload(fotosModal, e)} />
                </div>
              </div>
            )}

            {/* TABLA */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Desc.</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{p.nombre}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{categorias.find(c => c.id === p.categoriaId)?.nombre}</td>
                    <td style={tdStyle}>${p.precio.toLocaleString('es-AR')}</td>
                    <td style={tdStyle}>{p.stock}</td>
                    <td style={tdStyle}>
                      {p.descuento > 0
                        ? <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem' }}>{p.descuento}%</span>
                        : '—'}
                    </td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                        onClick={() => { setFormProd({ ...p }); setEditProd(p.id); setNuevoProd(false) }}>
                        Editar
                      </button>
                      <button style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#991b1b' }}
                        onClick={() => { setProductos(prev => prev.filter(x => x.id !== p.id)); showToast('Producto eliminado') }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ CATEGORÍAS ══ */}
        {tab === 'Categorías' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}
                onClick={() => { setFormCat({ nombre: '', descripcion: '' }); setNuevaCat(true); setEditCat(null) }}>
                + Nueva categoría
              </button>
            </div>

            {(nuevaCat || editCat) && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
                  {nuevaCat ? 'Nueva categoría' : 'Editar categoría'}
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={formCat.nombre || ''} onChange={e => setFormCat(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input className="form-input" value={formCat.descripcion || ''} onChange={e => setFormCat(f => ({ ...f, descripcion: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="form-submit" onClick={() => {
                    if (nuevaCat) {
                      setCategorias(prev => [...prev, { ...formCat, id: Date.now() }])
                      showToast('Categoría creada')
                    } else {
                      setCategorias(prev => prev.map(c => c.id === editCat ? { ...c, ...formCat } : c))
                      showToast('Categoría actualizada')
                    }
                    setEditCat(null); setNuevaCat(false)
                  }}>Guardar</button>
                  <button className="form-submit" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                    onClick={() => { setEditCat(null); setNuevaCat(false) }}>Cancelar</button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{c.nombre}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{c.descripcion}</td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                        onClick={() => { setFormCat({ ...c }); setEditCat(c.id); setNuevaCat(false) }}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ PEDIDOS ══ */}
        {tab === 'Pedidos' && (
          <div>
            {/* BUSCAR POR ID */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <input
                className="form-input"
                placeholder="Buscar por ID de pedido..."
                style={{ maxWidth: '280px' }}
                value={buscarIdPedido}
                onChange={e => { setBuscarIdPedido(e.target.value); if (!e.target.value) setPedidoEncontrado(null) }}
                onKeyDown={e => e.key === 'Enter' && buscarPedido()}
              />
              <button className="form-submit" style={{ padding: '0.75rem 1.25rem' }} onClick={buscarPedido}>
                Buscar
              </button>
              {pedidoEncontrado && (
                <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
                  onClick={() => { setPedidoEncontrado(null); setBuscarIdPedido('') }}>
                  ✕ Limpiar
                </button>
              )}
            </div>

            {/* RESULTADO BÚSQUEDA */}
            {pedidoEncontrado && (
              <div style={{ background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>Pedido #{pedidoEncontrado.id}</span>
                    <span style={{ color: 'var(--text3)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{pedidoEncontrado.fecha}</span>
                  </div>
                  <span style={{ background: estadoColor(pedidoEncontrado.estado), color: estadoText(pedidoEncontrado.estado), padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500 }}>
                    {pedidoEncontrado.estado}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.5rem' }}>Detalle del pedido:</p>
                  {pedidoEncontrado.detalle.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', color: 'var(--text2)' }}>
                      <span>{d.item.nombre} × {d.cantidad}</span>
                      <span>${(d.item.precio * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                    <span>Total</span>
                    <span>${pedidoEncontrado.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TABLA PEDIDOS */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Detalle</th>
                  <th style={thStyle}>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <>
                    <tr key={p.id} style={{ borderBottom: detallePedido === p.id ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>#{p.id}</td>
                      <td style={{ ...tdStyle, color: 'var(--text2)' }}>{p.fecha}</td>
                      <td style={tdStyle}>${p.total.toLocaleString('es-AR')}</td>
                      <td style={tdStyle}>
                        <span style={{ background: estadoColor(p.estado), color: estadoText(p.estado), padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500 }}>
                          {p.estado}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                          onClick={() => setDetallePedido(detallePedido === p.id ? null : p.id)}>
                          {detallePedido === p.id ? 'Ocultar' : 'Ver detalle'}
                        </button>
                      </td>
                      <td style={tdStyle}>
                        <select className="form-select" style={{ width: 'auto', fontSize: '0.82rem', padding: '0.35rem 0.5rem' }}
                          value={p.estado}
                          onChange={e => {
                            setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, estado: e.target.value } : x))
                            showToast(`Pedido #${p.id} → ${e.target.value}`)
                          }}>
                          {['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {detallePedido === p.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0 0.5rem 0.75rem', background: 'var(--surface2)' }}>
                          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.5rem' }}>Items del pedido:</p>
                            {p.detalle.map((d, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>
                                <span>{d.item.nombre} × {d.cantidad}</span>
                                <span>${(d.item.precio * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, paddingTop: '0.5rem', fontSize: '0.9rem' }}>
                              <span>Total</span>
                              <span>${p.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ USUARIOS ══ */}
        {tab === 'Usuarios' && (
          <div>
            {editUser && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Editar usuario</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={formUser.nombre || ''} onChange={e => setFormUser(f => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input className="form-input" value={formUser.apellido || ''} onChange={e => setFormUser(f => ({ ...f, apellido: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={formUser.email || ''} onChange={e => setFormUser(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="form-submit" onClick={() => {
                    setUsuarios(prev => prev.map(u => u.id === editUser ? { ...u, ...formUser } : u))
                    showToast('Usuario actualizado')
                    setEditUser(null)
                  }}>Guardar</button>
                  <button className="form-submit" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                    onClick={() => setEditUser(null)}>Cancelar</button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rol</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{u.username}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{u.nombre} {u.apellido}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: u.rol === 'ROLE_ADMIN' ? '#dbeafe' : '#e8e8f0',
                        color: u.rol === 'ROLE_ADMIN' ? '#1e40af' : '#1a1a2e',
                        padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500
                      }}>{u.rol}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                        onClick={() => { setFormUser({ ...u }); setEditUser(u.id) }}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  )
}