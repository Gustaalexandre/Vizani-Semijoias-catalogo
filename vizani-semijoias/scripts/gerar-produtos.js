// scripts/gerar-produtos.js
const fs = require('fs');
const path = require('path');

const pastaFotos = path.join(__dirname, '../public/produtos');
const arquivos = fs.readdirSync(pastaFotos)
  .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

const produtos = arquivos.map(arquivo => {
  const nome = arquivo
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const categorias = ['brinco', 'pulseira'];
  const categoria = categorias.find(c => arquivo.toLowerCase().includes(c)) || 'brinco';

  return {
    id: arquivo,
    nome,
    categoria,
    foto: `/produtos/${arquivo}`,
    preco: 'R$ 0,00',       // edite no produtos.json depois
    descricao: 'Descrição do produto.',
  };
});

fs.writeFileSync(
  path.join(__dirname, '../app/produtos.json'),
  JSON.stringify(produtos, null, 2)
);

console.log(`✅ ${produtos.length} produtos gerados!`);