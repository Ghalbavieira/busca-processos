
document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('inputField');
    const resultDiv = document.getElementById('result');
    const searchForm = document.getElementById('searchForm');

    async function scrapeWebsite() {
        const inputValue = inputField.value;
        const apiUrl = 'https://api-publica.datajud.cnj.jus.br/api_publica_tjgo/_search';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=='
                },
                body: JSON.stringify({
                    query: {
                        bool: {
                            should: [
                                { match: { numeroProcesso: inputValue } },
                                { match: { numeroCPF: inputValue } },
                                { match: { numeroCNPJ: inputValue } }
                            ]
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
        
            if (data.hits.total.value > 0) {
                const firstHit = data.hits.hits[0]._source;
                const assuntos = firstHit.assuntos;
                const infoHTML = `
                    <h2>Informações:</h2>
                    <p>Classe: ${firstHit.classe.nome}</p>
                    <p>Número do Processo: ${firstHit.numeroProcesso}</p>
                    <p>Tribunal: ${firstHit.tribunal}</p>
                    <p>Data e Hora: ${formatarData(firstHit.dataHoraUltimaAtualizacao)}</p>
                    <p>Assuntos: ${assuntos.length > 0 ? assuntos.map(assunto => assunto.nome).join(', ') : 'N/A'}</p>
                `;
                resultDiv.innerHTML = infoHTML;
            } else {
                resultDiv.innerHTML = '<p>Nenhum resultado encontrado para o número do processo ou CPF/CNPJ informado.</p>';
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        scrapeWebsite();
    });

    function formatarData(dataString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        const dataFormatada = new Date(dataString).toLocaleDateString('pt-BR', options);
        return dataFormatada;
    }

});

function showBuscaPage() {
    document.getElementById('qrCodePage').style.display = 'none';
    document.getElementById('buscaPage').style.display = 'block';
}

   // QR Code Scanner
   function showQrCodePage() {
    const qrCodeDiv = document.getElementById('qrCode');

    // Verifique se o elemento qrCodeDiv foi encontrado
    if (!qrCodeDiv) {
        console.error("Elemento com o ID 'qrCode' não encontrado no DOM.");
        return;
    }

    document.getElementById('buscaPage').style.display = 'none';
    document.getElementById('qrCodePage').style.display = 'block';

    qrCodeDiv.innerHTML = '';  

    const qrCodeContent = "https://web.whatsapp.com"; 

    const qrcodeOptions = {
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
    };

    const qrcode = new QRCode(qrCodeDiv, qrcodeOptions);
    qrcode.makeCode(qrCodeContent);

    initializeWhatsAppClient();
}
function initializeWhatsAppClient() {
    const whatsappWeb = window['whatsappWeb'];
    console.log('Objeto whatsappWeb:', window['whatsappWeb']);

    if (!whatsappWeb || !whatsappWeb.Client) {
        console.error("Objeto 'whatsappWeb' ou 'whatsappWeb.Client' não está definido.");
        return;
    }

    const client = new whatsappWeb.Client();
    
    client.on('qr', (qrCode) => {
        console.log('QR Code:', qrCode);

        const qrCodeDiv = document.getElementById('qrCodePage');
        if (qrCodeDiv) {
            qrCodeDiv.innerHTML = `<img src="${qrCode}" alt="QR Code"/>`;
        }
    });

    client.on('ready', () => {
        console.log('WhatsApp bot conectado!');
    });

    client.initialize();
}
