![Tela do Projeto](./img/preview.png)

Vai dar quanto? — Calculadora de custo de Viagens

Vídeo Demo: [https://www.youtube.com/watch?v=mlD8NEZ2jhg]

🔗deploy: [https://vai-dar-quanto-web-front.onrender.com/]
⚠️ Nota sobre o acesso: Este projeto está hospedado no plano gratuito do Render. Por isso, o site pode estar inativo por algum tempo. O primeiro cálculo pode levar cerca de 30-40 segundos para "acordar" o container. Agradeço a paciência!

O "Vai dar quanto?" é uma aplicação completa (Full-Stack) projetada para ajudar motoristas a estimarem o custo real de combustível em seus trajetos. Utilizando integrações com a Google Maps API, o sistema calcula a distância precisa entre dois pontos e aplica regras de negócio inteligentes, como alertas para horários de maior consumo (pico).
 
Funcionalidades Principais

    Cálculo Preciso: Integração com Google Distance Matrix API para quilometragem exata.

    Autocomplete de Endereços: Busca inteligente de locais via Google Places API.

    Suporte a Múltiplos Combustíveis: Cálculos específicos para Gasolina, Etanol, Diesel e GNV.

    Consumo Inteligente: Exibição de médias em km/L e km/m³ (para GNV).

    Alerta de Horário de Pico: Sistema que identifica horários comerciais e sugere que o consumo pode ser maior.


 Tecnologias Utilizadas

    Frontend: React (Vite), Styled Components/CSS dinâmico.

    Backend: Java 17+, Spring Boot, PostgreSQL, Docker.

    APIs: Google Maps (Distance Matrix, Autocomplete e Places).

Como rodar o projeto

Como o projeto utiliza variáveis de ambiente para segurança, você precisará configurar as chaves de API localmente.

    Clone o repositório:
    Bash

    git clone https://github.com/seu-usuario/vai-dar-quanto.git

    Configuração do Frontend:

        Crie um arquivo .env na raiz da pasta frontend.

        Adicione sua chave: VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui.

    Configuração do Backend:

        Garanta que o seu banco de dados PostgreSQL esteja rodando.

        Configure as credenciais no application.properties.

Desenvolvedor

Thiago Bianna Pessanha da Cruz
Estudante de Engenharia de Software
