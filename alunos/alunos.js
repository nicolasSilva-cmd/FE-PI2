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
        alunosList.innerHTML = '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
    } else {
        alunos.forEach((aluno) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.name}</td>
                <td>${aluno.serie}</td>
                <td>${aluno.dataEmprestimo || 'N/A'}</td>
                <td>${aluno.motivo || 'N/A'}</td>
                <td>${aluno.livros ? aluno.livros.map(l => l.titulo).join(', ') : 'Nenhum'}</td>
                <td>
                    <button onclick="editarAluno(${aluno.id})">Editar</button>
                    <button onclick="deletarAluno(${aluno.id})">Deletar</button>
                </td>
            `;
            alunosList.appendChild(tr);
        });
    }
};

const deletarAluno = async (id) => {
    if (confirm(`Tem certeza que deseja excluir o aluno com ID ${id}?`)) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao excluir aluno');

            alert('Aluno excluído com sucesso!');
            listAllAlunos(); // Atualiza a lista após exclusão
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
        }
    }
};

const editarAluno = (id) => {
    window.location.href = `editar-aluno.html?id=${id}`;
};

// Função para buscar aluno por ID
const buscarAlunoPorId = async (id) => {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) throw new Error('Aluno não encontrado');

        const aluno = await response.json();
        // Limpa os campos anteriores
        document.getElementById('alunosList').innerHTML = ''; 
        // Renderiza o aluno encontrado
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.id}</td>
            <td>${aluno.name}</td>
            <td>${aluno.serie}</td>
            <td>${aluno.dataEmprestimo || 'N/A'}</td>
            <td>${aluno.motivo || 'N/A'}</td>
            <td>${aluno.livros ? aluno.livros.map(l => l.titulo).join(', ') : 'Nenhum'}</td>
            <td>
                <button onclick="editarAluno(${aluno.id})">Editar</button>
                <button onclick="deletarAluno(${aluno.id})">Deletar</button>
            </td>
        `;
        document.getElementById('alunosList').appendChild(tr);
    } catch (error) {
        alert(error.message);
    }
};

// Função para incluir um novo aluno
const incluirAluno = async (aluno) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aluno),
        });
        if (!response.ok) throw new Error('Erro ao incluir aluno');

        alert('Aluno incluído com sucesso!');
        listAllAlunos(); // Atualiza a lista de alunos
    } catch (error) {
        console.error('Erro ao incluir aluno:', error);
        alert('Erro ao incluir o aluno. Tente novamente mais tarde.');
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    listAllAlunos(); // Chama a função para listar todos os alunos ao carregar a página

    // Evento para o botão de buscar aluno
    document.getElementById('buscarAluno').addEventListener('click', () => {
        const idAluno = document.getElementById('alunoId').value;
        buscarAlunoPorId(idAluno);
    });

    // Evento para o botão de adicionar aluno
    document.getElementById('adicionarAluno').addEventListener('click', () => {
        const aluno = {
            name: document.getElementById('name').value,
            serie: document.getElementById('serie').value,
            dataEmprestimo: document.getElementById('dataEmprestimo').value,
            motivo: document.getElementById('motivo').value,
        };
        incluirAluno(aluno);
    });
    
    // Função para desassociar um livro de um aluno
const desassociarLivro = async (idAluno, tituloLivro) => {
    try {
        const response = await fetch(`${url}/dessasociar/${idAluno}/${tituloLivro}`, {
            method: 'PUT',
        });
        if (response.ok) {
            alert(`Livro "${tituloLivro}" desassociado do aluno de ID ${idAluno}.`);
        } else {
            // Se o ID do aluno não for encontrado, alerta o usuário
            alert(`Erro: Não foi possível desassociar o livro. Verifique se o ID do aluno "${idAluno}" existe.`);
        }
    } catch (error) {
        console.error('Erro ao desassociar livro do aluno:', error);
        alert('Erro ao desassociar o livro. Tente novamente mais tarde.');
    }
};

    // Evento para o botão de desassociar
    document.getElementById('desassociarButton').addEventListener('click', () => {
        const idAluno = document.getElementById('desassociarAlunoId').value;
        const tituloLivro = document.getElementById('tituloLivro').value;
        desassociarLivro(idAluno, tituloLivro);
    });
});
