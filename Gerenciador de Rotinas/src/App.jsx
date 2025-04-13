import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para controlar a visibilidade do formulário das rotinas
  const [formulario, setFormulario] = useState(false);

  // Estado para armazenar todas as rotinas
  const [listaRotinas, setListaRotinas] = useState([]);

  // Estado para armazenar os dados da rotina
  const [rotina, setRotina] = useState({
    nome: '',
    objetivo: '',
    dataDeExecucao: '',
    horarioDeExecucao: '', 
    tempoDecorrido: null, 
    horarioConclusao: null 
  });

  // Estado que armazena os comentários
  const [comentarios, setComentarios] = useState({});

  // Estado para armazenar a pesquisa digitada pelo usuário
  const [termoDePesquisa, setTermoDePesquisa] = useState('');

  // Estado para armazenar a mensagem de parabens
  const [mensagem, setMensagem] = useState('');

  // Estado para controlar se uma nova rotina foi concluída
  const [ultimaRotinaConcluida, setUltimaRotinaConcluida] = useState(null);

  // Função para lidar com mudanças nos campos de entrada do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRotina({
      ...rotina,
      [name]: value, // Atualiza o valor do campo correspondente
    });
  };

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRoutine = {
      ...rotina,
      id: Date.now(), // Gera um ID único
      concluido: false,
      tempoDecorrido: null,
      horarioConclusao: null,
    };
    setListaRotinas([...listaRotinas, newRoutine]);
    setRotina({
      nome: '',
      objetivo: '',
      dataDeExecucao: '',
      horarioDeExecucao: '',
      tempoDecorrido: null,
      horarioConclusao: null,
    });
    setFormulario(false);
  };

  // Função para alternar o status de conclusão da rotina
  const toggleTaskCompletion = (id) => {
    const updatedTasks = [...listaRotinas];
    const rotinaToUpdate = updatedTasks.find((rotina) => rotina.id === id);

    if (!rotinaToUpdate.concluido) {
      rotinaToUpdate.concluido = true;
      rotinaToUpdate.horarioConclusao = new Date(); // Hora da cocnlusao

      // Atualiza o estado de última rotina concluída
      setUltimaRotinaConcluida(rotinaToUpdate);
    } else {
      rotinaToUpdate.concluido = false;
      rotinaToUpdate.horarioConclusao = null; // Limpa o horário de conclusao
    }

    setListaRotinas(updatedTasks);
  };

  // Função para excluir rotina
  const deleteRoutine = (id) => {
    const updatedTasks = listaRotinas.filter((rotina) => rotina.id !== id);
    setListaRotinas(updatedTasks);
    // Também excluir o comentário associado
    setComentarios((prev) => {
      const updatedComentarios = { ...prev };
      delete updatedComentarios[id];
      return updatedComentarios;
    });
  };

  // Filtra as rotinas com base na pesquisa
  const rotinasFiltradas = listaRotinas.filter((rotina) =>
    rotina.nome.toLowerCase().includes(termoDePesquisa.toLowerCase())
  );

  // useEffect para exibir a mensagem de parabenização quando uma rotina for concluída
  useEffect(() => {
    if (ultimaRotinaConcluida) {
      setMensagem('Parabéns! Você concluiu sua rotina');
      setTimeout(() => {
        setMensagem('');
      }, 3000);
    }
  }, [ultimaRotinaConcluida]);

  // useEffect para iniciar o temporizador quando o horário de execução for alcançado
  useEffect(() => {
    const timers = listaRotinas.map((rotina, index) => {
      if (!rotina.concluido && rotina.dataDeExecucao && rotina.horarioDeExecucao) {
        const execucaoDateTime = new Date(`${rotina.dataDeExecucao}T${rotina.horarioDeExecucao}`);
        const now = new Date();

        if (execucaoDateTime <= now) {
          const timerId = setInterval(() => {
            const updatedTasks = [...listaRotinas];
            const timeElapsed = Math.max(0, new Date() - execucaoDateTime); // Garante que o tempo não seja negativo
            updatedTasks[index].tempoDecorrido = timeElapsed;
            setListaRotinas(updatedTasks);
          }, 1000);

          return { timerId, index };
        }
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearInterval(timer.timerId);
      });
    };
  }, [listaRotinas]);

  // Função para formatar o tempo decorrido em horas, minutos e segundos
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Organizando as rotinas para mostrar as não concluídas primeiro
  const listaRotinasOrdenadas = [
    ...listaRotinas.filter(rotina => !rotina.concluido),
    ...listaRotinas.filter(rotina => rotina.concluido),
  ];

  // Função para lidar com o envio de um comentário
  const handleCommentChange = (id, comment) => {
    setComentarios((prev) => ({
      ...prev,
      [id]: comment, // Usa o id da rotina
    }));
  };

  return (
    <div className="container-principal">
      <div className="app">
        <div className="rotina">
          <h1>Minhas Rotinas</h1>
        </div>

        <div className="seccao-rotina">
          {formulario && (
            <form className="formulario-rotina" onSubmit={handleFormSubmit}>
              <div className="grupo-formulario">
                <label>Nome da Rotina:</label>
                <input
                  className="campo-input"
                  type="text"
                  name="nome"
                  value={rotina.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grupo-formulario">
                <label>Objetivo:</label>
                <input
                  className="campo-input"
                  type="text"
                  name="objetivo"
                  value={rotina.objetivo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grupo-formulario">
                <label>Data de Execução:</label>
                <input
                  className="campo-input"
                  type="date"
                  name="dataDeExecucao"
                  value={rotina.dataDeExecucao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grupo-formulario">
                <label>Hora de Execução:</label>
                <input
                  className="campo-input"
                  type="time"
                  name="horarioDeExecucao"
                  value={rotina.horarioDeExecucao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="botao-submit">Salvar Rotina</button>
            </form>
          )}
        </div>

        <button className="adicionar-rotina" onClick={() => setFormulario(!formulario)}>
          Nova Rotina
        </button>

        {mensagem && (
          <div className="mensagem-parabens">
            <strong>{mensagem}</strong>
          </div>
        )}

        <div className="seccao-pesquisa">
          <input
            className="campo-pesquisa"
            type="text"
            placeholder="Pesquise uma rotina"
            value={termoDePesquisa}
            onChange={(e) => setTermoDePesquisa(e.target.value)}
          />
        </div>

        <ul className="lista-rotina">
          {rotinasFiltradas.length === 0 ? (
            <li className="rotina-vazia">Não há nenhuma rotina</li>
          ) : (
            rotinasFiltradas.map((rotina) => (
              <li key={rotina.id} className={`item-rotina ${rotina.concluido ? 'concluida' : ''}`}>
                <div className="rotina-info">
                  <strong>{rotina.nome}</strong> - {rotina.objetivo} (Execução: {rotina.dataDeExecucao} às {rotina.horarioDeExecucao})
                </div>
                <input
                  className="checkbox-rotina"
                  type="checkbox"
                  checked={rotina.concluido}
                  onChange={() => toggleTaskCompletion(rotina.id)} // Alterna o status de concluída
                />
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Exibição das rotinas e campo de comentário */}
      <div className="edit">
        <div className="texto-edit">
          <h1 className="titulo-edit">Lista das suas rotinas!</h1>
          <p>As rotinas concluidas serão movidas para o final da lista!</p>
        </div>
        <ul className="lista-rotina">
          {listaRotinasOrdenadas.length === 0 ? (
            <li className="rotina-vazia">Não há nenhuma rotina cadastrada</li>
          ) : (
            listaRotinasOrdenadas.map((rotina) => (
              <li key={rotina.id} className={`item-rotinaa ${rotina.concluido ? 'concluida' : ''}`}>
                <div className="rotina-info">
                  <strong>{rotina.nome}</strong>
                </div>
                {/* Campo do comentário */}
                <textarea
                  className="comentario-rotina"
                  placeholder="Adicione um comentário..."
                  value={comentarios[rotina.id] || ''}
                  onChange={(e) => handleCommentChange(rotina.id, e.target.value)}
                />
                {rotina.tempoDecorrido !== null ? (
                  <p>Tempo decorrido: {formatTime(rotina.tempoDecorrido)}</p>
                ) : (
                  <p>Aguardando execução...</p>
                )}
                <button className="botao-excluir" onClick={() => deleteRoutine(rotina.id)}>
                  Excluir
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;




