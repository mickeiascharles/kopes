# Pedido Retrospectiva

Aplicação Angular estática pronta para hospedagem no GitHub Pages.

## Rodar localmente

```bash
npm install
npm start
```

Abra `http://localhost:4200/`.

## Build de produção

```bash
npm run build
```

Os arquivos finais ficam em `dist/pedido-retrospectiva`.

## Build para GitHub Pages

Use este comando se o repositório se chamar `pedido-retrospectiva`:

```bash
npm run build:pages
```

Se o nome do repositório for outro, ajuste o script `build:pages` em `package.json` trocando `/pedido-retrospectiva/` por `/nome-do-repositorio/`.
