# ⚡ A Torre da Tempestade

Relógio atmosférico interativo que combina **clima em tempo real, geolocalização, ciclo do dia e efeitos visuais dinâmicos** em uma experiência inspirada em uma torre gótica.

O cenário se transforma de acordo com o horário e com as condições climáticas da localização do usuário.

## 🌩️ Funcionalidades

- 🕐 Relógio em tempo real
- 📅 Data atual
- 🌍 Geolocalização do usuário
- 🌡️ Temperatura e clima em tempo real
- 🌅 Cenários diferentes para amanhecer, dia, entardecer e noite
- ☁️ Nuvens animadas atravessando o cenário
- 🌧️ Chuva gerada dinamicamente
- ⚡ Relâmpagos e raios animados
- 🏰 Atmosfera gótica especial durante a noite
- ⏩ Simulação de horário com `+1h` e `+6h`
- 🧪 Modo demonstração para testar todas as condições climáticas
- 📱 Interface responsiva

## 🌦️ Sistema climático

O projeto utiliza dados meteorológicos reais para modificar a atmosfera da torre.

### Céu limpo
Atmosfera mais clara e poucas nuvens.

### Nublado
Nuvens atravessam o cenário e deixam a torre com uma aparência mais sombria.

### Chuva
A chuva é criada dinamicamente e clarões de relâmpagos podem iluminar o céu.

### Tempestade
Chuva intensa, nuvens pesadas, clarões e raios visíveis atravessam o cenário.

### 🌙 Regra da noite

Durante a noite, a torre assume uma atmosfera propositalmente mais gótica.

Mesmo quando não existe uma tempestade real, raios e relâmpagos ocasionais podem surgir no céu como parte da identidade visual do projeto.

## 🧪 Modo demonstração

O botão **Demonstração** permite testar manualmente os diferentes estados do sistema:

- Limpo
- Nublado
- Chuva
- Tempestade

É possível retornar ao clima real a qualquer momento.

## ⏱️ Simulação do ciclo do dia

Os controles permitem avançar artificialmente o relógio para visualizar as mudanças do cenário sem precisar esperar o horário real.

- `+1h` — avança uma hora
- `+6h` — avança seis horas
- `Agora` — retorna ao horário atual

A simulação altera o ciclo visual da torre, enquanto o sistema continua utilizando as condições meteorológicas obtidas para a localização do usuário.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Geolocation API
- Open-Meteo API
- BigDataCloud Reverse Geocoding API
- SVG para geração dinâmica dos raios
- CSS Animations

## 🧠 Conceitos praticados

Este projeto foi desenvolvido para praticar e demonstrar conhecimentos em:

- Manipulação do DOM
- Consumo de APIs
- JavaScript assíncrono
- `fetch`
- `async / await`
- Geolocalização
- Manipulação de datas e fusos horários
- Eventos
- Timers
- Estado da aplicação
- Criação dinâmica de elementos
- Animações CSS
- SVG dinâmico
- Design responsivo
- Organização de lógica front-end

## 📂 Estrutura do projeto

    relogio-gotico/
    ├── imagens/
    │   ├── castelo-amanhecer.jpg
    │   ├── castelo-dia.jpg
    │   ├── castelo-noite.jpg
    │   ├── castelo-pordosol.jpg
    │   ├── nuvem-leve.png
    │   ├── nuvem-pesada.png
    │   └── nuvem-tempestade.png
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md

## 🎯 Objetivo do projeto

Criar uma experiência web interativa em que **interface, horário, localização e dados externos trabalham juntos** para modificar dinamicamente o ambiente apresentado ao usuário.

Além do aspecto visual, o projeto explora integração com APIs, tratamento de estados, manipulação do DOM e geração de efeitos em tempo real utilizando JavaScript.

## 👨‍💻 Autor

**Thiago Araujo**

Bacharel em Ciência da Computação pela UNICID.

[LinkedIn](https://www.linkedin.com/in/thaigoaoliveira/)  
[GitHub](https://github.com/t-h-i-a-g-o-a-r-a-u-j-o)

---

⚡ **A Torre da Tempestade — O tempo muda. A torre permanece.**
