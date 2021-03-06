import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { fetchUser } from "../store/actions/user";
import SingleProductContainer from "../containers/SingleProductContainer";
import SearchResultsContainer from "../containers/SearchResultsContainer";
import UserPageContainer from "../containers/UserPageContainer";
import { fetchCart } from "../store/actions/cart";
import AdminUsersListContainer from "../containers/AdminUsersListContainer";
import adminCreate from "../components/adminCreate";
import HomeContainer from "../containers/HomeContainer";
import NavbarContainer from "../containers/NavbarContainer";
import CartContainer from "../containers/CartContainer";
import CheckoutContainer from "../containers/CheckoutContainer";

class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  componentDidUpdate() {
    this.props.fetchCart(this.props.user);
  }

  render() {
    const { location, history, user } = this.props;
    return (
      <div id="main container-fluid">
        <NavbarContainer location={location} history={history} />
        <Switch>
          <Route
            exact
            path="/admin/users"
            component={AdminUsersListContainer}
          />{" "}
          <Route exact path="/admin/create" component={adminCreate} />
          <Route
            path="/cart/checkout"
            component={CheckoutContainer}
            history={history}
            user={user}
          />
          <Route path="/cart" component={CartContainer} history={history} />
          <Route exact path="/product/:id" component={SingleProductContainer} />
          <Route
            exact
            path="/search/:query"
            render={({ match, history }) => (
              <SearchResultsContainer
                searchQuery={match.params.query}
                history={history}
              />
            )}
          />
          <Route exact path="/" component={HomeContainer} />
          {Object.keys(this.props.user).length ? (
            <div>
              <Route
                exact
                path="/user"
                render={({ location, history, match }) => {
                  return (
                    <UserPageContainer location={location} history={history} />
                  );
                }}
              />

              <Route
                exact
                path="/user/order/:pastOrderId"
                render={({ location, history, match }) => {
                  return (
                    <UserPageContainer
                      location={location}
                      history={history}
                      orderId={match.params.pastOrderId}
                    />
                  );
                }}
              />

              <Route
                exact
                path="/user/address"
                render={({ location, history, match }) => {
                  return (
                    <UserPageContainer location={location} history={history} />
                  );
                }}
              />
            </div>
          ) : (
            <Route exact path="/user" component={HomeContainer} />
          )}
        </Switch>
       
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchUser,
  fetchCart
};

const mapStateToProps = state => ({
  user: state.user.user,
  isUrlHome: state.navbar.home
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
