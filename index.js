currencyForm = document.getElementById("currency-form");
bitcoinPriceElement = document.getElementById("bitcoin-price");
average5minElement = document.getElementById("average-5min");
average30minElement = document.getElementById("average-30min");
average60minElement = document.getElementById("average-60min");

prices5min = [];
prices30min = [];
prices60min = [];

function refresh() {
    selectedCurrency = document.getElementById("currency").value;

    fetch(`https://api.coinbase.com/v2/prices/spot?currency=${selectedCurrency}`)
        .then(response => response.json())
        .then(data => {
            price = parseFloat(data.data.amount);
            bitcoinPriceElement.innerHTML = `Prize is now: ${selectedCurrency} ${price.toFixed(2)}`;

            prices5min.push(price);
            prices30min.push(price);
            prices60min.push(price);

            // Keep only the last 5, 30, and 60 prices
            if (prices5min.length > 5) {
                prices5min.shift();
            }
            if (prices30min.length > 30) {
                prices30min.shift();
            }
            if (prices60min.length > 60) {
                prices60min.shift();
            }

            average5min = calculateAverage(prices5min);
            average30min = calculateAverage(prices30min);
            average60min = calculateAverage(prices60min);

            average5minElement.innerHTML = `${selectedCurrency} ${average5min.toFixed(2)}`;
            average30minElement.innerHTML = `${selectedCurrency} ${average30min.toFixed(2)}`;
            average60minElement.innerHTML = `${selectedCurrency} ${average60min.toFixed(2)}`;

            // Update the chart with the new data
            chart.updateOptions(options);
        })
        .catch(error => {
            bitcoinPriceElement.innerHTML = "There was an error!";
            console.error(error);
        });
}

function calculateAverage(prices) {
    sum = prices.reduce((total, price) => total + price, 0);
    return sum / prices.length;
}
var options = {
    chart: {
        type: 'line'
    },
    series: [{
        name: 'bitcoin-prizes',
        data: prices60min
    }],
    xaxis: {
        type: 'category',
        categories: Array.from({ length: 60 }, (_, i) => String(i + 1))
    }

}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

// Refresh data every 1 minute
setInterval(refresh, 60000);