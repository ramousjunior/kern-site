# KERN · site

Site estático de [kernrun.com.br](https://kernrun.com.br), seguindo o Manual de Identidade Visual 2026_01.

- `index.html` — página única: abertura, manifesto, produto, comunidade e rodapé
- `css/style.css` — cores e tipografia do manual (Archivo, Inter, Chivo Mono)
- `js/main.js` — anéis de crescimento e animação do manifesto (GSAP)
- `assets/` — favicon e, no futuro, fotos (`assets/fotos/`)

## Ver no computador

```powershell
python -m http.server 5173 --directory .
```

Abra `http://localhost:5173`.

## Publicar

Hospedado no GitHub Pages (branch `main`, pasta raiz). Cada `git push` publica a nova versão em 1 a 2 minutos.

## Abrir a venda

Enquanto o lote não chega, o site mostra a lista de espera. No dia da abertura, em `js/main.js`, troque `KERN_FASE = "lista"` por `KERN_FASE = "venda"`: o botão vira "Comprar pelo Instagram" (ou WhatsApp, se o número estiver preenchido) e os textos da lista somem.

## Trocar as fotos

Coloque as fotos em `assets/fotos/` e, no `index.html`, troque o comentário dentro de cada `<figure class="foto">` por
`<img src="assets/fotos/NOME.jpg" alt="descrição da foto">`.
