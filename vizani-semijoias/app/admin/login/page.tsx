'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleLogin() {
    setLoading(true);
    setErro('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    if (error) {
      setErro('Email ou senha inválidos');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="login-container">

      <div className="login-card shadow">

  <img
    src="/logo.png"
    alt="Vizani"
    className="login-logo"
  />

  <h3 className="login-title">Painel Administrativo</h3>

  <div className="form-group mb-3">
    <input
      type="email"
      className="form-control input-gold"
      placeholder="Email"
      onChange={e => setEmail(e.target.value)}
    />
  </div>

  <div className="form-group mb-3">
    <input
      type="password"
      className="form-control input-gold"
      placeholder="Senha"
      onChange={e => setSenha(e.target.value)}
    />
  </div>

  {/* 🔥 ERRO NO LUGAR CERTO */}
  {erro && (
    <div className="login-error">
      {erro}
    </div>
  )}

  <button
    className="btn btn-gold w-100 d-flex justify-content-center align-items-center"
    onClick={handleLogin}
    disabled={loading}
  >
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2"></span>
        Entrando...
      </>
    ) : (
      'Entrar'
    )}
  </button>

</div>

    </div>
  );
}