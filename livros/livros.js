const apiUrlLivros = 'http://localhost:8081/livro';
const apiUrlAlunos = 'http://localhost:8081/alunos'; // URL para LivroController
const apiUrlApi = 'http://localhost:8081/google-api'; // URL para ApiController

let livros = [];
let titulo = null;
let autor = null;
let quantidade = 1;
let isbn = '';

// Função para listar todos os livros
const listAllLivros = async () => {
    try {
        const response = await fetch(apiUrlLivros);
        if (response.ok) {
            livros = await response.json();
            renderLivros(); // Renderiza a lista de livros
        }
    } catch (error) {
        console.error('Erro ao listar livros:', error);
    }
};

// Função para buscar livro por título
const findLivroByTitulo = async (titulo) => {
    try {
        const response = await fetch(`${apiUrlLivros}/titulo/${titulo}`);
        if (response.ok) {
            const livrosEncontrados = await response.json(); // Obter a lista de livros
            if (livrosEncontrados.length > 0) { // Verifica se a lista não está vazia
                livros = livrosEncontrados; // Armazenar os livros encontrados
                renderLivros(); // Renderizar os livros encontrados
            } else {
                alert('Nenhum livro encontrado com esse título.');
                listAllLivros(); // Retorna a lista completa
            }
        } else {
            alert('Erro ao buscar livro.');
            listAllLivros();
        }
    } catch (error) {
        console.error('Erro ao buscar livro por título:', error);
        listAllLivros();
    }
};

// Função para buscar livro por autor
const findLivroByAutor = async (autor) => {
    try {
        const response = await fetch(`${apiUrlLivros}/autor/${autor}`);
        if (response.ok) {
            livros = await response.json(); // Armazenar os livros do autor encontrado
            renderLivros(); // Renderizar os livros encontrados
        }
    } catch (error) {
        console.error('Erro ao buscar livro por autor:', error);
        listAllLivros();
    }
};

// Função para criar um novo livro
const createLivro = async () => {
    // Atualizando os valores dos campos diretamente dos inputs antes de validar
    const tituloInput = document.getElementById('tituloInput').value;
    const autorInput = document.getElementById('autorInput').value;
    const quantidadeInput = document.getElementById('quantidadeInput2').value;

    // Verifica se todos os campos estão preenchidos
    if (tituloInput === "" || autorInput === "" || quantidadeInput === "") {
        alert('Erro: Todos os campos (título, autor, quantidade) devem ser preenchidos.');
        return;
    }

    const newLivro = { titulo: tituloInput, autor: autorInput, quantidade: quantidadeInput };
    try {
        const response = await fetch(apiUrlLivros, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLivro),
        });
        if (response.ok) {
            console.log('Livro criado:', await response.json());
            listAllLivros(); // Atualiza a lista após criação
            limparCampos(); // Limpa os campos após cadastrar
        }
    } catch (error) {
        console.error('Erro ao criar livro:', error);
    }
};

// Função para atualizar a quantidade de um livro
const updateLivro = async (titulo, novaQuantidade) => {
    try {
        const response = await fetch(`${apiUrlLivros}/${titulo}?quantidade=${novaQuantidade}`, {
            method: 'PUT',
        });
        if (response.ok) {
            alert('Livro atualizado com sucesso!');
            window.location.href = 'F:\\Estudos\\Projeto Integrador II\\FrontEnd\\livros.html'; // Redireciona para a página de listagem de livros
        }
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
    }
};

// Função para deletar um livro
const deleteLivro = async (titulo) => {
    if (confirm(`Tem certeza que deseja excluir o livro ${titulo}?`)) {
        try {
            const response = await fetch(`${apiUrlLivros}/${titulo}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Livro deletado');
                listAllLivros(); // Atualiza a lista após deleção
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
        }
    }
};

// Função para associar um livro a um aluno
const associarLivroAoAluno = async (idAluno, tituloLivro) => {
    try {
        const response = await fetch(`${apiUrlAlunos}/associar/${idAluno}/${tituloLivro}`, {
            method: 'PUT',
        });
        if (response.ok) {
            alert(`Livro "${tituloLivro}" associado ao aluno de ID ${idAluno}.`);
        } else {
            alert(`Erro: Não foi possível associar o livro. Verifique se o ID do aluno "${idAluno}" existe.`);
        }
    } catch (error) {
        console.error('Erro ao associar livro ao aluno:', error);
        alert('Erro ao associar o livro. Tente novamente mais tarde.');
    }
};

// Função para buscar livro por ISBN
const findLivroByISBN = async (isbn) => {
    try {
        const response = await fetch(`${apiUrlApi}/?isbn=${isbn}`);
        if (!response.ok) throw new Error('Erro ao encontrar livro');
        const livro = await response.json();
        displayLivroDetails(livro);
    } catch (error) {
        console.error('Erro ao encontrar livro:', error);
        document.getElementById('livroDetalhes').textContent = 'Livro não encontrado.';
    }
};

// Função para salvar livro com base no ISBN
const saveLivroByISBN = async (isbn, quantidade) => {
    try {
        const response = await fetch(`${apiUrlApi}/post/?isbn=${isbn}&quantidade=${quantidade}`, {
            method: 'GET',
        });
        if (response.ok) {
            alert('Livro salvo com sucesso!');
            listAllLivros(); // Atualiza a lista após salvar o livro
        } else {
            alert('Erro ao salvar o livro.');
        }
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
    }
};

// Função para exibir os detalhes do livro encontrado
const displayLivroDetails = (livro) => {
    document.getElementById('livroEncontrado').style.display = 'block';
    document.getElementById('autor').textContent = `Autor: ${livro.autor}`;
    document.getElementById('titulo').textContent = `Título: ${livro.titulo}`;
    document.getElementById('quantidadeInput').value = livro.quantidade || 1;

    // Adiciona o evento de clique no botão de salvar
    document.getElementById('saveButton').onclick = () => {
        const quantidade = document.getElementById('quantidadeInput').value;
        saveLivroByISBN(livro.isbn, quantidade);
    };
};

// Função para renderizar a lista de livros na tabela
const renderLivros = () => {
    const livrosList = document.getElementById('livrosList').getElementsByTagName('tbody')[0];
    livrosList.innerHTML = ''; // Limpa a tabela antes de inserir os livros

    if (livros.length === 0) {
        livrosList.innerHTML = '<tr><td colspan="4">Nenhum livro encontrado</td></tr>';
        return;
    }

    livros.forEach(livro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${livro.autor ? livro.autor : 'Autor não informado'}</td>
            <td>${livro.titulo ? livro.titulo : 'Título não informado'}</td>
            <td>${livro.quantidade ? livro.quantidade : '0'}</td>
            <td>
                <button onclick="editarLivro('${livro.autor}', '${livro.titulo}', '${livro.quantidade}')">Editar</button>
                <button onclick="deleteLivro('${livro.titulo}')">Deletar</button>
            </td>
        `;
        livrosList.appendChild(tr);
    });
};

// Função para editar um livro
const editarLivro = (autor, titulo, quantidade) => {
    window.location.href = `editar-livro.html?autor=${encodeURIComponent(autor)}&titulo=${encodeURIComponent(titulo)}&quantidade=${quantidade}`;
};

// Função para limpar os campos após cadastrar
const limparCampos = () => {
    document.getElementById('tituloInput').value = '';
    document.getElementById('autorInput').value = '';
    document.getElementById('quantidadeInput2').value = '';
};

// Função para configurar os eventos
const setupEventListeners = () => {
    document.getElementById('isbnInput').addEventListener('input', (e) => {
        isbn = e.target.value;
    });

    document.getElementById('tituloInput').addEventListener('input', (e) => {
        titulo = e.target.value;
    });

    document.getElementById('autorInput').addEventListener('input', (e) => {
        autor = e.target.value;
    });

    document.getElementById('quantidadeInput2').addEventListener('input', (e) => {
        quantidade = e.target.value;
    });

    document.getElementById('findButton').addEventListener('click', () => {
        const isbnInput = document.getElementById('isbnInput').value;
        if (isbnInput) {
            findLivroByISBN(isbnInput);
        } else {
            alert('Por favor, insira um ISBN.');
        }
    });

    document.getElementById('createButton').addEventListener('click', () => {
        createLivro();
    });

    document.getElementById('associarButton').addEventListener('click', () => {
        const alunoId = document.getElementById('alunoIdInput').value;
        const tituloLivro = document.getElementById('livroTituloInput').value;

        if (alunoId && tituloLivro) {
            associarLivroAoAluno(alunoId, tituloLivro);
        } else {
            alert('Por favor, insira o ID do aluno e o título do livro.');
        }
    });
};

// Inicializa a lista de livros
listAllLivros();
setupEventListeners();
