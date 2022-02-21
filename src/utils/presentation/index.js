function maskDollarValue(value) {
    try {
        if (!value || isNaN(value) || value <= 0) return "-";
        if (value > 0.01) {
            var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            });
            return formatter.format(value); /* $2,500.00 */
        } else {
            return "$" + value.toFixed(9);
        }
    } catch (error) {
        return value;
    }
}

function maskNumberCommaSeparator(value) {
    try {
        if (!value || isNaN(value)) return value;
        if (value > 0.01) {
            return value
                .toFixed(2)
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return value.toFixed(6);
        }
    } catch (error) {
        return value;
    }
}

function convertGweiToRealQty(real){
    return real / 1000000000000000000

}

export {maskDollarValue, maskNumberCommaSeparator, convertGweiToRealQty}