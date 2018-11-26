var currentOrderId;
var orderSummaryInfo;
var orderProducts;
var nowId;
var pickOrderInfo;
var currency = "RU";
var LastOrderId = 0;
var LastProductId = 0;
var shipName = document.getElementById("name");
var shipStreet = document.getElementById("street");
var shipCode = document.getElementById("code");
var shipCity = document.getElementById("city");
var shipCountry = document.getElementById("county");
var shipRegion = document.getElementById("region");
var customerUrl = "http://localhost:3000/";
var humansUrl = "http://localhost:3000/api/Orders?filter[fields][customerInfo]=true&filter[fields][id]=true";
var productsUrl = "http://localhost:3000/api/Orders/";
var summaryUrl = "Orders?filter[fields][summary]=true&filter[fields][id]=true";

//add list objects      
function addListObjects (orderSummaryInfo) {
    for (var i = 0; i < orderSummaryInfo.length; i++) {
        var summary = orderSummaryInfo[i].summary;
        var orderID = document.createTextNode("Order " + orderSummaryInfo[i].id);
        var createdAt = document.createTextNode(summary.createdAt.replace('T', ' ').replace('.', ' '));
        var customer = document.createTextNode(summary.customer);
        var orderStatus = document.createTextNode(summary.status);
        var shippedAt = document.createTextNode("Shipped:" + summary.shippedAt);

        var newOrderBox = document.createElement("li");
        newOrderBox.className = "order-box"
        var numberInfo = document.createElement("article");
        numberInfo.className = "number-info";

        var IDInfo = document.createElement("h2");
        var customerInfo = document.createElement("p");
        var createdInfo = document.createElement("p");
        var timeInfo = document.createElement("time");
        var statusInfo = document.createElement("p");

        var a = document.getElementById("order-list");
        a.appendChild(newOrderBox);
        newOrderBox.id = orderSummaryInfo[i].id;
        newOrderBox.setAttribute('onClick', `replyClick(this.id)`);
        newOrderBox.appendChild(numberInfo);
        numberInfo.appendChild(IDInfo);
        IDInfo.appendChild(orderID);
        numberInfo.appendChild(customerInfo);
        numberInfo.appendChild(createdInfo);
        customerInfo.appendChild(customer);
        createdInfo.appendChild(shippedAt);

        var orderState = document.createElement("article");
        orderState.className = "order-status";

        orderState.appendChild(timeInfo);
        orderState.appendChild(statusInfo);
        timeInfo.appendChild(createdAt);
        statusInfo.appendChild(orderStatus);
        newOrderBox.appendChild(orderState);


        setStatusColor(statusInfo);
    };
    getOrderCount(i);
};

function setStatusColor(statusInfo) {
    if (statusInfo.textContent == 'Accepted') {
        statusInfo.className = "accepted";
    }
    else {
        statusInfo.className = "pending";
    }
}

//renew data
function replyClick(nowId) {
    switchView();
    getNowIDsummary(nowId);
    mapKillChilds();
};

function renderOurSummary() {
    var orderTittle = document.getElementById("order-title");
    var orderCustomer = document.getElementById("order-customer");
    var orderedDate = document.getElementById("ordered-date");
    var orderShipped = document.getElementById("shipped-date");
    var orderCurrency = document.getElementById("product-currency");
    console.log(orderCurrency);
    getOrderProducts();
    orderTittle.innerHTML = "Order: " + pickOrderInfo[0].id;
    orderCustomer.innerHTML = "Customer:" + pickOrderInfo[0].summary.customer;
    orderedDate.innerHTML = "Created:" + pickOrderInfo[0].summary.createdAt;
    orderShipped.innerHTML = "Shipped:" + pickOrderInfo[0].summary.shippedAt;
    orderCurrency.innerHTML = pickOrderInfo[0].summary.currency;

    //active list element
    SetActiveListChild();
    getCustomerInfo();

}

function SetActiveListChild(){
    var newOrderBox = document.body.getElementsByClassName("order-box");
    for (var i = 0; i < newOrderBox.length; i++) {
        if (newOrderBox[i].id == pickOrderInfo[0].id) {
            newOrderBox[i].className = "order-box active-list";
        }
        else {
            newOrderBox[i].className = "order-box no-active";
        }
    }
}
function mapKillChilds() {
    var ClearList = document.getElementById("maping-plus");
    try{
    if (ClearList.firstChild != null){
    var fc = ClearList.firstChild;
   {
    while (fc) {
        ClearList.removeChild(fc);
        fc = ClearList.firstChild;
    }
}
}
}
catch{
}
}
function getHumanInfo() {
    var underInfoBlock = document.getElementById("under-info-content");
    underInfoBlock.textContent = "Human info";
    var myMap = document.querySelector("#maping-plus");
    mapKillChilds();
    if (myMap != null){
        myMap.id="maping";
        var info = document.querySelector("#address-info");
        info.className = "address-info";
    }

    fetch({ method: 'GET', url: 'Orders?filter[fields][customerInfo]=true&filter[fields][id]=true' })
        .then(function(orderHumanInfo) {
            renderHumanInfo(orderHumanInfo);
        });
}

function renderHumanInfo(orderHumanInfo) {
    var Car = document.querySelector("#car");
    var Human = document.querySelector("#human");
    Car.className = "no-active";
    Human.className = "active";
    shipName.innerHTML = "First Name: " + pickOrderInfo[0].customerInfo.firstName;
    shipStreet.innerHTML = "Last Name: " + pickOrderInfo[0].customerInfo.lastName;
    shipCode.innerHTML = "Region: " + pickOrderInfo[0].customerInfo.address;
    shipCity.innerHTML = "Phone: " + pickOrderInfo[0].customerInfo.phone;
    shipCountry.innerHTML = "Email: " + pickOrderInfo[0].customerInfo.email;
}

var redactFunction = document.querySelector("#redact-function");


function getCustomerInfo() {
    var underInfoBlock = document.getElementById("under-info-content");
    underInfoBlock.textContent = "Shipping-address";
    var myMap = document.querySelector("#maping-plus");
    mapKillChilds();
    if (myMap != null){
        myMap.id="maping";
        var info = document.querySelector("#address-info");
        info.className = "address-info";
    }
    fetch({
        method: 'GET',
        url: 'Orders?filter[fields][shipTo]=true&filter[fields][id]=true'
    }).then(function(orderShiptoInfo) {renderCustomerInfo(orderShiptoInfo)});
}

function renderCustomerInfo(orderShipToInfo) {
    var Car = document.querySelector("#car");
    var Human = document.querySelector("#human");
    Car.className = "active";
    Human.className = "no-active";
    shipStreet.innerHTML = "Street: " + pickOrderInfo[0].shipTo.address;
    shipCode.innerHTML = "Zip Code: " + pickOrderInfo[0].shipTo.ZIP;
    shipCity.innerHTML = "Region: " + pickOrderInfo[0].shipTo.region;
    shipCountry.innerHTML = "County: " + pickOrderInfo[0].shipTo.country;
}

//order count
function getOrderCount(count) {
    var order = document.createTextNode("order(" + count + ")");
    var orderCount = document.getElementById("order-count");
    orderCount.textContent = "";
    orderCount.appendChild(order);
}

//search 

function isOrderBoxValid(i) {
    var orderID = document.createTextNode("Order " + orderSummaryInfo[i].id);
    var createdAt = document.createTextNode(orderSummaryInfo[i].summary.createdAt.replace('T', ' ').replace('.', ' '));
    var customer = document.createTextNode(orderSummaryInfo[i].summary.customer);
    var orderStatus = document.createTextNode(orderSummaryInfo[i].summary.status);
    var shippedAt = document.createTextNode("Shipped:" + orderSummaryInfo[i].summary.shippedAt);

    var newOrderBox = document.createElement("li");
    newOrderBox.className = "order-box";
    var numberInfo = document.createElement("article");
    numberInfo.className = "number-info";

    var IDInfo = document.createElement("h2");
    var customerInfo = document.createElement("p");
    var createdInfo = document.createElement("p");
    var timeInfo = document.createElement("time");
    var statusInfo = document.createElement("p");

    var a = document.getElementById("order-list");
    a.appendChild(newOrderBox);
    newOrderBox.id = i + 1;
    newOrderBox.setAttribute('onClick', `replyClick(${orderSummaryInfo[i].id})`);

    newOrderBox.appendChild(numberInfo);
    numberInfo.appendChild(IDInfo);
    IDInfo.appendChild(orderID);
    numberInfo.appendChild(customerInfo);
    numberInfo.appendChild(createdInfo);
    customerInfo.appendChild(customer);
    createdInfo.appendChild(shippedAt);

    var orderState = document.createElement("article");
    orderState.className = "order-status";

    orderState.appendChild(timeInfo);
    orderState.appendChild(statusInfo);
    timeInfo.appendChild(createdAt);
    statusInfo.appendChild(orderStatus);
    newOrderBox.appendChild(orderState);

    setStatusColor(statusInfo);
}
function killChilds() {
    var ClearList = document.getElementById("order-list");
    var fc = ClearList.firstChild;
    while (fc) {
        ClearList.removeChild(fc);
        fc = ClearList.firstChild;
    }
}


function getFullPrice() {
    var fullPrice = 0;
    var totalPrice = document.getElementById("price-tittle");
    for (var i = 0; i < orderProducts.length; i++) {
        fullPrice += +orderProducts[i].totalPrice;
    }
    totalPrice.innerHTML = fullPrice;
}

function switchView() {
    document.getElementById("products-search-area").value = "";
    document.getElementById('empty-content').className = 'hidden';
    document.getElementById('content').className = '';
}

function checkForNoSearchResult(count) {
    var className = '';

    if (!count) {
        className = 'no-orders';
    }

    document.getElementById('order-list').className = className;
}

var sortFields = [];
function sortProducts(fieldName, currenOrderId) {
    var currentOrder = orderProducts;
    var allProducts = currentOrder.slice();

    updateSortFieldsArray(fieldName);

    var products = sortFields.length == 0
        ? allProducts
        : allProducts
            .sort(ordersSortFunction);

    updateProductsTableView(products);
}

function updateSortFieldsArray(fieldName) {
    var fieldIndex = sortFields.findIndex(function (field) { return field.name == fieldName });
    var field = sortFields[fieldIndex];

    if (field) {
        if (field.isDescending) {
            sortFields.splice(fieldIndex, 1);
        }
        else {
            field.isDescending = true;
        }
    }
    else {
        sortFields.push({
            name: fieldName,
            isDescending: false
        });
    }
}

function updateProductsTableView(products, cleanSortFields) {
    if (cleanSortFields) {
        sortFields = [];
    }

    renderProductsTableTitle(products);
    updateProductsTableHeadView();
    updateProductsTableBodyView(products);
}

function updateProductsTableHeadView() {
    displayOrders = sortFields.map(function (field) {
        return {
            name: field.name,
            viewOrder: field.isDescending ? '↓' : '↑'
        };
    })

    var productsViewOrder = displayOrders.find(function (field) { return field.name == 'name' });
    var unitPriceViewOrder = displayOrders.find(function (field) { return field.name == 'price' });
    var quantityViewOrder = displayOrders.find(function (field) { return field.name == 'quantity' });
    var totalViewOrder = displayOrders.find(function (field) { return field.name == 'totalPrice' });

    var element = document.getElementById('products-table-head');

    element.innerHTML = `
        <tr>
            <td class="header-item" onClick="sortProducts('name', currentOrderId)">
                Product ${(productsViewOrder ? productsViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('price', currentOrderId)">
                Unit Price ${(unitPriceViewOrder ? unitPriceViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('quantity', currentOrderId)">
                Quantity ${(quantityViewOrder ? quantityViewOrder.viewOrder : '')}
            </td>
            <td class="header-item" onClick="sortProducts('totalPrice', currentOrderId)">
                Total ${(totalViewOrder ? totalViewOrder.viewOrder : '')}
            </td>
        </tr>
    `;
}

function updateProductsTableBodyView(products) {
    var element = document.getElementById('products-table-body');
    element.innerHTML = '';

    products.forEach(function (product) {
        element.innerHTML += "<td><strong>" + product.name + "</strong><p>" + product.id + " <td> <strong> " + product.price + "</strong> " + product.currency + "<td> <strong> " + product.quantity + "</strong><td><strong>" + product.totalPrice + "</strong> " + product.currency;
    });

}

function renderProductsTableTitle(products) {
    var element = document.getElementById('products-header-title');
    element.innerHTML = "Line Items " + products.length;
}

function valuesAreNumbers(values) {
    var regex = RegExp('^[\\d\\.]+$');
    var result = true;

    values.forEach(function (value) {
        result = result && regex.test(value);
    });

    return result;
}

function ordersSortFunction(firstProduct, secondProduct) {
    var result = [];

    sortFields.forEach(function (field) {
        var sortFunction = function (a, b) {
            if (valuesAreNumbers([a, b])) {
                return b - a > 0;
            }
            return a < b
        };

        if (field.isDescending) {
            sortFunction = function (a, b) {
                if (valuesAreNumbers([a, b])) {
                    return a - b > 0;
                }
                return a > b;
            };
        }

        if (sortFunction(firstProduct[field.name], secondProduct[field.name])) {
            result.push(1);
        }
        else {
            result.push(-1);
        }
    });

    return result.reduce(function (accumulator, currentValue) { return accumulator + currentValue });
}

var searchForProductButton = document.querySelector("#product-search");
searchForProductButton.addEventListener("click", function () {
    var userInput = document.getElementById('products-search-area').value.toLowerCase();
    if (userInput) {
        var products = orderProducts;
        var filteredProducts = products.filter(function (product) {
            var result = false;
            var keys = Object.keys(product);

            keys.forEach(function (key) {
                return result = result || `${product[key]}`.toLowerCase().indexOf(userInput) >= 0
            });

            return result;
        });

        updateProductsTableView(filteredProducts);
    }
    else {
        refreshProductSearch();
    }
})

var refreshProductSearchButton = document.querySelector("#product-refresh");
refreshProductSearchButton.addEventListener("click", refreshProductSearch);

function refreshProductSearch() {
    document.getElementById('products-search-area').value = '';

    var products = orderProducts;

    updateProductsTableView(products);
}

function getOrderProducts() {
    fetch({ method: 'GET', url: `Orders/${pickOrderInfo[0].id}/products` })
        .then(function(products){
            orderProducts = products;
            updateProductsTableView(orderProducts, true);
            getFullPrice();
        });
}

function getAsyncRequest(requestURL) {
    try{
var loadingBlock = document.getElementById("loading-block");
loadingBlock.className = "loaded";
    }
    catch{};
    fetch({ method: 'GET', url: requestURL })
        .then(function(summaryInfo){
            killChilds()
            orderSummaryInfo = summaryInfo;
            addListObjects (orderSummaryInfo);
            getLastOrderId(orderSummaryInfo);
            try{
            loadingBlock.className = "hidden";
            }
            catch{};
        });
}

var postNewOrderButton = document.querySelector(".post-new-order")
postNewOrderButton.addEventListener("click", function () {
    getLastOrderId();
    var newCustomer = document.getElementById("customer").value;
    var newStatus = document.getElementById("status").value;
    var newZIP = document.getElementById("zip").value;
    var newShippedAt = document.getElementById("shipped").value;
    var newCurrency = document.getElementById("currency").value;
    var newCompanyName = document.getElementById("name").value;
    var newAddress = document.getElementById("address").value;
    var newRegion = document.getElementById("region").value;
    var newCountry = document.getElementById("country").value;
    var newFirstName = document.getElementById("first-name").value;
    var newLastName = document.getElementById("last-name").value;
    var newAddress = document.getElementById("address").value;
    var newPhone = document.getElementById("phone").value;
    var newEmail = document.getElementById("email").value;
    var newTotalPrice = 0;
    var newOrder = {
        summary: {
            createdAt: new Date(),
            shippedAt: newShippedAt,
            customer: newCustomer,
            status: newStatus,
            totalPrice: newTotalPrice,
            currency: newCurrency
        },
        shipTo: {
            name: newCompanyName,
            address: newAddress,
            ZIP: newZIP,
            region: newRegion,
            country: newCountry
        },
        customerInfo: {
            firstName: newFirstName,
            lastName: newLastName,
            address: newAddress,
            phone: newPhone,
            email: newEmail
        },

        id: +LastOrderId + 1,
    }

    var newOrderToJson = JSON.stringify(newOrder);
    renderNewOrder(newOrderToJson);
});

function renderNewOrder(newOrderToJson) {
    var requestHeaders = [ 
        { name: 'Content-type', value: 'application/json; charset=utf-8' }
    ];

    fetch({ method: 'POST', url: 'Orders', body: JSON.parse(newOrderToJson), headers: requestHeaders })
        .then(function() {
            getAsyncRequest(summaryUrl);
        });

    var newOrderBlock = document.querySelector(".add-new-order");
    newOrderBlock.className = 'add-new-order hidden';
}

var cancelOrderButton = document.querySelector(".cancel");
cancelOrderButton.addEventListener("click", function () {
    var newOrderBlock = document.querySelector(".add-new-order");
    newOrderBlock.className = 'add-new-order hidden';
});

function cancelPosting() {
    var newProductBlock = document.querySelector(".plus-block");
    newProductBlock.className = 'plus-block hidden';

}
function getLastOrderId() {
    for (i = 0; i < orderSummaryInfo.length; i++) {
        if (+orderSummaryInfo[i].id > +LastOrderId) {
            LastOrderId = orderSummaryInfo[i].id;
        }
    }
}

function getLastProductId() {
    for (i = 0; i < orderProducts.length; i++) {
        if (+orderProducts[i].id > +LastProductId) {
            LastProductId = orderProducts[i].id + 1;
        }
    }
}

var inputNewProduct = document.querySelector(".plus-product");
inputNewProduct.addEventListener("click", function(){
    var newOrderBlock = document.querySelector(".add-new-order");
    newOrderBlock.className = "add-new-order";
});

var deleteThisOrder = document.querySelector(".delete-this-order");
deleteThisOrder.addEventListener("click", function(){
    var req = new XMLHttpRequest();
    req.open("DELETE", `http://localhost:3000/api/Orders/${pickOrderInfo[0].id}/products`, true);

    req.addEventListener("load", function () {
        console.log("Done:", req.status);
        qwe();
    });

    req.send(null);
});

var inputNewOrderButton = document.querySelector("#new-product");
inputNewOrderButton.addEventListener("click", function () {
    if (document.querySelector('.plus-block, .hidden')) {
        getLastOrderId();
        var newProductBlock = document.querySelector(".plus-block");
        newProductBlock.className = "plus-block";
    }
    else {
        cancelPosting();
    }
});

function qwe(){
        var req = new XMLHttpRequest();
        req.open("DELETE", `http://localhost:3000/api/Orders/${pickOrderInfo[0].id}`, true);
    
        req.addEventListener("load", function () {
            console.log("Done:", req.status);
            getAsyncRequest(summaryUrl);
        });
    
        req.send(null);
       }


var postNewProductBotton = document.querySelector(".post-new-product");
postNewProductBotton.addEventListener("click", function () {
    getLastProductId();
    var newProductName = document.getElementById("new-product-name").value;
    var newProductPrice = document.getElementById("new-product-price").value;
    var newProductQuantity = document.getElementById("new-product-quantity").value;
    var newProduct = {
        name: newProductName,
        price: newProductPrice,
        currency: currency,
        quantity: newProductQuantity,
        totalPrice: +newProductQuantity * +newProductPrice,
        id: LastProductId,
        orderId: pickOrderInfo[0].id,
    }

    if (validateProduct(newProduct)) {
        renderNewProduct(newProduct);
    }
    else {
        alert('Please, enter valid values for product');
    }
});



function renderNewProduct(newProduct) {
     {
        var requestHeaders = [ 
            { name: 'Content-type', value: 'application/json; charset=utf-8' }
        ];
        fetch({ method: 'POST', url: `Orders/${pickOrderInfo[0].id}/products`, body: newProduct, headers: requestHeaders })
            .then(function() {
                console.log("asd");
            });
    var newProductBlock = document.querySelector(".plus-block");
    newProductBlock.className = 'plus-block hidden';
}
}

var startSearchButton = document.querySelector(".search-function");
startSearchButton.addEventListener("click", function () {
    var count = 0;
    killChilds();
    for (i = 0; i < orderSummaryInfo.length; i++) {
        var myInput = document.querySelector(".order-search");
        var term = myInput.value;
        var FullOrderBoxInfo = "Order " + orderSummaryInfo[i].id + " " + orderSummaryInfo[i].summary.customer + orderSummaryInfo[i].summary.shippedAt + " " + orderSummaryInfo[i].summary.status.toLocaleLowerCase();
        console.log(FullOrderBoxInfo);
        if (FullOrderBoxInfo.toLocaleLowerCase().indexOf(term.toLowerCase()) != -1) {
            count++;
            isOrderBoxValid(i);
        }
    }

    checkForNoSearchResult(count);
    getOrderCount(count);
});

var refreshSearchButton = document.querySelector(".refresh-function");

refreshSearchButton.addEventListener('click', function () {
    killChilds();
    var myInput = document.querySelector(".order-search");
    myInput.value = "";
    var orders = document.body.getElementsByClassName("order-box");
    Array.from(orders).forEach(function (newOrderBox) {
        count++;
        newOrderBox.style.display = "flex";
    });

    checkForNoSearchResult(Orders.length);
    addListObjects (orderSummaryInfo);
})

getAsyncRequest(summaryUrl);

function getNowIDsummary(nowId) {
    fetch({ method: 'GET', url: `Orders?filter[where][id]=${nowId}` })
        .then(function(orderInfo) {
            pickOrderInfo = orderInfo;
            renderOurSummary();
        });
}

function mapInit(){     
    mapKillChilds();
var myGeocoder = ymaps.geocode(pickOrderInfo[0].shipTo.address);
myGeocoder.then(
function (res) {
var myMap = new ymaps.Map("maping-plus", {
    center: res.geoObjects.get(0).geometry.getCoordinates(),
    zoom: 16
}); 
},
function (err) {
alert('Ошибка');
    }
);
        }

function getMyMap(){
    var HumanInfo = document.querySelector(".active");
    HumanInfo.className = ".no-active";
    var myMap = document.querySelector("#maping");
    var Info = document.querySelector(".address-info");
    Info.className="address-info hidden";
    myMap.id="maping-plus";
    mapInit();
}

