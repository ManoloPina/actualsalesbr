'use strict';

const Validator = require('validator');
const _ = require('underscore');
const DateFormat = require('dateFormat');

class LeadController extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.nomeText = '';
    this.state.alertNome = '';
    this.state.alertNascimento = '';
    this.state.alertEmail = '';
    this.state.alertTelefone = '';
    this.state.region = '';
  }


  get $nameText() {
    return $(this.refs.nomeText);
  }

  get $nascimentoText() {
    return $(this.refs.nascimentoText);
  }

  get $emailText() {
    return $(this.refs.emailText);
  }

  get $telefoneText() {
    return $(this.refs.telefoneText);
  }

  get $regionText() {
    return $(this.refs.regionText);
  }

  get $sendButton() {
    return $(this.refs.sendButton);
  }

  get $secondForm() {
    return $(this.refs.secondForm);
  }

  get $alertNome() {
    return $(this.refs.alertNome);
  }

  get $alertNascimento() {
    return $(this.refs.alertNascimento);
  }

  get $alertEmail() {
    return $(this.refs.alertEmail);
  }

  get $alertTelefone() {
    return $(this.refs.alertTelefone);
  }

  get secondForm() {

    return (
      <div className="hidden" ref="secondForm">
        <label>Região:</label>
        <div className="form-group">
          <select className="form-control" defaultValue={this.state.region} ref="regionText">
          <option>Porto Alegre</option>
          <option>Curitiba</option>
          <option>São Paulo</option>
          <option>Centro Oeste</option>
          <option>Salvador</option>
          <option>Recife</option>
          <option>Sem disponibilidade</option>
        </select>
        </div>

        <div className="form-group">
          <button ref="sendButton" className="btn btn-success">Enviar</button>
        </div>

      </div>
    );
  }

  get regions() {
    return {
      sul: ['Porto Alegre', 'Curitiba'],
      sudeste: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
      nordeste: ['Salvador', 'Recife'],
      norte: 'Sem disponibilidade'
    };
  }


  componentDidMount() {

    console.log(DateFormat(new Date(), 'isoDate'));

    this.$telefoneText.on('keypress', () => {
      if(this.$telefoneText.inputmask('unmaskedvalue').length >= 7) this.openSecondStep();
    });

    this.$sendButton.on('click', (event) => {
      event.preventDefault();

      new Promise((resolve, reject) => {
        if(!this.checkFields()) resolve();
      })
      .then(() => {
        return this.sendLeads();
      }).catch(err => {
        console.log('err', err)
      });

    });

    this.setMasks();
  }

  setMasks() {
    this.$nascimentoText.inputmask('99/99/9999');
    this.$telefoneText.inputmask('9999-9999');
  }

  calcPoints() {
    let region = this.$regionText.val();
    let age = new Date(this.$nascimentoText.val()).getFullYear() - 2016;
    age < 0 ? age = age*-1 : age = age;

    let regionKeys = _.keys(this.regions);
    let points = 10;

    return new Promise((resolve, reject) => {
      regionKeys.forEach(item => {
        if($.inArray(region, this.regions[item]) != -1) resolve(item);
      });
    })
    .then(region => {
      return new Promise((resolve, reject) => {
        switch(region) {
          case 'sul':
            resolve(points += -2);
          break;

          case 'sudeste':
            resolve(points += -1);
          break;

          case 'centro-oeste':
            resolve(points += -3);
          break;

          case 'centro-oeste':
            resolve(points += -3);
          break;

          case 'Nordeste':
            resolve(points += -4);
          break;

          case 'Norte':
            resolve(points += -5);
          break;
        }
      });
    })
    .then(points => {
      return new Promise((resolve, reject) => {
        if(age >= 40 && age <= 99) {
          resolve(points += -3)
        }else if(age >= 18 && age <= 39) {
          resolve(points);
        }else if(age >= 100 || age < 18) {
          resolve(points += -5);
        }
      });
    });

  }


  getRegion(city) {
    let regionKeys = _.keys(this.regions);
    return new Promise((resolve, reject) => {
      regionKeys.forEach(item => {
        if($.inArray(this.$regionText.val(), this.regions[item]) != -1) resolve(item);
      });
    });
  }

  sendLeads() {

    return new Promise((resolve, reject) => {

      console.log('telefone', this.$telefoneText.inputmask('unmaskedvalue'));
      this.getRegion(this.$regionText.val()).then(region => {

        this.calcPoints().then(points => {
          $.ajax({
            url: 'http://api.actualsales.com.br/join-asbr/ti/lead',
            type: 'post',
            data: {
              nome: this.$nameText.val(),
              email: this.$emailText.val(),
              telefone: this.$telefoneText.val(),
              regiao: region,
              unidade: this.$regionText.val(),
              data_nascimento: DateFormat(new Date(this.$nascimentoText.val()), 'isoDate'),
              score: points,
              token: '157c678bb77b114f0382e532bab90fb0'
            }
          })
          .done(data => {
            resolve(data);
          })
          .fail(err => {
            reject(err);
          });
        });

      });
    })
    .then(() => {
      new Promise((resolve, reject) => {

        $.ajax({
          url: 'http://localhost:8080/leads/store',
          type: 'post',
          data: {
            nome: this.$nameText.val(),
            email: this.$emailText.val(),
            telefone: this.$telefoneText.val(),
            regiao: this.$regionText.val(),
            data_nascimento: DateFormat(new Date(this.$nascimentoText.val()), 'isoDate'),
            score: points
          }
        })
        .done(data => {
          resolve(data);
        })
        .fail(err => {
          reject(err);
        });
      });

    });

  }

  showAllert($element) {
    $element.removeClass('hidden');
    setTimeout(() => {
      $element.addClass('hidden');
      this.setState({
        alertNome: '',
        alertNascimento: '',
        alertEmail: '',
        alertTelefone: ''
      });
    }, 5000);
  }

  checkFields(event) {

    let count = 0;

    if(!_.isEmpty(this.$nameText.val())) {
      let name = this.$nameText.val();
      let words = name.split(' ');
      if(words.length < 2 && Validator.isAlpha(name)) {
        this.setState({alertNome: "O campo deve ser composto de nome e sobrenome"});
        this.showAllert(this.$alertNome);
        count++;
      }
    }

    if(_.isEmpty(this.$nameText.val())) {
      this.setState({alertNome: "Esse campo deve ser preenchido"});
      this.showAllert(this.$alertNome);
      count++;
    }
    if(_.isEmpty(this.$nascimentoText.val())) {
      this.setState({alertNascimento: 'Esse campo deve ser preenchido'});
      this.showAllert(this.$alertNascimento);
      count++;
    }
    if(!Validator.isDate(this.$nascimentoText.val())) {
      this.setState({alertNascimento: 'Informe uma data válida'});
      this.showAllert(this.$alertNascimento);
      count++;
    }
    if(_.isEmpty(this.$emailText.val())) {
      this.setState({alertEmail: 'Esse campo deve se preenchido'});
      this.showAllert(this.$alertEmail);
      count++;
    }
    if(!Validator.isEmail(this.$emailText.val())) {
      this.setState({alertEmail: "Não é um email válido"});
      this.showAllert(this.$alertEmail);
      count++;
    }

    if(_.isEmpty(this.$telefoneText.val())) {
      this.setState({alertEmail: 'Esse campo deve se preenchido'});
      this.showAllert(this.$alertEmail);
      count++;
    }

    return count;
  }

  openSecondStep() {

    let inputs = {
      name: this.$nameText.val(),
      nascimento: this.$nascimentoText.val(),
      email: this.$emailText.val(),
      telefone: this.$telefoneText.val()
    };

    if(!_.isEmpty(inputs.name)
    && !_.isEmpty(inputs.nascimento)
    && !_.isEmpty(inputs.email)
    && !_.isEmpty(inputs.telefone)) {
      console.log('second form', this.$secondForm);
      this.$secondForm.removeClass('hidden');
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1 className="text-primary">Leads Form</h1>
            <form>

              <div className="form-group">
                <label className="text-muted">Nome:</label>
                <input type="text" name="nome" ref="nomeText" className="form-control"/>
              </div>

              <p className="hidden bg-danger text-muted" ref="alertNome">{this.state.alertNome}</p>

              <div className="form-group">
                <label className="text-muted">Data de nascimento:</label>
                <input type="text" name="data_nascimento" ref="nascimentoText" className="form-control"/>
              </div>

              <p className="hidden bg-danger text-muted" ref="alertNascimento">{this.state.alertNascimento}</p>

              <div className="form-group">
                <label className="text-muted">Email:</label>
                <input type="text" name="email" ref="emailText" className="form-control"/>
              </div>

              <p className="hidden bg-danger text-muted" ref="alertEmail">{this.state.alertEmail}</p>

              <div className="form-group">
                <label className="text-muted">Telefone:</label>
                <input type="text" name="telefone" ref="telefoneText" className="form-control"/>
              </div>

              <p className="hidden bg-danger text-muted" ref="alertTelefone">{this.state.alertTelefone}</p>


              {this.secondForm}

            </form>
          </div>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<LeadController/>, $('#lead-content').get(0));
