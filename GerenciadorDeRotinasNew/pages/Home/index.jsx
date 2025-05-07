import { useState, useEffect } from 'react';
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import '../Home/style.css';


export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const [formulario, setFormulario] = useState(false);
  const [listaRotinas, setListaRotinas] = useState([]);
  const [rotina, setRotina] = useState({
    nome: '',
    objetivo: '',
    dataDeExecucao: '',
    horarioDeExecucao: '',
    tempoDecorrido: null,
    horarioConclusao: null
  });
  const [comentarios, setComentarios] = useState({});
  const [termoDePesquisa, setTermoDePesquisa] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [ultimaRotinaConcluida, setUltimaRotinaConcluida] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRotina({
      ...rotina,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRoutine = {
      ...rotina,
      id: Date.now(),
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

  const toggleTaskCompletion = (id) => {
    const updatedTasks = [...listaRotinas];
    const rotinaToUpdate = updatedTasks.find((rotina) => rotina.id === id);

    if (!rotinaToUpdate.concluido) {
      rotinaToUpdate.concluido = true;
      rotinaToUpdate.horarioConclusao = new Date();
      setUltimaRotinaConcluida(rotinaToUpdate);
    } else {
      rotinaToUpdate.concluido = false;
      rotinaToUpdate.horarioConclusao = null;
    }

    setListaRotinas(updatedTasks);
  };

  const deleteRoutine = (id) => {
    const updatedTasks = listaRotinas.filter((rotina) => rotina.id !== id);
    setListaRotinas(updatedTasks);
    setComentarios((prev) => {
      const updatedComentarios = { ...prev };
      delete updatedComentarios[id];
      return updatedComentarios;
    });
  };

  const rotinasFiltradas = listaRotinas.filter((rotina) =>
    rotina.nome.toLowerCase().includes(termoDePesquisa.toLowerCase())
  );

  useEffect(() => {
    if (ultimaRotinaConcluida) {
      setMensagem('Parabéns! Você concluiu sua rotina');
      setTimeout(() => {
        setMensagem('');
      }, 3000);
    }
  }, [ultimaRotinaConcluida]);

  useEffect(() => {
    const timers = listaRotinas.map((rotina, index) => {
      if (!rotina.concluido && rotina.dataDeExecucao && rotina.horarioDeExecucao) {
        const execucaoDateTime = new Date(`${rotina.dataDeExecucao}T${rotina.horarioDeExecucao}`);
        const now = new Date();

        if (execucaoDateTime <= now) {
          const timerId = setInterval(() => {
            const updatedTasks = [...listaRotinas];
            const timeElapsed = Math.max(0, new Date() - execucaoDateTime);
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

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const listaRotinasOrdenadas = [
    ...listaRotinas.filter(rotina => !rotina.concluido),
    ...listaRotinas.filter(rotina => rotina.concluido),
  ];

  const handleCommentChange = (id, comment) => {
    setComentarios((prev) => ({
      ...prev,
      [id]: comment,
    }));
  };

  return (
    <div className="container-principal">
      <button onClick={handleLogout} className="adicionar-rotina">Sair</button>

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
                  onChange={() => toggleTaskCompletion(rotina.id)}
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="edit">
        <div className="texto-edit">
          <h1 className="titulo-edit">Lista das suas rotinas!</h1>
          <p>As rotinas concluidas serão movidas para o final da lista!</p>
        </div>
        <ul className="lista-rotina">
          {listaRotinasOrdenadas.length === 0 ? (
            <li className="rotina-vazia">Não há nenhuma rotina cadastrada.</li>
          ) : (
            listaRotinasOrdenadas.map((rotina) => (
              <li key={rotina.id} className={`item-rotina ${rotina.concluido ? 'concluida' : ''}`}>
                <div className="rotina-info">
                  <strong>{rotina.nome}</strong> - {rotina.objetivo} (Execução: {rotina.dataDeExecucao} às {rotina.horarioDeExecucao})
                </div>
                {rotina.tempoDecorrido !== null && (
                  <div className="tempo-decorrido">Tempo: {formatTime(rotina.tempoDecorrido)}</div>
                )}
                {rotina.concluido && rotina.horarioConclusao && (
                  <div className="horario-conclusao">Concluído em: {rotina.horarioConclusao.toLocaleString()}</div>
                )}
                <textarea
                  className="comentario"
                  placeholder="Adicione um comentário..."
                  value={comentarios[rotina.id] || ''}
                  onChange={(e) => handleCommentChange(rotina.id, e.target.value)}
                />
                <button className="botao-excluir" onClick={() => deleteRoutine(rotina.id)}>Excluir</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
