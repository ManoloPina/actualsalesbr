/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	class LeadController extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {};
	    this.state.nomeText = '';
	    this.state.alert = {
	      nome: ''
	    };
	  }

	  get $nameText() {
	    return $(this.refs.nameText);
	  }

	  componentDidMount() {
	    this.$nameText.on('focusout', this.checkFields.bind(this));
	  }

	  checkFields() {
	    if (!this.$nameText.val() != '') {
	      let name = this.$nameText.val();
	      let words = name.split(' ');
	      if (words.length < 1) {
	        this.setState();
	      }
	    }
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'container' },
	      React.createElement(
	        'div',
	        { className: 'row' },
	        React.createElement(
	          'div',
	          { className: 'col-xs-12' },
	          React.createElement(
	            'h1',
	            { className: 'text-primary' },
	            'Leads Form'
	          ),
	          React.createElement(
	            'form',
	            null,
	            React.createElement(
	              'div',
	              { className: 'form-group' },
	              React.createElement(
	                'label',
	                { className: 'text-muted' },
	                'Nome:'
	              ),
	              React.createElement('input', { type: 'text', name: 'nome', ref: 'nomeText', className: 'form-control' })
	            ),
	            React.createElement(
	              'div',
	              { className: 'form-group' },
	              React.createElement(
	                'label',
	                { className: 'text-muted' },
	                'Data de nascimento:'
	              ),
	              React.createElement('input', { type: 'text', name: 'data_nascimento', className: 'form-control' })
	            ),
	            React.createElement(
	              'div',
	              { className: 'form-group' },
	              React.createElement(
	                'label',
	                { className: 'text-muted' },
	                'Email:'
	              ),
	              React.createElement('input', { type: 'text', name: 'email', className: 'form-control' })
	            ),
	            React.createElement(
	              'div',
	              { className: 'form-group' },
	              React.createElement(
	                'label',
	                { className: 'text-muted' },
	                'Telefone:'
	              ),
	              React.createElement('input', { type: 'text', name: 'telefone', className: 'form-control' })
	            )
	          )
	        )
	      )
	    );
	  }

	}

	ReactDOM.render(React.createElement(LeadController, null), $('#lead-content').get(0));

/***/ }
/******/ ]);