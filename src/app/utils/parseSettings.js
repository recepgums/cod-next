export function parseSettings(settingsStr) {
    const result = JSON.parse(settingsStr);

    const nestedFields = ['quantity_price', 'quantity_discount'];

    nestedFields.forEach(key => {
        if (typeof result[key] === 'string') {
            try {
                result[key] = JSON.parse(result[key]);
            } catch (e) {
                // If parsing fails, leave it as-is
            }
        }
    });

    return result;
}
