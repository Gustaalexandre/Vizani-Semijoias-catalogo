'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import './admin.css';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: string;
  descricao: string;
  foto_url: string;
}

export default function Admin() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [erroForm, setErroForm] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState('');

  const [produto, setProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    descricao: '',
    foto_url: '',
    file: null as File | null,
  });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    verificarUsuario();
  }, []);

  async function verificarUsuario() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.replace('/admin/login');
      return;
    }

    await carregar();
    setLoading(false);
  }

  async function carregar() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (!error) setProdutos(data || []);
  }

  function formatarPreco(valor: string) {
    const numero = valor.replace(/\D/g, '');
    const valorFloat = Number(numero) / 100;

    return valorFloat.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  async function salvar() {
    setErroForm('');
    setSucesso('');
    setSalvando(true);

    if (
      !produto.nome ||
      !produto.categoria ||
      !produto.preco ||
      !produto.descricao ||
      (!produto.file && !produto.foto_url)
    ) {
      setErroForm('Preencha todos os campos!');
      setSalvando(false);
      return;
    }

    let imageUrl = produto.foto_url;

    if (produto.file) {
      const nomeArquivo = `${Date.now()}-${produto.file.name}`;

      const { error } = await supabase.storage
        .from('produtos')
        .upload(nomeArquivo, produto.file);

      if (error) {
        setErroForm('Erro ao fazer upload da imagem');
        setSalvando(false);
        return;
      }

      const { data } = supabase.storage
        .from('produtos')
        .getPublicUrl(nomeArquivo);

      imageUrl = data.publicUrl;
    }

    const dados = {
      nome: produto.nome.trim(),
      categoria: produto.categoria.toLowerCase().trim(),
      preco: produto.preco,
      descricao: produto.descricao.trim(),
      foto_url: imageUrl,
    };

    let error;

    if (editandoId) {
      const res = await supabase
        .from('produtos')
        .update(dados)
        .eq('id', editandoId);

      error = res.error;
    } else {
      const res = await supabase
        .from('produtos')
        .insert([dados]);

      error = res.error;
    }

    if (error) {
      setErroForm('Erro ao salvar produto');
    } else {
      setSucesso('Produto salvo com sucesso!');

      setProduto({
        nome: '',
        categoria: '',
        preco: '',
        descricao: '',
        foto_url: '',
        file: null,
      });

      setEditandoId(null);
      carregar();
    }

    setSalvando(false);
  }

  async function excluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return;

    await supabase.from('produtos').delete().eq('id', id);
    carregar();
  }

  function editar(p: Produto) {
    setProduto({
      nome: p.nome,
      categoria: p.categoria,
      preco: p.preco,
      descricao: p.descricao,
      foto_url: p.foto_url,
      file: null,
    });

    setEditandoId(p.id);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  if (loading) {
    return <p style={{ padding: 40 }}>Verificando acesso...</p>;
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="nav-wrapper">

          <div className="nav-left">
            <img
              src="/logo.png"
              className="admin-logo"
              onClick={() => router.push('/')}
            />
          </div>

          <div className="nav-center">
            <h2>Painel Admin</h2>
          </div>

          <div className="nav-right">
            <button
              onClick={() => router.push('/')}
              className="btn btn-light btn-sm btn-outline-gold"
            >
              Ver Catálogo
            </button>

            <button
              className="btn btn-gold btn-sm"
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace('/admin/login');
              }}
            >
              Sair
            </button>
          </div>

        </div>

        <div className="nav-line" />
      </nav>

      {/* CONTEÚDO */}
      <div className="container py-5">

        {/* FORM */}
        <div ref={formRef} className="card card-gold p-4 mb-5 shadow-sm">
          <h5 className="mb-3 text-gold">
            {editandoId ? 'Editar Produto' : 'Novo Produto'}
          </h5>

          {erroForm && (
            <div className="alert alert-danger">{erroForm}</div>
          )}

          {sucesso && (
            <div className="alert alert-success">{sucesso}</div>
          )}

          <div className="row g-3">

            <div className="col-md-6">
              <input className="form-control input-gold"
                placeholder="Nome"
                value={produto.nome}
                onChange={e => setProduto({ ...produto, nome: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <select
                className="form-control input-gold"
                value={produto.categoria}
                onChange={e => setProduto({ ...produto, categoria: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                <option value="brinco">Brinco</option>
                <option value="pulseira">Pulseira</option>
                <option value="anel">Anel</option>
                <option value="corrente">Corrente</option>
              </select>
            </div>

            <div className="col-md-6">
              <input
                className="form-control input-gold"
                placeholder="Preço"
                value={produto.preco}
                onChange={(e) =>
                  setProduto({
                    ...produto,
                    preco: formatarPreco(e.target.value)
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setProduto({
                    ...produto,
                    file: e.target.files?.[0] || null
                  })
                }
              />
            </div>

            {produto.file && (
              <div className="col-12">
                <img
                  src={URL.createObjectURL(produto.file)}
                  style={{ width: 120, borderRadius: 8 }}
                />
              </div>
            )}

            <div className="col-12">
              <textarea
                className="form-control input-gold"
                placeholder="Descrição"
                value={produto.descricao}
                onChange={e => setProduto({ ...produto, descricao: e.target.value })}
              />
            </div>

            <div className="col-12">
              <button className="btn btn-gold w-100" onClick={salvar} disabled={salvando}>
                {salvando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Salvando...
                  </>
                ) : (
                  editandoId ? 'Atualizar Produto' : 'Salvar Produto'
                )}
              </button>

              {editandoId && (
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setProduto({
                      nome: '',
                      categoria: '',
                      preco: '',
                      descricao: '',
                      foto_url: '',
                      file: null,
                    });
                    setEditandoId(null);
                  }}
                >
                  Cancelar edição
                </button>
              )}
            </div>

          </div>
        </div>

        {/* LISTA */}
        <div>
          <h4 className="admin-title mb-3">Produtos cadastrados</h4>

          <div className="row g-3">
            {produtos.map(p => (
              <div key={p.id} className="col-md-6 col-lg-4">

                <div className="card card-gold h-100 shadow-sm">

                  <img
                    src={p.foto_url}
                    className="card-img-top"
                    style={{ height: 180, objectFit: 'cover' }}
                  />

                  <div className="card-body d-flex flex-column">

                    <h6>{p.nome}</h6>
                    <p className="text-gold">{p.preco}</p>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-outline-warning w-100" onClick={() => editar(p)}>
                        ✏️
                      </button>
                      <button className="btn btn-danger w-100" onClick={() => excluir(p.id)}>
                        🗑️
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}