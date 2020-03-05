import React, {Component} from 'react';
import api  from  '../../services/api';
import PropTypes from  'prop-types';
import Container from '../../componnets/container';
import {Link} from 'react-router-dom';

import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component{
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repositorio: {},
    issues:[],
    loading: true,
  }

  async componentDidMount(){
    const  { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    //promisse faz as chamadas de maneira simultanea como a seguir, sendo retornado um array para as suas devidas chamadas
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`,{
        params: {
          state: 'open',
          per_page: 5,
        }
      })
    ]);

    this.setState({
      repositorio: repository.data,
      issues: issues.data,
      loading: false
    })
  }

  render(){
    const {repositorio, issues, loading} = this.state;

    if(loading){
      return <Loading>Carregando</Loading>
    }

    return (
    <Container>
      <Owner>
        <Link to="/">Voltar</Link>
        <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login}/>
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
      </Owner>

      <IssueList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login}/>
           <div>
             <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {/* LABES */}
                {issue.labels.map(label=>(
                  <span key={String(label.id)}>{label.name}</span>
                ))}

             </strong>
              <p>{issue.user.login}</p>
           </div>
          </li>
        ))}
      </IssueList>
    </Container>);
  }
}

