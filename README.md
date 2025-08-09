# EstudaPro

Plataforma educacional (frontend) desenvolvida com **TypeScript**, **Vite** e **TailwindCSS** no estilo SPA (Single-Page Application), ideal como base para projetos de estudos ou protótipos interativos.

---

##  Visão Geral
- Interface dinâmica para estudos, com listagem, filtros e navegação simples.
- Ferramentas modernas: React com TypeScript, estilos com Tailwind e construção ágil com Vite.
- Estrutura organizada para facilitar compreensão e escalabilidade.

---

##  Tecnologias Utilizadas
- **Framework**: Vite + React + TypeScript  
- **Estilização**: TailwindCSS com configuração personalizada (Tailwind Config)  
- **Qualidade de Código**: ESLint configurado para ambiente TS/React  
- **Ferramentas de Build**: Vite + PostCSS

---

##  Como Executar

1. Faça o clone do repositório:
   ```bash
   git clone https://github.com/CarlosSeixas2/EstudaPro.git
   cd EstudaPro
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação em `http://localhost:5173`.

---

##  Estrutura do Projeto

```
root/
├── public/                # Recursos públicos (HTML, imagens)
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── pages/             # Páginas (SPA)
│   ├── styles/            # Arquivos Tailwind customizados
│   ├── index.tsx          # Ponto de entrada principal
│   └── App.tsx            # Componente raiz da aplicação
├── db.json                # Mock de dados (se houver backend simulado)
├── tailwind.config.js     # Configurações do TailwindCSS
├── postcss.config.js      # Plugins PostCSS
├── vite.config.ts         # Configuração do Vite
└── eslint.config.js       # Configuração do ESLint
```

---

##  Sugestões de Melhoria (Roadmap)
- Adicionar **busca por tópicos ou cards de estudo** com filtros interativos.
- Criar **rota de detalhes** para cada tópico ou conteúdo.
- Implementar **mock de API** com `db.json` + ferramentas como `json-server`.
- Tornar o layout responsivo e adicionar **modo claro/escuro**.
- Incluir **deploy automático** (Vercel, Netlify etc.).
- Suporte a **internacionalização**, testes unitários e integração (Jest + React Testing Library).

---

##  Como Contribuir
1. Faça um fork deste repositório.  
2. Crie uma branch com o nome da sua funcionalidade:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça commits claros e descritivos.  
4. Envie suas alterações e abra um Pull Request.

---

##  Licença
Distribuído sob a licença **MIT**.

---

Desenvolvido com ❤️ e boas práticas de frontend moderno pelo **Carlos Seixas**.
