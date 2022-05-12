;((window) => {
    'use strict';

    class App {
        constructor() {
            this.setProducts();
            this.setLoading();
            
            setTimeout(() => {
                this.setCountProducts();
                this.showProducts();
                this.showCartProducts();
            }, 1000);
        }

        setLoading() {
            document.getElementById('product-list').innerHTML = '<p>Loading...</p>';
            document.getElementById('cart-product-list').innerHTML = '<p>Loading...</p>';
        }

        setLoadingCartProducts() {
            document.getElementById('cart-product-list').innerHTML = '<p>Loading...</p>';
        }

        setProducts() {
            const products = async () => {
                const response = await fetch('products.json', {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS"
                    }
                });

                return await response.json();
            };

            products().then((products) => {
                if (!localStorage.getItem('ECommerce-products') && !localStorage.getItem('ECommerce-cart-products')) {
                    localStorage.setItem('ECommerce-products', JSON.stringify(products.products));
                    localStorage.setItem('ECommerce-cart-products', JSON.stringify([]));
                }
            });
        }

        setCountProducts() {
            document.getElementById('cart-product-count').innerHTML = this.getAllProducts().cartProducts.length;
            document.getElementById('cart-product-count-cart-page').innerHTML = this.getAllProducts().cartProducts.length;
        }

        getAllProducts() {
            return {
                products: JSON.parse(localStorage.getItem('ECommerce-products')),
                cartProducts: JSON.parse(localStorage.getItem('ECommerce-cart-products'))
            }
        }

        showProducts() {
            const products = this.getAllProducts().products;
            const productList = document.getElementById('product-list');

            productList.innerHTML = '';

            if (products.length) {
                products.map((product) => {
                    productList.innerHTML += `
                        <div class="product-item">
                            <div>
                                <h3>${product.title}</h3>
                                <p>${product.desc}</p>
                                <p>$${product.price}</p>
                            </div>
                            <div>
                                <button type="button" name="add-product-button" data-id="${product.id}">
                                    Add Product
                                </button>
                            </div>
                        </div>
                    `;
                });

                setTimeout(() => {
                    this.addProductToCart();
                }, 1000);
            } else {
                productList.innerHTML = '<p>There are no products.</p>';
            }
        }

        showCartProducts() {
            const cartProducts = this.getAllProducts().cartProducts;
            const cartProductList = document.getElementById('cart-product-list');

            cartProductList.innerHTML = '';

            if(cartProducts.length) {
                cartProducts.map((product) => {
                    cartProductList.innerHTML += `
                        <div class="product-item">
                            <div>
                                <h3>${product.title}</h3>
                                <p>${product.desc}</p>
                                <p>$${product.price}</p>
                            </div>
                            <div>
                                <button type="button" name="remove-product-button" data-id="${product.id}">
                                    Remove Product
                                </button>
                            </div>
                        </div>
                    `;
                });

                setTimeout(() => {
                    this.removeProductFromCart();
                }, 1000);
            } else {
                cartProductList.innerHTML = '<p>There are no products in your cart.</p>';
            }
        }

        addProductToCart() {
            for (let button of document.getElementsByName('add-product-button')) {
                button.addEventListener('click', (e) => {
                    let products = this.getAllProducts().products;
                    let cartProducts = this.getAllProducts().cartProducts;
                    let productId = e.target.getAttribute('data-id');
                    let product = products.find((product) => product.id === productId);

                    if (!cartProducts.length) {
                        cartProducts.push(product);
                    } else {
                        let cartProductExisted = cartProducts.find((cartProduct) => cartProduct.id === product.id);

                        if(!cartProductExisted) {
                            cartProducts.push(product);
                        }
                    }

                    e.target.disabled = true;
                    localStorage.setItem('ECommerce-cart-products', JSON.stringify(cartProducts));
                    this.setLoadingCartProducts();

                    setTimeout(() => {
                        this.setCountProducts();
                        this.showCartProducts();
                    }, 1000);
                });
            }
        }

        removeProductFromCart() {
            for (let button of document.getElementsByName('remove-product-button')) {
                button.addEventListener('click', (e) => {
                    let cartProducts = this.getAllProducts().cartProducts;
                    let productId = e.target.getAttribute('data-id');
                    let newCartProducts = cartProducts.filter((cartProduct) => cartProduct.id !== productId);
                    
                    for (let button of document.getElementsByName('add-product-button')) {
                        if (button.getAttribute('data-id') === productId) button.disabled = false;
                    }

                    if (newCartProducts.length === 0) {
                        newCartProducts = [];
                    }

                    localStorage.setItem('ECommerce-cart-products', JSON.stringify(newCartProducts));
                    this.setLoadingCartProducts();

                    setTimeout(() => {
                        this.setCountProducts();
                        this.showCartProducts();
                    }, 1000);
                });
            }
        }
    }

    new App();
})(window);