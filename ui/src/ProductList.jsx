/* eslint linebreak-style: ["error", "windows"] */
import React from 'react';


import Toast from './Toast.jsx';
import ProductTable from './ProductTable.jsx';
import graphQLFetch from './graphQLFetch.js';


export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      prodCount: [],
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
   };
    this.deleteProduct = this.deleteProduct.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
              productList {
                id
                name
                pricePerUnit
                category
                imageUrl
              },
              productCount {
              count
              }
            }`;

    const data = await graphQLFetch(query, this.showError);
    if (data) {
      this.setState({ products: data.productList, prodCount: data.productCount[0].count });
    }
  }

  async deleteProduct(id) {
    const query = `mutation deleteProduct($id: Int!) {
        deleteProduct(id: $id)
      }`;

    const data = await graphQLFetch(query, { id },this.showError);
    if (data) {
      this.showSuccess(`Product ${id} deleted successfully.`); 
      this.loadData();
    }
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { products } = this.state;
    const { prodCount } = this.state;
    const { toastVisible, toastType, toastMessage } = this.state;
    return (
      <React.Fragment>
        <p>Showing {prodCount} available products</p>
        <ProductTable
          products={products}
          deleteProduct={this.deleteProduct}
        />
        <br />
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
          >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}
