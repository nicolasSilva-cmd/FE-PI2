const url = 'https://3.129.7.57/alunos'; // URL da API de alunos

// Função para carregar os dados do aluno que será editado
const carregarDadosAluno = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        try {
            const response = await fetch(`${url}/${id}`);
            if (!response.ok) throw new Error('Erro ao carregar dados do aluno');

            const aluno = await response.json();
            document.getElementById('alunoId').value = aluno.id;
            document.getElementById('name').value = aluno.name;
            document.getElementById('serie').value = aluno.serie;
            document.getElementById('dataEmprestimo').value = aluno.dataEmprestimo || '';
            document.getElementById('motivo').value = aluno.motivo || '';
        } catch (error) {
            console.error('Erro ao carregar aluno:', error);
        }
    }
};

// Função para salvar as alterações feitas no aluno
const salvarAlteracoes = async () => {
    const id = document.getElementById('alunoId').value;
    const name = document.getElementById('name').value;
    const serie = document.getElementById('serie').value;
    const dataEmprestimo = document.getElementById('dataEmprestimo').value;
    const motivo = document.getElementById('motivo').value;

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, serie, dataEmprestimo, motivo })
        });
        if (!response.ok) throw new Error('Erro ao salvar alterações');

        alert('Alterações salvas com sucesso!');
        window.location.href = 'alunos.html'; // Redireciona de volta para a listagem
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', carregarDadosAluno);
document.getElementById('salvarAlteracoes').addEventListener('click', salvarAlteracoes);
