import React, { Component } from 'react';
import DemoLoginInfo from '../../components/DemoLoginInfo/DemoLoginInfo';
import AuthApiService from '../../services/auth-api-service';
import TokenService from '../../services/token-service';
import MixEdContext from '../../context/MixEdContext';
import propTypes from 'prop-types';
import './LoginPage.css';


class LoginPage extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  handleSubmitJwtAuth = (e) => {
    e.preventDefault();
    const { teacher_name, password } = e.target;

    AuthApiService.postLogin({
      teacher_name: teacher_name.value,
      password: password.value,
    })
      .then((res) => {
        teacher_name.value = '';
        password.value = '';
        TokenService.saveAuthToken(res.authToken);
        this.handleLoginSuccess();
      })
      .catch(() => {
        teacher_name.value = '';
        password.value = '';
        if (this._isMounted) {
          this.setState({ error: true });
        }
      });
  }

  handleLoginSuccess = () => {
    const { history } = this.props;
    const { toggleLogin } = this.context;
    history.push('/');
    toggleLogin();
  }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { error } = this.state;
    const loginFailed = error
      ? <div className="login-page__login-error">Incorrect username or password</div>
      : null;

    return (
      <main className="login-page">
        <div className="login-page__main">
          <h2>Login</h2>
          {loginFailed}
          <form
            className="login-page__form"
            onSubmit={this.handleSubmitJwtAuth}
          >
            <div className="login-page__username">
              <label htmlFor="teacher_name">Username</label>
              <div>
                <input
                  required
                  className="login-page__input"
                  name="teacher_name"
                  type="text"
                  id="teacher_name"
                />
              </div>
            </div>
            <div className="login-page__password">
              <label htmlFor="password">Password</label>
              <div>
                <input
                  required
                  className="login-page__input"
                  name="password"
                  type="password"
                  id="password"
                />
              </div>
            </div>
            <button type="button" onClick={this.handleClickCancel}>Cancel</button>
            <button type="submit">Login</button>
          </form>
        </div>
        <DemoLoginInfo />
      </main>
    );
  }
}

export default LoginPage;

LoginPage.contextType = MixEdContext;

LoginPage.defaultProps = {
  history: {},
};

LoginPage.propTypes = {
  history: propTypes.shape({
    action: propTypes.string,
    block: propTypes.func,
    createHref: propTypes.func,
    go: propTypes.func,
    goBack: propTypes.func,
    goForward: propTypes.func,
    length: propTypes.number,
    listen: propTypes.func,
    location: propTypes.object,
    push: propTypes.func,
    replace: propTypes.func,
  }),
};
