# Instruções para Execução Local - Site 3PWeb (Estilo Lusion)

Este pacote contém o código-fonte do site da 3PWeb, desenvolvido com Next.js, TypeScript, Tailwind CSS, Three.js (React Three Fiber), GSAP e Lenis, com o objetivo de replicar a experiência imersiva e as animações avançadas inspiradas em Lusion.co.

## Pré-requisitos

- Node.js (versão 18.x ou superior recomendada)
- npm (geralmente vem com o Node.js)

## Passos para Execução

1.  **Descompacte o arquivo:** Extraia o conteúdo do arquivo `3pweb_lusion_style_source.zip` para uma pasta de sua preferência no seu computador.

2.  **Navegue até a pasta do projeto:** Abra o seu terminal ou prompt de comando e navegue até o diretório onde você descompactou os arquivos. Você deve estar dentro da pasta `3pweb_site`.
    ```bash
    cd caminho/para/3pweb_site
    ```

3.  **Instale as dependências:** Execute o comando abaixo para instalar todas as bibliotecas e pacotes necessários para o projeto. Pode levar alguns minutos.
    ```bash
    npm install
    ```
    *Observação: Durante a instalação, você poderá ver alguns avisos sobre `peer dependencies` (especialmente relacionados ao `@studio-freight/react-lenis` e a versão do React). Isso é esperado, pois utilizamos a flag `--legacy-peer-deps` para compatibilizar o Lenis com a versão mais recente do React. O projeto deve funcionar corretamente apesar desses avisos.*

4.  **Inicie o servidor de desenvolvimento:** Após a instalação das dependências, execute o comando abaixo para iniciar o servidor de desenvolvimento do Next.js.
    ```bash
    npm run dev
    ```

5.  **Acesse o site no navegador:** O terminal indicará o endereço local onde o site está rodando (geralmente `http://localhost:3000`, mas pode ser outra porta como `3001`, `3002`, etc., se a porta 3000 estiver em uso). Abra o seu navegador e acesse este endereço.

## O que Validar

-   **Página Inicial (`/`):**
    -   Visual geral, tipografia, cores.
    -   Animação do objeto 3D no hero (um TorusKnot giratório como placeholder).
    -   Suavidade da rolagem (efeito Lenis).
    -   Animações de entrada de texto no hero.
-   **Página Sobre (`/about`):**
    -   **Scroll Horizontal:** Verifique se a rolagem da página é predominantemente horizontal, movendo as seções lateralmente.
    -   **Animações de Entrada das Seções:** Observe se os textos e imagens de cada seção aparecem com animações suaves (fade-in, slide-up) conforme você rola para elas.
    -   **Objeto 3D Flutuante:** No fundo da página "Sobre", deve haver um objeto 3D (um Icosaedro) que se move e rotaciona conforme você rola horizontalmente pela página.
    -   **Layout e Responsividade (Básica):** Embora o foco principal desta entrega seja a mecânica do scroll horizontal e as animações 3D, observe se o layout geral se adapta razoavelmente em diferentes larguras de tela (a responsividade completa será refinada posteriormente).
    -   **Performance:** Avalie a fluidez das animações e da rolagem. O objetivo é um FPS alto.

## Próximos Passos (Pós-Validação)

Após sua validação, continuaremos com:

-   Refinamento das animações 3D para maior complexidade e fidelidade à referência Lusion.
-   Implementação das demais seções do site (Serviços, Blog, Contato, etc.) com seus respectivos efeitos e interações.
-   Integração com o CMS Sanity.
-   Implementação das demais integrações (WhatsApp, Pagamentos Cripto, Newsletter).
-   Otimização de performance e responsividade completa.

Seu feedback nesta etapa é crucial para garantirmos que estamos no caminho certo para criar a experiência impactante que você deseja.

Obrigado!
