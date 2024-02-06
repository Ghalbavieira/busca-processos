document.addEventListener('DOMContentLoaded', function () {
    const inputFieldTwo = document.getElementById('inputFieldTwo');
    const resultDiv = document.getElementById('resultado');
    const searchFormTwo = document.getElementById('searchFormTwo');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadingText = document.getElementById('loading');

    async function consultarProcesso(numerosProcesso) {
        const apiUrl = 'https://api-scraping.api-node-aws.shop/number_process';

        try {
            loadingIndicator.style.display = 'block'; 
            loadingText.style.display = 'block';

            // Consulta os processos de forma assíncrona em paralelo
            const requests = numerosProcesso.map(async num => {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchProcess: num }),
                });
                return response.json();
            });

            
            const results = await Promise.all(requests);

            
            resultDiv.innerHTML = '';

            results.forEach((data, index) => {
                if (index > 0) {
                    resultDiv.innerHTML += '<hr>'; // Adiciona uma linha horizontal entre os resultados, exceto para o primeiro
                }
                if (data.id) {
                    const primeiroMovimento = data.movimentos[0];
                    resultDiv.innerHTML += `
                        <div>
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
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML += '<div><p>Nenhum resultado encontrado para o número do processo informado.</p></div>';
                }
            });
        } catch (error) {
            console.error('Houve um problema com a operação de busca:', error);
            resultDiv.innerHTML = '<div><p>Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.</p></div>';
        } finally {
            loadingIndicator.style.display = 'none';
            loadingText.style.display = 'none';
        }
    }

    searchFormTwo.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputValue = inputFieldTwo.value.trim();
        const numerosProcesso = inputValue.split(/\s*,\s*|\s+/); // Separa os números de processo por vírgula ou espaço
        consultarProcesso(numerosProcesso);
    });
});
