import React, { useState } from 'react';
import { useApp } from './AppContext.jsx';

export default function OwnerDashboard() {
  const { state, dispatch } = useApp();
  const [reason, setReason] = useState('');

  return (
    <div className="owner-box" style={{ border: '3px solid #CE1126', padding: '20px', borderRadius: '8px', background: '#fff' }}>
      <h2 style={{ color: '#CE1126', marginTop: 0 }}>🛡️ Panel de Control del Owner</h2>
      <p>Moderar la autenticidad de TakerTomador.</p>

      <h3>Reportes de Usuarios Realizados ({state.reports.length})</h3>
      {state.reports.map(r => (
        <div key={r.id} style={{ background: '#f9f9f9', padding: '10px', margin: '10px 0', borderLeft: '4px solid #0A3161' }}>
          <p><strong>Producto:</strong> {r.productName} | <strong>Vendedor:</strong> {r.seller}</p>
          <button onClick={() => dispatch({ type: 'RESOLVE_REPORT', payload: r.id })}>Descartar Reporte</button>
        </div>
      ))}

      <h3>Lista de Productos en el Sistema ({state.products.length})</h3>
      {state.products.map(p => (
        <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
          <p><strong>{p.name}</strong> - Por: {p.sellerName}</p>
          <div style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
            <button onClick={() => { dispatch({ type: 'VERIFY_SELLER', payload: p.sellerName }); alert("Vendedor Verificado."); }} style={{ background: '#006847', color: '#fff' }}>Verificar Vendedor</button>
            <button onClick={() => { dispatch({ type: 'REMOVE_PRODUCT', payload: p.id }); alert("Producto removido."); }} style={{ background: '#CE1126', color: '#fff' }}>Remover Producto</button>
            <button onClick={() => { dispatch({ type: 'BAN_SELLER', payload: p.sellerName }); alert("Vendedor Baneado."); }} style={{ background: '#000', color: '#fff' }}>Banear Vendedor</button>
          </div>
          <div style={{ marginTop: '5px' }}>
            <input type="text" placeholder="Razón escrita de la advertencia..." value={reason} onChange={e => setReason(e.target.value)} style={{ padding: '6px', width: '70%' }} />
            <button onClick={() => { if(!reason) return alert("Escribe una razón"); dispatch({ type: 'WARN_SELLER', payload: { seller: p.sellerName, reason } }); alert("Advertencia enviada."); setReason(''); }} style={{ background: '#eed202', marginLeft: '5px' }}>Advertir</button>
          </div>
        </div>
      ))}
    </div>
  );
}
