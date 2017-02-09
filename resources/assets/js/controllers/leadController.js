'use strict';

class LeadController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.nomeText = '';
    this.state.alert = {
      nome:''
    };
  }


  get $nameText() {
    return $(this.refs.nameText);
  }

  componentDidMount() {
    this.$nameText.on('focusout', this.checkFields.bind(this));
  }

  checkFields() {
    if(!this.$nameText.val() != '') {
      let name = this.$nameText.val();
      let words = name.split(' ');
      if(words.length < 1) {
        this.setState()
      }
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

              <div className="form-group">
                <label className="text-muted">Data de nascimento:</label>
                <input type="text" name="data_nascimento" className="form-control"/>
              </div>

              <div className="form-group">
                <label className="text-muted">Email:</label>
                <input type="text" name="email" className="form-control"/>
              </div>

              <div className="form-group">
                <label className="text-muted">Telefone:</label>
                <input type="text" name="telefone" className="form-control"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

ReactDOM.render(<LeadController/>, $('#lead-content').get(0));
