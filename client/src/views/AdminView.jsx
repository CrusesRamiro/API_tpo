import { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsLoggedIn } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import {
  fetchProductos,
  addProducto,
  editProducto,
  removeProducto,
  selectProductos,
} from '../store/productosSlice'
import {
  fetchCategorias,
  addCategoria,
  editCategoria,
  selectCategorias,
} from '../store/categoriasSlice'
import {
  fetchAllPedidos,
  changeEstadoPedido,
  selectPedidos,
} from '../store/pedidosSlice'
import { fetchUsuarios, selectUsuarios } from '../store/usuariosSlice'

const TABS = ['Productos', 'Categorías', 'Pedidos', 'Usuarios']

export default function AdminView({ showToast }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Datos: TODO viene del estado global (Redux), nada de useState local de datos.
  const productos = useSelector(selectProductos)
  const categorias = useSelector(selectCategorias)
  const pedidos = useSelector(selectPedidos)
  const usuarios = useSelector(selectUsuarios)

  // Estado de UI (qué pestaña, qué formulario está abierto, valores de inputs).
  const [tab, setTab] = useState('Productos')

  const [editProd, setEditProd] = useState(null)
  const [nuevoProd, setNuevoProd] = useState(false)
  const [formProd, setFormProd] = useState({})

  const [editCat, setEditCat] = useState(null)
  const [nuevaCat, setNuevaCat] = useState(false)
  const [formCat, setFormCat] = useState({})

  const [detallePedido, setDetallePedido] = useState(null)
  const [buscarIdPedido, setBuscarIdPedido] = useState('')
  const [pedidoEncontrado, setPedidoEncontrado] = useState(null)

  // Carga inicial: disparamos los thunks. Las llamadas viven en Redux, no acá.
  useEffect(() => {
    if (!isLoggedIn || user?.rol !== 'ROLE_ADMIN') return
    dispatch(fetchProductos())
    dispatch(fetchCategorias())
    dispatch(fetchAllPedidos())
    dispatch(fetchUsuarios())
  }, [dispatch, isLoggedIn, user])

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
    const encontrado = pedidos.find((p) => p.id === id)
    if (encontrado) setPedidoEncontrado(encontrado)
    else { showToast('Pedido no encontrado'); setPedidoEncontrado(null) }
  }

  // --- Handlers: solo despachan thunks. Sin try/catch ni .then/.catch.
  // El resultado se refleja en las tablas (estado global) y los errores los
  // muestra el errorMiddleware centralizado.
  function handleGuardarProducto() {
    const data = {
      nombre: formProd.nombre,
      descripcion: formProd.descripcion,
      precio: Number(formProd.precio),
      stock: Number(formProd.stock),
      categoriaId: Number(formProd.categoriaId),
    }
    if (editProd) dispatch(editProducto({ id: editProd, data }))
    else dispatch(addProducto(data))
    setEditProd(null)
    setNuevoProd(false)
  }

  function handleEliminarProducto(id) {
    dispatch(removeProducto(id))
  }

  function handleGuardarCategoria() {
    const data = { nombre: formCat.nombre, descripcion: formCat.descripcion }
    if (editCat) dispatch(editCategoria({ id: editCat, data }))
    else dispatch(addCategoria(data))
    setEditCat(null)
    setNuevaCat(false)
  }

  function handleCambiarEstado(pedidoId, estado) {
    dispatch(changeEstadoPedido({ id: pedidoId, estado }))
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
        {TABS.map((t) => (
          <button key={t} className={`cat-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section">

        {/* PRODUCTOS */}
        {tab === 'Productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}
                onClick={() => { setFormProd({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: categorias[0]?.id || 1 }); setNuevoProd(true); setEditProd(null) }}>
                + Nuevo producto
              </button>
            </div>

            {(nuevoProd || editProd) && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
                  {nuevoProd ? 'Nuevo producto' : 'Editar producto'}
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={formProd.nombre || ''} onChange={(e) => setFormProd((f) => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={formProd.categoriaId || ''} onChange={(e) => setFormProd((f) => ({ ...f, categoriaId: Number(e.target.value) }))}>
                      {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <input className="form-input" value={formProd.descripcion || ''} onChange={(e) => setFormProd((f) => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Precio</label>
                    <input className="form-input" type="number" value={formProd.precio || ''} onChange={(e) => setFormProd((f) => ({ ...f, precio: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" value={formProd.stock || ''} onChange={(e) => setFormProd((f) => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button className="form-submit" onClick={handleGuardarProducto}>Guardar</button>
                  <button className="form-submit" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                    onClick={() => { setEditProd(null); setNuevoProd(false) }}>Cancelar</button>
                </div>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{p.nombre}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{p.categoria?.nombre}</td>
                    <td style={tdStyle}>${p.precio.toLocaleString('es-AR')}</td>
                    <td style={tdStyle}>{p.stock}</td>
                    <td style={{ ...tdStyle, display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                        onClick={() => { setFormProd({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoriaId: p.categoria?.id }); setEditProd(p.id); setNuevoProd(false) }}>
                        Editar
                      </button>
                      <button style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#991b1b' }}
                        onClick={() => handleEliminarProducto(p.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CATEGORÍAS */}
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
                    <input className="form-input" value={formCat.nombre || ''} onChange={(e) => setFormCat((f) => ({ ...f, nombre: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input className="form-input" value={formCat.descripcion || ''} onChange={(e) => setFormCat((f) => ({ ...f, descripcion: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="form-submit" onClick={handleGuardarCategoria}>Guardar</button>
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
                {categorias.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{c.nombre}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{c.descripcion}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button style={{ background: '#e8e8f0', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', color: '#1a1a2e' }}
                        onClick={() => { setFormCat({ nombre: c.nombre, descripcion: c.descripcion }); setEditCat(c.id); setNuevaCat(false) }}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PEDIDOS */}
        {tab === 'Pedidos' && (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <input className="form-input" placeholder="Buscar por ID de pedido..." style={{ maxWidth: '280px' }}
                value={buscarIdPedido}
                onChange={(e) => { setBuscarIdPedido(e.target.value); if (!e.target.value) setPedidoEncontrado(null) }}
                onKeyDown={(e) => e.key === 'Enter' && buscarPedido()} />
              <button className="form-submit" style={{ padding: '0.75rem 1.25rem' }} onClick={buscarPedido}>Buscar</button>
              {pedidoEncontrado && (
                <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}
                  onClick={() => { setPedidoEncontrado(null); setBuscarIdPedido('') }}>✕ Limpiar</button>
              )}
            </div>

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
                  {pedidoEncontrado.detalle?.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', color: 'var(--text2)' }}>
                      <span>{d.item.nombre} × {d.cantidad}</span>
                      <span>${(d.precioUnidad * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                    <span>Total</span>
                    <span>${pedidoEncontrado.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            )}

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
                {pedidos.map((p) => (
                  <Fragment key={p.id}>
                    <tr style={{ borderBottom: detallePedido === p.id ? 'none' : '1px solid var(--border)' }}>
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
                          onChange={(e) => handleCambiarEstado(p.id, e.target.value)}>
                          {['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {detallePedido === p.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: '0 0.5rem 0.75rem', background: 'var(--surface2)' }}>
                          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
                            {p.detalle?.map((d, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>
                                <span>{d.item.nombre} × {d.cantidad}</span>
                                <span>${(d.precioUnidad * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
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
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USUARIOS (solo lectura: el backend expone GET /usuarios) */}
        {tab === 'Usuarios' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{u.username}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{u.nombre} {u.apellido}</td>
                    <td style={{ ...tdStyle, color: 'var(--text2)' }}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{ background: u.rol?.nombre === 'ROLE_ADMIN' ? '#dbeafe' : '#e8e8f0', color: u.rol?.nombre === 'ROLE_ADMIN' ? '#1e40af' : '#1a1a2e', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 500 }}>
                        {u.rol?.nombre}
                      </span>
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