export const CATEGORIES = [
  { id: 1, nombre: 'Rock', descripcion: 'Guitarras intensas y ritmo potente' },
  { id: 2, nombre: 'Pop', descripcion: 'Melodías pegadizas' },
  { id: 3, nombre: 'Clásica', descripcion: 'Composiciones elegantes' },
  { id: 4, nombre: 'Jazz', descripcion: 'Improvisación y estilo libre' },
]

export const PRODUCTS = [
  { id: 1, nombre: 'The Dark Side of the Moon', descripcion: 'Pink Floyd ‧ 1973', precio: 100000.00, stock: 8, categoriaId: 1, emoji: '💽', imagen: '/TheDarkSideoftheMoon.png', nuevo: true },
  { id: 2, nombre: 'Led Zeppelin IV', descripcion: 'Led Zeppelin ‧ 1971', precio: 100000.00, stock: 15, categoriaId: 1, emoji: '💽', imagen: '/LedZeppelinIV.jpg', nuevo: false },
  { id: 3, nombre: 'Nevermind', descripcion: 'Nirvana ‧ 1991', precio: 100000.00, stock: 12, categoriaId: 1, emoji: '💽', imagen: '/Nevermind.jpg', nuevo: true },
  { id: 4, nombre: 'Back In Black', descripcion: 'AC/DC ‧ 1980', precio: 100000.00, stock: 4, categoriaId: 1, emoji: '💽', imagen: '/BackinBlack.png', nuevo: false },
  { id: 5, nombre: 'Thriller', descripcion: 'Michael Jackson ‧ 1982', precio: 100000.00, stock: 50, categoriaId: 2, emoji: '💽', imagen: '/Thriller.png', nuevo: false },
  { id: 6, nombre: 'Future Nostalgia', descripcion: 'Dua Lipa ‧ 2020', precio: 100000.00, stock: 20, categoriaId: 2, emoji: '💽', imagen: '/FutureNostalgia.png', nuevo: true },
  { id: 7, nombre: 'The Four Seasons', descripcion: 'Antonio Vivaldi ‧ 1723', precio: 100000.00, stock: 30, categoriaId: 3, emoji: '💽', imagen: '/TheFourSeasons.jpg', nuevo: false },
  { id: 8, nombre: 'Symphony No. 9', descripcion: 'Ludwig van Beethoven ‧ 1824', precio: 100000.00, stock: 7, categoriaId: 3, emoji: '💽', imagen: '/SymphonyNo9.jpg', nuevo: false },
  { id: 9, nombre: 'Kind of Blue', descripcion: 'Miles Davis ‧ 1959', precio: 100000.00, stock: 25, categoriaId: 4, emoji: '💽', imagen: '/KindofBlue.jpg', nuevo: false },
  { id: 10, nombre: 'Time Out', descripcion: 'The Dave Brubeck Quartet ‧ 1959', precio: 100000.00, stock: 10, categoriaId: 4, emoji: '💽', imagen: '/TimeOut.jpg', nuevo: true },
]

export const ORDERS_MOCK = [
  {
    id: 1001, fecha: '2026-04-15', estado: 'ENTREGADO', total: 200000.00,
    detalle: [
      { item: { nombre: 'The Dark Side of the Moon', precio: 100000.00 }, cantidad: 1 },
      { item: { nombre: 'Kind of Blue', precio: 100000.00 }, cantidad: 1 },
    ],
  },
  {
    id: 1002, fecha: '2026-04-28', estado: 'ENVIADO', total: 100000.00,
    detalle: [{ item: { nombre: 'Back In Black', precio: 100000.00 }, cantidad: 1 }],
  },
  {
    id: 1003, fecha: '2026-05-02', estado: 'PENDIENTE', total: 300000.00,
    detalle: [
      { item: { nombre: 'Time Out', precio: 100000.00 }, cantidad: 2 },
      { item: { nombre: 'Future Nostalgia', precio: 100000.00 }, cantidad: 1 },
    ],
  },
]
