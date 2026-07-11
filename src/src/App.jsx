import React, { useState } from 'react';
import { useApp, REGIONS } from './AppContext.jsx';
import OwnerDashboard from './OwnerDashboard.jsx';

export default function App() {
  const { state, dispatch } = useApp();
  const { currentRegion, activeTab, products } = state;

  return (
    <div className="app-container" style={{ '--primary-color': currentRegion.colors[0] }}>
      <header className="main-header">
        <div className="header-top">
          <h1>TakerTomador</h1>
          <span className="domain-badge">{currentRegion.domain}</span>
          <p className="slogan">{currentRegion.lang === 'es' ? '"Toma lo que quieras, Tomador."' : '"Take what you want, Taker."'}</p>
          <select value={Object.keys(REGIONS).find(k => REGIONS[k].domain === currentRegion.domain)} onChange={(e) => dispatch({ type: 'SET_REGION', payload: REGIONS[e.target.value] })}>
            <option value="MX">México</option>
            <option value="US">USA</option>
            <option value="CA">Canadá</option>
            <option value="GLOBAL">Global</option>
          </select>
        </div>
        <nav className="nav-bar">
          <button className={activeTab === 'marketplace' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_TAB', payload: 'marketplace' })}>Marketplace</button>
          <button className={activeTab === 'seller' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_TAB', payload: 'seller' })}>Vender</button>
          <button className={activeTab === 'owner' ? 'active' : ''} onClick={() => dispatch({ type: 'SET_TAB', payload: 'owner' })}>Owner</button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'marketplace' && <MarketplaceGrid products={products} />}
        {activeTab === 'seller' && <SellerForm />}
        {activeTab === 'owner' && <OwnerDashboard />}
      </main>
    </div>
  );
}

function MarketplaceGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2>El marketplace está completamente vacío</h2>
        <p>Aquí no verás bots, productos artificiales ni reseñas infladas. Todo el contenido es 100% creado por usuarios reales.</p>
      </div>
    );
  }
  return (
    <div className="products-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

function ProductCard({ product }) {
  const { state, dispatch } = useApp();
  const [imgIndex, setImgIndex] = useState(0);
  const [showPay, setShowPay] = useState(false);
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState('card');

  const photos = product.photos && product.photos.length > 0 ? product.photos : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'];
  const isVerified = state.verifiedSellers.includes(product.sellerName);

  const handleBuy = (e) => {
    e.preventDefault();
    if (payMethod === 'cod' && !address) return alert("Escribe una dirección válida.");
    
    alert(payMethod === 'cod' ? "¡Pedido confirmado! El repartidor contratado validará que el artículo funcione antes de recibir tu dinero." : "Pago con tarjeta procesado.");
    
    dispatch({
      type: 'ADD_PRODUCT',
      payload: { ...product, status: 'sold' }
    });
    dispatch({ type: 'REMOVE_PRODUCT', payload: product.id });
    setShowPay(false);
  };

  return (
    <div className="product-card">
      <div className="image-container">
        {product.verti && <span className="verti-tag">⚡ VERTI</span>}
        <img src={photos[imgIndex]} alt={product.name} />
        {photos.length > 1 && (
          <div className="carousel-controls">
            <button onClick={() => setImgIndex((imgIndex - 1 + photos.length) % photos.length)}>&lt;</button>
            <button onClick={() => setImgIndex((imgIndex + 1) % photos.length)}>&gt;</button>
          </div>
        )}
      </div>
      <div className="p-details">
        <h3>${product.price}</h3>
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        <p className="seller-info">Vendedor: {product.sellerName} {isVerified && '🛡️ Verificado'}</p>
        <div className="footer-row">
          <span>📍 {product.country}</span>
          {product.status === 'available' ? (
            <button className="btn-buy" onClick={() => setShowPay(true)}>Comprar</button>
          ) : (
            <span className="sold-badge">{state.currentRegion.soldText}</span>
          )}
        </div>
        <button className="btn-report" onClick={() => dispatch({ type: 'ADD_REPORT', payload: { id: Date.now(), productName: product.name, seller: product.sellerName } })}>⚠️ Reportar producto</button>
      </div>

      {showPay && (
        <div className="modal">
          <div className="modal-content">
            <h3>Checkout TakerTomador</h3>
            <select value={payMethod} onChange={e => setPayMethod(e.target.value)}>
              <option value="card">Tarjeta bancaria</option>
              <option value="cod">Pago contra entrega (Efectivo)</option>
            </select>
            {payMethod === 'cod' && <textarea placeholder="Dirección exacta para el repartidor..." value={address} onChange={e => setAddress(e.target.value)} required />}
            <button onClick={handleBuy}>Confirmar Compra</button>
            <button onClick={() => setShowPay(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SellerForm() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState('');
  const [verti, setVerti] = useState(false);

  const handlePublish = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_PRODUCT',
      payload: { id: Date.now(), name, price, description: desc, photos: photo ? [photo] : [], country: state.currentRegion.name, internationalShipping: 'Sí', sellerName: 'UserReal_' + Math.floor(Math.random() * 100), status: 'available', verti }
    });
    alert("Publicado con éxito.");
    setName(''); setPrice(''); setDesc(''); setPhoto(''); setVerti(false);
  };

  return (
    <form onSubmit={handlePublish} className="seller-form">
      <h2>Publica un Producto Real</h2>
      <input type="text" placeholder="Nombre del artículo" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} required />
      <textarea placeholder="Descripción del producto..." value={desc} onChange={e => setDesc(e.target.value)} required />
      <input type="url" placeholder="URL de la imagen del producto" value={photo} onChange={e => setPhoto(e.target.value)} />
      <label><input type="checkbox" checked={verti} onChange={e => setVerti(e.target.checked)} /> Activar Garantía y Entrega Rápida **VERTI**</label>
      <button type="submit">Lanzar Publicación</button>
    </form>
  );
}
