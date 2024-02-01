document.addEventListener('DOMContentLoaded', function () {
    const inputFieldTwo = document.getElementById('inputFieldTwo');
    const resultDiv = document.getElementById('resultado');
    const searchFormTwo = document.getElementById('searchFormTwo');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadingText = document.getElementById('loading');

    async function consultarProcesso() {
        const inputValue = inputFieldTwo.value;
        const apiUrl = 'http://3.17.65.203:3000/number_process';

        try {
            loadingIndicator.style.display = 'block'; 
            loadingText.style.display = 'block';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchProcess: inputValue }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.id) {
                const primeiroMovimento = data.movimentos[0];
                resultDiv.innerHTML = `
                    <h2>Informações:</h2>
                    <p><strong>${data.id}</strong></p>
                    <p><strong>Área:</strong> ${data.area}</p>
                    <p><strong>Serventia:</strong> ${data.serventia}</p>
                    <p><strong>Valor da Causa:</strong> ${data.valorCausa}</p>
                    <p><strong>Fase Processual:</strong> ${data.faseProcessual}</p>
                    <p><strong>Segredo de Justiça:</strong> ${data.segredoJustica}</p>
                    <p><strong>Situação:</strong> ${data.situacao}</p>
                    <p><strong>Efeito Suspensivo:</strong> ${data.efeitoSuspensivo}</p>
                    <p><strong>Data de Distribuição:</strong> ${data.dataDistribuicao}</p>
                    <p><strong>Prioridade:</strong> ${data.prioridade}</p>
                    <p><strong>Classe:</strong> ${data.classe}</p>
                    <p><strong>Assunto:</strong> ${data.assunto}</p>
                    <p><strong>Custa:</strong> ${data.custa}</p>

                    <p><strong>Polo Ativo:</strong> ${data.poloAtivo.map(parte => parte.name).join(', ')}</p>
                    <p><strong>Polo Passivo:</strong> ${data.poloPassivo.map(parte => parte.name).join(', ')}</p>

                    <p><strong>Movimentos:</strong></p>
                    <ul>
                        <li>
                            <p><strong>ID:</strong> ${primeiroMovimento.id}</p>
                            <p><strong>Tipo:</strong> ${primeiroMovimento.tipo}</p>
                            <p><strong>Usuário Responsável:</strong> ${primeiroMovimento.usuarioResponsavel}</p>
                            <p><strong>Conteúdo:</strong> ${primeiroMovimento.conteudo}</p>
                            <p><strong>Data:</strong> ${primeiroMovimento.data}</p>
                        </li>
                    </ul>
                `;
            } else {
                resultDiv.innerHTML = '<p>Nenhum resultado encontrado para o número do processo informado.</p>';
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            resultDiv.innerHTML = '<p>Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.</p>';
        } finally {
            loadingIndicator.style.display = 'none';
            loadingText.style.display = 'none';
        }
    }

    searchFormTwo.addEventListener('submit', function (event) {
        event.preventDefault();
        consultarProcesso();
    });
});


    function formatarData(dataString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        const dataFormatada = new Date(dataString).toLocaleDateString('pt-BR', options);
        return dataFormatada;
    }


function showBuscaPageTwo() {
    document.getElementById('qrCodePage').style.display = 'none';
    document.getElementById('buscaPage').style.display = 'none';
    document.getElementById('buscaPageTwo').style.display = 'block';
}
