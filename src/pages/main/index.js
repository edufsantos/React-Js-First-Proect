import React, {Component} from 'react';
import { FaGithubAlt,FaPlus,FaSpinner} from 'react-icons/fa';
import api from   '../../services/api';
import Page from 'react-page-loading';
import Container from '../../componnets/container/index';
import { Form, SubmitButton,List} from './styles';
import {Link } from 'react-router-dom';

export default class Main extends Component{
  state = {
    newRepo:'',
    repositorios:[],
    loading: false
  }

  //ocal storage
  //carregar dados do localstorage
  componentDidMount(){
    const repositorios = localStorage.getItem('repositorios');
    if(repositorios){
      this.setState({ repositorios: JSON.parse(repositorios)})
    }
  }

  //salvar dados do localstorage
  componentDidUpdate(_,prevState){
    const {repositorios} = this.state;
    if(prevState.repositorios !== repositorios){
      localStorage.setItem('repositorios', JSON.stringify(repositorios))
    }
  }



  handleInputChange = e =>{
    this.setState({newRepo: e.target.value})
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({loading: true});
    const { newRepo, repositorios } = this.state;

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositorios: [...repositorios, data],
      newRepo: '',
      loading: false
    });
  }
  render(){
    const { newRepo, loading, repositorios } = this.state;

    return(
        <div>
        <Page loader={"bubble"} color={"white"} size={4}>
            <Container>
              <h1>
                <FaGithubAlt/>
                Repositorios
              </h1>
            <Form onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Adcionar Repositório "
                value={newRepo}
                onChange={this.handleInputChange}
              />
              <SubmitButton loading={loading}>
                {/* if ternario */}
                { loading ? <FaSpinner color="#fff" size="14"/> : <FaPlus color="#fff" size={14}/> }
              </SubmitButton>
            </Form>
            <List>
              {repositorios.map(repo=>(
                // elemento que vem dentro de um .map obrigatóriamente deve ser passado uma key como no li abaixo
                <li key={repo.name}>
                  <span>{repo.name}</span>
                  <Link to={`/repository/${encodeURIComponent(repo.name)}`}>Ver Mais</Link>
                </li>
              ))}
            </List>
          </Container>
        </Page>
        </div>
    );
  }
}
