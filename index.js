'use strict';

// Inicia a aplicação
async function init(){

    // Seleciona o preço do produto
    /*const price = document.querySelector('.ui-pdp-price__part.andes-money-amount--cents-superscript.andes-money-amount--compact > meta')
    ?.content || "0";*/

    const hoje = new Date(); // Pegando a data no momento
    const mlbHome = document.querySelectorAll('.ui-search-bookmark')
    const listmlb = []
    const apiResp = []
    const vendas = []
    const datas = []
    const dias = []
    const nivelRes = []
    const titulos = []
    const ignoreWords = ['de', 'do', 'da', 'dos', 'das', 'a', 'o', 'em', 'no', 'na', 'um', 'uma', 'para', 'com', 'por', 'que', 'e', 'é', 'se', 'não', 'mais', 'como', 'ou', '-', '/', '+']
    const wordCount = {};
    const idVendedor = []
    const apiSellerRes = []
    let semMedalha = 0, mercadoLider = 0, gold = 0, platinum = 0
    let Nivel1 = 0, Nivel2 = 0, Nivel3 = 0
    const medalhas = []

    for (let a = 0; a < mlbHome.length; a++){
        const idmlb = mlbHome[a]?.action.substr(51,64)
        listmlb.push(idmlb)
        const api = await handleMlApi(`https://api.mercadolibre.com/items?ids=${listmlb[a]}`)
        apiResp.push(api)
        vendas.push(apiResp[a][0]?.body.sold_quantity)
        datas.push(apiResp[a][0]?.body.start_time)
        titulos.push(apiResp[a][0]?.body.title)
        idVendedor.push(apiResp[a][0].body.seller_id)

        const apiSeller = await handleMlApi(`https://api.mercadolibre.com/users/${idVendedor[a]}`)
        apiSellerRes.push(apiSeller.seller_reputation.power_seller_status)
        
       switch (apiSellerRes[a]) {
        case null:
            semMedalha++
            break;
        case 'silver':
            mercadoLider++
            break;
        case 'gold':
            gold++
            break;
        case 'platinum':
            platinum++    
       }
       medalhas[a] = 
       (apiSellerRes[a] === null) ?
       `<img id = "semMedalha" class = "iconMed" src = "https://cdn-icons-png.flaticon.com/512/7645/7645366.png">` :
       (apiSellerRes[a] === 'silver') ? 
       `<img class = 'iconMed' src = 'https://cdn-icons-png.flaticon.com/512/7645/7645366.png'>` :
       (apiSellerRes[a] === 'gold') ?
       `<img class = 'iconMed' src = 'https://cdn-icons-png.flaticon.com/512/7645/7645279.png'>` :
       `<img class = 'iconMed' src = 'https://cdn-icons-png.flaticon.com/512/7645/7645294.png'>`
      

        const dataCriacao = new Date(datas[a]); // Pegando data de criação
        const umDia = 24 * 60 * 60 * 1000 // h m s m
        const days = Math.round(Math.abs(dataCriacao - hoje) / umDia) // Calcula o dias de criação
        dias[a] = days
        const nivel = (vendas[a] / dias[a] >= 6 ) ? "Nivel 3" : (vendas[a] / dias[a] >= 3) && (vendas[a] / dias[a] < 6) ? "Nivel 2"
            : "Nivel 1"
        
            switch (nivel) {
                case "Nivel 1":
                    Nivel1++
                    break;
                case "Nivel 2":
                    Nivel2++
                    break;
                case "Nivel 3":
                    Nivel3++
                    break;    
               }

        nivelRes[a] = nivel
        const mediaVenDia = (vendas[a]/dias[a]).toFixed(2)

        const containerHome = document.querySelectorAll('.ui-search-item__group--title.shops__items-group > a > h2') // Pesquisa do produto
        setTimeout(() =>{
            containerHome[a].insertAdjacentHTML(
                'beforebegin',
            `
            <ul class = "container-home">
            <li><span> ${medalhas[a]} | ${dias[a]} dia(s) | ${vendas[a]} venda(s) | ${nivelRes[a]} - ${mediaVenDia} </span></li>
            </ul>
            `
        )
            const caixa = document.querySelectorAll('.container-home')    
            const corDia = (dias[a] <= 120) ? caixa[a].style.borderColor = "Green" :
            (dias[a] > 120 && dias[a] <= 359) ? caixa[a].style.borderColor = "Yellow" :
            caixa[a].style.borderColor = "Red"

            
              
        },1500)
        
    }
    
    if (document.querySelector('.ui-search-main--only-products.shops__search-main > aside > section > div:nth-child(1) > ul > li')){
        const medalhas = document.querySelector('.ui-search-main--only-products.shops__search-main > aside > section > div:nth-child(1) > ul > li')
        medalhas.insertAdjacentHTML('beforebegin',
        `
        <ul class ="medalhas">
            <li><span><img id = "semMedalha" title = "Sem Medalha" class = "iconMed" src = "https://cdn-icons-png.flaticon.com/512/7645/7645366.png"> ${semMedalha} | <img title = "Mercado Líder" class = "iconMed" src = "https://cdn-icons-png.flaticon.com/512/7645/7645366.png"> ${mercadoLider}
            | <img title = "Mercado Líder Gold" class = "iconMed" src = "https://cdn-icons-png.flaticon.com/512/7645/7645279.png"> ${gold} | <img title = "Mercado Líder Platinum" class = "iconMed" src ="https://cdn-icons-png.flaticon.com/512/7645/7645294.png"> ${platinum}<span></li>
        </ul>

        `)

        const quantidadeNivel = document.querySelector('.ui-search-main--only-products.shops__search-main > aside > section > div:nth-child(1) > ul > li')
        quantidadeNivel.insertAdjacentHTML('beforebegin',
        `
        <ul class ="medalhas">
            <li><span>Nivel 1 - ${Nivel1} | Nivel 2 - ${Nivel2} | Nivel 3 - ${Nivel3}<span></li>
        </ul>

        `)
        const nivelMedalha = document.querySelector('.medalhas')
        const nivelConcorrencia = (semMedalha > mercadoLider) && (semMedalha > gold) && (semMedalha > platinum) ? nivelMedalha.style.borderColor = "Green" :
        (mercadoLider > semMedalha) && (mercadoLider > platinum) && (mercadoLider > gold) || (gold >= mercadoLider) && (gold >= semMedalha) && (gold >= platinum)? nivelMedalha.style.borderColor = "Yellow":
        nivelMedalha.style.borderColor = "Red"
    }
    const elemento = document.querySelector('.ui-search-breadcrumb.shops__breadcrumb > h1')
    if (elemento){
        const criarBotão = document.querySelector('.ui-search-breadcrumb.shops__breadcrumb > h1').insertAdjacentHTML('beforebegin',
        `<button class ="palavraChave" >Lista de Palavras Chaves</button>`)
        const palavras = document.querySelector('.palavraChave').insertAdjacentHTML('afterend',
        `<div id="wordsList"></div>`)
        const botao = document.querySelector('.palavraChave')
        const wordsList = document.querySelector('#wordsList')
        

        titulos.forEach(titulos => {
            const words = titulos.toLowerCase().split(' ')
            words.forEach(word =>{
                if(!ignoreWords.includes(word) && !/\d/.test(word) && word.trim() !== ''){
                    if (!wordCount[word]){
                        wordCount[word] = 0
                    }
                    wordCount[word]++
                }
            })
        })
        const sortedWords = Object.keys(wordCount).sort((a,b) =>{
            return wordCount[b] - wordCount[a]
        })

        let showList = false

        botao.addEventListener('click', () => {
            showList = !showList;
            if (showList) {
              wordsList.innerHTML = sortedWords.slice(0, 13).map(word => `${word}: ${wordCount[word]}`).join('<br>');
            } else {
              wordsList.innerHTML = '';
            }
          });
        }else{
        
    //}, 1000)
    
     // Seleciona o local e injeta as informações de analise
     const container = document.querySelector('.ui-pdp-header__title-container'); // Dento da pagena do produto
        
     // Pegando MLB (id) do produto
     const mlId = document.querySelector('meta[name="twitter:app:url:iphone"]')
     ?.content.split('id=')[1]

    //Capiturando as informações do produto pela API
    const apiResponse = await handleMlApi(`https://api.mercadolibre.com/items?ids=${mlId}`)
        
    //Pegando as informaçãoes nescessarias da Api
    const {body: {price, category_id, sold_quantity, listing_type_id, start_time}} = apiResponse[0]
    
    // Pegando informação da comição na API ML
    const {sale_fee_amount, listing_type_name } = (await handleMlApi(`https://api.mercadolibre.com/sites/MLB/listing_prices?price=${price}&listing_type_id=${listing_type_id}&category_id=${category_id}`
    )) || {};
    
   // Base de Calculo 
    const receitaBruta = Number(price) * sold_quantity // Calculo para saber o valor bruto vendido
    const receitaLiquida = Number(receitaBruta - (sale_fee_amount * sold_quantity) - ((price*0.07) * sold_quantity)) // Calculo para receita liquida
    const comissao = (price>=79) ? (sale_fee_amount * 100) / price
     : ((sale_fee_amount - 5.5) * 100) / price // Calcula a % da comissão
     const valorComissao = (price>=79) ? sale_fee_amount : sale_fee_amount - 5.5 // Calcula o valor da comissão
     const startTime = new Date(start_time); // Pegando data de criação
     const today = new Date(); // Pegando a data no momento
     const oneDay = 24 * 60 * 60 * 1000 // h m s m
     const diffDays = Math.round(Math.abs(startTime - today) / oneDay) // Calcula o dias de criação
     const mediaVendas = sold_quantity / diffDays // por dias
     const mediaVenMes = Math.trunc(mediaVendas) * 30
     const data = start_time.slice(0,10).split("-").reverse().join("/")
     const nivelUnd = (sold_quantity / diffDays >= 6 ) ? "Nivel 3" : (sold_quantity / diffDays >= 3) && (sold_quantity / diffDays < 6) ? "Nivel 2"
            : "Nivel 1"
     const valorMaximo = (price >= 79) ? price - (price * (Math.round(comissao) / 100)) - (price * (4 / 100)) - 29.55 - (price * (8 / 100)):
     price - (price * (Math.round(comissao) / 100)) - (price * (4 / 100)) - 5.5 - (price * (8 / 100))
     const valorMinimo =  (price >= 79) ? price - (price * (Math.round(comissao) / 100)) - (price * (4 / 100)) - 29.55 - (price * (25 / 100)):
     price - (price * (Math.round(comissao) / 100)) - (price * (4 / 100)) - 5.5 - (price * (25 / 100))

    
     // Temporizasor para que as informações continue no site
    setTimeout(() => {
        container.insertAdjacentHTML(
            'beforebegin',
            `
           
            <ul class="AnalisePro-container">               
                <li>Quantidade Venda: <span>${sold_quantity}</span></li>
                <li>Data de Criação: <span>${data} | ${diffDays} dias</span></li>
                <li>Média de Venda: <span>${nivelUnd} | ${Math.trunc(mediaVendas)} por dia<br>${Math.trunc(mediaVenMes)} por Mês</span>
                <li>Reiceita Bruta: <span>${formatMoney(receitaBruta)}</span></li>
                <li>Receita Líquida: ${(price>=79)?`<span>`+ formatMoney(receitaLiquida) + ` sem a retirada do frete</span>`
                :`<span>` + formatMoney(receitaLiquida) + ` </span>`}</li>
                <li>Comissão ML: <span>${listing_type_name} | ${Math.round(comissao)}% | ${formatMoney(valorComissao)}</span><li>
                <li>Valor Presumido Compra: <span> Minímo ${formatMoney(valorMinimo)} até<br>Máximo ${formatMoney(valorMaximo)}</span></li>
            </ul>
        
           ` 
        );        

        const caixaProduto = document.querySelector('.AnalisePro-container')
        const corDiasProduto = (diffDays <= 120) ? caixaProduto.style.borderColor = "Green" :
            (diffDays > 120 && diffDays <= 359) ? caixaProduto.style.borderColor = "Yellow" :
            caixaProduto.style.borderColor = "Red"

    }, 1500);

     
    // Função para formatar em dinheiro para BR
    function formatMoney(value){
        return value.toLocaleString("pt-BR", {
            style: 'currency',
            currency: 'BRL',
        });
    }

   
    function formatdata(date){
        const day = date.getDate().toString().padStart(2,'0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${year}-${month}-${day}`
    }}
    
    // Função para fazer uma requisição a API ML
    async function handleMlApi(url){
        try {

            const config = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                                    
                },
                
            };

            const response = await fetch (url, config);
            const finalRes = await response.json();
            return finalRes;

        }catch(err){
            console.log("Erro na requisição", err);
        }
    }
}
init()