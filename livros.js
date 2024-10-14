const apiUrlLivros = 'http://localhost:8081/livro'; // URL para LivroController
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
            renderLivros();
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
    if (tituloInput == "" || autorInput == "" || quantidadeInput == "") {
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
            window.location.href = 'F:\Estudos\Projeto Integrador II\FrontEnd\livros.html'; // Redireciona para a página de listagem de livros
        }
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
    }
};

// Função para deletar um livro
const deleteLivro = async (titulo) => {
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
                <a href="editar-livro.html?autor=${encodeURIComponent(livro.autor)}&titulo=${encodeURIComponent(livro.titulo)}&quantidade=${livro.quantidade}">Editar</a>
                <button onclick="deleteLivro('${livro.titulo}')">Deletar</button>
            </td>
        `;
        livrosList.appendChild(tr);
    });
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

    // Usando os novos IDs para busca por título e autor
    document.getElementById('findByTitleButton').addEventListener('click', () => {
        const tituloBusca = document.getElementById('tituloInputBusca').value; // Usar o ID correto
        findLivroByTitulo(tituloBusca); // Buscar livro pelo título correto
    });

    document.getElementById('findByAuthorButton').addEventListener('click', () => {
        const autorBusca = document.getElementById('autorInputBusca').value; // Usar o ID correto
        findLivroByAutor(autorBusca); // Buscar livro pelo autor correto
    });

    document.getElementById('findButton').addEventListener('click', () => findLivroByISBN(isbn));
    document.getElementById('createButton').addEventListener('click', createLivro);
};

// Inicializa o aplicativo
const init = () => {
    setupEventListeners();
    listAllLivros(); // Carrega livros ao iniciar
};

document.addEventListener('DOMContentLoaded', init);
