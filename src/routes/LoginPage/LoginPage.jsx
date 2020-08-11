import React, { Component } from 'react';
import './LoginPage.css';


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  pretendSubmit = () => {
    const { history } = this.props;
    history.push('/my-groups');
  }

  // handleSubmitJwtAuth = (e) => {
  //   e.preventDefault();
  //   this.setState({ error: null });
  //   const { user_name, password } = e.target;

  //   AuthApiService.postLogin({
  //     user_name: user_name.value,
  //     password: password.value,
  //   })
  //     .then((res) => {
  //       user_name.value = '';
  //       password.value = '';
  //       TokenService.saveAuthToken(res.authToken);
  //       this.handleLoginSuccess();
  //     })
  //     .catch(() => {
  //       user_name.value = '';
  //       password.value = '';
  //       this.setState({ error: true });
  //     });
  // }

  // handleLoginSuccess = () => {
  //   const { history } = this.props;
  //   const { toggleLogin } = this.context;
  //   history.push('/');
  //   toggleLogin();
  // }

  handleClickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { error } = this.state;
    const loginFailed = error
      ? <div className="login-page__login-error">Incorrect username or password</div>
      : null;

    return (
      <main className="login-page">
        <h2>Login</h2>
        {loginFailed}
        <form
          className="login-page__form"
          // onSubmit={this.handleSubmitJwtAuth}
          onSubmit={this.pretendSubmit}
        >
          <div className="login-page__username">
            <label htmlFor="user_name">User name</label>
            <div>
              <input
                required
                className="login-page__input"
                name="user_name"
                type="text"
                id="user_name"
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
      </main>
    );
  }
}

export default LoginPage;
