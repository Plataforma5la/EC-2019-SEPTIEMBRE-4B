import React from "react";
import { connect } from "react-redux";
import SingleProduct from "../components/SingleProduct";
import { fetchProduct } from "../store/actions/product";
import { fetchAndAddToCart } from "../store/actions/cart";

class SingleProductContainer extends React.Component {
  constructor(props) {
    super(props);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.props.fetchProduct(this.props.match.params.id);
  }

  addProduct(product) {
    this.props.fetchAndAddToCart(product, this.props.user);
  }

  render() {
    return (
      <div>
        <SingleProduct
          addProduct={this.addProduct}
          selectedProduct={this.props.selectedProduct}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ products, user }) => {
  return {
    user: user.user,
    selectedProduct: products.selectedProduct
  };
};

const mapDispatchToProps = {
  fetchProduct,
  fetchAndAddToCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProductContainer);
