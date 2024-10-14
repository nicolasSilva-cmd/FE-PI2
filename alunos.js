const url = 'http://localhost:8081/alunos'; // URL para sua API de alunos
let alunos = []; // Armazena a lista de alunos

// Função para listar todos os alunos
const listAllAlunos = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao listar alunos');

        alunos = await response.json();
        renderAlunos(); // Chama a função para renderizar a lista de alunos
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
    }
};

// Função para renderizar a lista de alunos em uma tabela
const renderAlunos = () => {
    const alunosList = document.getElementById('alunosList');
    alunosList.innerHTML = ''; // Limpa a tabela atual

    if (alunos.length === 0) {
        // Caso não tenha alunos na lista
        alunosList.innerHTML = '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
    } else {
        alunos.forEach((aluno) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.name}</td>
                <td>${aluno.serie}</td>
                <td>${aluno.dataEmprestimo || 'N/A'}</td>
                <td>${aluno.livros ? aluno.livros.map(l => l.titulo).join(', ') : 'Nenhum'}</td>
                <td>${aluno.motivo || 'N/A'}</td>
            `;
            alunosList.appendChild(tr);
        });
    }
};

// Função para buscar aluno por ID
const findAlunoById = async () => {
    const id = document.getElementById('alunoId').value;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // Limpa mensagens de erro
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) throw new Error('Aluno não encontrado');

        const aluno = await response.json();
        alunos = [aluno]; // Atualiza a lista para mostrar apenas o aluno encontrado
        renderAlunos(); // Chama a função para renderizar a lista
    } catch (error) {
        console.error('Erro ao encontrar aluno:', error);
        // Em caso de erro, lista todos os alunos novamente
        await listAllAlunos();
        errorMessage.textContent = error.message; // Mostra a mensagem de erro
    }
};

// Função para adicionar um novo aluno
const addAluno = async () => {
    const name = document.getElementById('name').value;
    const serie = document.getElementById('serie').value;
    const dataEmprestimo = document.getElementById('dataEmprestimo').value;
    const motivo = document.getElementById('motivo').value;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, serie, dataEmprestimo, motivo })
        });
        if (!response.ok) throw new Error('Erro ao adicionar aluno');

        listAllAlunos(); // Atualiza a lista após adição
    } catch (error) {
        console.error('Erro ao adicionar aluno:', error);
    }
};

// Event listeners
document.getElementById('buscarAluno').addEventListener('click', findAlunoById);
document.getElementById('adicionarAluno').addEventListener('click', addAluno);

// Chama a função para listar todos os alunos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    listAllAlunos();
});
