'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from './lib/supabase';

const WA_NUMBER = '5531973493390';
const INSTAGRAM = 'vizani.semijoias';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  foto_url: string;
  preco: string;
  descricao: string;
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');
  const [modal, setModal] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) console.error(error);
      else setProdutos(data || []);
      setCarregando(false);
    }
    carregarProdutos();
  }, []);

  const lista = produtos.filter(p => {
    const matchFiltro = filtro === 'todos' || p.categoria === filtro;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  function abrirWA(nome: string) {
    const msg = encodeURIComponent(`Olá! Tenho interesse em: ${nome}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  }

  const svgIG = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#C4952A">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  const svgWA = (size = 20, color = '#25D366') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.09 1.503 5.816L0 24l6.334-1.482C8.023 23.446 9.968 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.624-.5-5.13-1.375l-.367-.218-3.761.88.918-3.66-.24-.378C2.544 15.638 2 13.875 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );

  return (
    <>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8d5a3', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(139,105,20,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px' }}>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#C4952A' }}>
            {svgIG}
            <span style={{ fontSize: 12, fontWeight: 500 }}>@{INSTAGRAM}</span>
          </a>
          <img src="/logo.png" alt="Vizani" style={{ height: 80, width: 'auto' }} />
          <a onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, '_blank')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#25D366', cursor: 'pointer' }}>
            {svgWA(20)}
            <span style={{ fontSize: 12, fontWeight: 500 }}>Contato</span>
          </a>
        </div>
        <div style={{ background: 'linear-gradient(90deg,#8B6914,#C4952A,#8B6914)', height: 2 }} />
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#fdf6e3 0%,#f5e9c4 60%,#faf9f7 100%)', padding: '48px 24px 36px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: '#C4952A', textTransform: 'uppercase', marginBottom: 10 }}>Coleção Exclusiva</p>
        <h1 style={{ color: '#8B6914', letterSpacing: 4, fontWeight: 300, fontSize: 32, marginBottom: 10 }}>Elegância em Detalhes</h1>
        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#C4952A,transparent)', margin: '0 auto 14px' }} />
        <p style={{ color: '#A07828', fontStyle: 'italic', fontSize: 14 }}>Semijoias banhadas a ouro • Qualidade premium</p>
      </div>

      {/* Busca e filtro */}
      <div style={{ background: '#fff', borderTop: '1px solid #e8d5a3', borderBottom: '1px solid #e8d5a3', padding: '16px 24px', position: 'sticky', top: 102, zIndex: 99 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4952A', fontSize: 16 }}>🔍︎</span>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e8d5a3', borderRadius: 8, fontSize: 14, color: '#3d3020', outline: 'none', background: '#fdf6e3' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ key: 'todos', label: 'Todos' }, { key: 'brinco', label: '✦ Brincos' }, { key: 'pulseira', label: '✦ Pulseiras' }].map(({ key, label }) => (
              <button key={key} onClick={() => setFiltro(key)} style={{ padding: '8px 16px', borderRadius: 8, border: filtro === key ? '1px solid #8B6914' : '1px solid #e8d5a3', background: filtro === key ? '#8B6914' : '#fff', color: filtro === key ? '#fff' : '#8B6914', fontSize: 13, cursor: 'pointer', fontWeight: filtro === key ? 600 : 400, transition: 'all .2s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contagem */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 4px' }}>
        <p style={{ fontSize: 12, color: '#A07828', letterSpacing: 1 }}>
          {carregando ? 'Carregando...' : `${lista.length} ${lista.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 24px 48px' }}>
        {carregando ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#A07828' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>💎</p>
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <div className="row g-3">
            {lista.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#A07828' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>💎</p>
                <p>Nenhum produto encontrado.</p>
              </div>
            ) : lista.map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <div
                  style={{ background: '#fff', border: '1px solid #e8d5a3', borderRadius: 14, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform .2s, box-shadow .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(139,105,20,0.13)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1', background: '#fdf6e3', overflow: 'hidden' }}>
                    <Image src={p.foto_url} alt={p.nome} fill style={{ objectFit: 'cover' }} unoptimized />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.92)', color: '#8B6914', border: '1px solid #e8d5a3', borderRadius: 20, fontSize: 10, letterSpacing: 1.5, padding: '3px 10px', textTransform: 'uppercase', fontWeight: 600 }}>
                      {p.categoria}
                    </span>
                  </div>
                  <div style={{ padding: '14px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h6 style={{ color: '#3d3020', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.nome}</h6>
                    <p style={{ color: '#8B6914', fontSize: 19, fontWeight: 700, marginBottom: 12, marginTop: 'auto' }}>{p.preco}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button onClick={() => setModal(p)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #C4952A', background: '#fff', color: '#8B6914', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        Ver Detalhes
                      </button>
                      <button onClick={() => abrirWA(p.nome)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: '#25D366', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        {svgWA(13, 'white')} WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: '#fdf6e3', borderTop: '1px solid #e8d5a3', padding: '32px 24px', textAlign: 'center' }}>
        <img src="/logo.png" alt="Vizani" style={{ height: 50, width: 'auto', marginBottom: 16, opacity: 0.85 }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#8B6914', fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C4952A"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            @{INSTAGRAM}
          </a>
          <a onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#8B6914', fontSize: 13, cursor: 'pointer' }}>
            {svgWA(16, '#25D366')} WhatsApp
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#A07828', letterSpacing: 1 }}>© 2025 Vizani Semijoias • Todos os direitos reservados</p>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 420, border: '1px solid #e8d5a3', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ position: 'relative', width: '100%', height: 280, background: '#fdf6e3', flexShrink: 0 }}>
              <Image src={modal.foto_url} alt={modal.nome} fill style={{ objectFit: 'contain' }} unoptimized />
              <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', border: '1px solid #e8d5a3', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#8B6914', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
            </div>
            <div style={{ padding: '20px 20px 28px', overflowY: 'auto' }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: '#C4952A', textTransform: 'uppercase', fontWeight: 600 }}>{modal.categoria}</span>
              <h5 style={{ color: '#3d3020', marginTop: 8, marginBottom: 10, fontSize: 20 }}>{modal.nome}</h5>
              <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg,#C4952A,transparent)', marginBottom: 12 }} />
              <p style={{ color: '#5a4a30', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{modal.descricao}</p>
              <p style={{ color: '#8B6914', fontSize: 26, fontWeight: 700, marginBottom: 20 }}>{modal.preco}</p>
              <button onClick={() => abrirWA(modal.nome)} style={{ width: '100%', padding: '14px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {svgWA(18, 'white')} Comprar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante WhatsApp */}
      <div onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, '_blank')} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 300, width: 56, height: 56, borderRadius: '50%', background: '#25D366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,211,102,0.4)' }}>
        {svgWA(28, 'white')}
      </div>
    </>
  );
}