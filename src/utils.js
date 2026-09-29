export const numberToWordsTR = (amount, currency = 'TL') => {
  if (!amount || isNaN(amount) || amount === 0) return '';

  const units = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz'];
  const tens = ['', 'On', 'Yirmi', 'Otuz', 'Kırk', 'Elli', 'Altmış', 'Yetmiş', 'Seksen', 'Doksan'];

  const convertGroup = (n) => {
    let str = '';
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (h > 0) {
      if (h === 1) {
        str += 'Yüz ';
      } else {
        str += units[h] + ' Yüz ';
      }
    }
    if (t > 0) {
      str += tens[t] + ' ';
    }
    if (u > 0) {
      str += units[u] + ' ';
    }
    return str.trim();
  };

  const numberToWords = (num) => {
    if (num === 0) return 'Sıfır';
    let str = '';
    const billions = Math.floor(num / 1000000000);
    const millions = Math.floor((num % 1000000000) / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const ones = Math.floor(num % 1000);

    if (billions > 0) {
      str += convertGroup(billions) + ' Milyar ';
    }
    if (millions > 0) {
      str += convertGroup(millions) + ' Milyon ';
    }
    if (thousands > 0) {
      if (thousands === 1) {
        str += 'Bin ';
      } else {
        str += convertGroup(thousands) + ' Bin ';
      }
    }
    if (ones > 0) {
      str += convertGroup(ones) + ' ';
    }
    return str.trim();
  };

  const amountStr = amount.toString().replace(',', '.');
  const parts = amountStr.split('.');
  const intPart = parseInt(parts[0], 10) || 0;
  let decPart = 0;
  if (parts.length > 1) {
    let decStr = parts[1].padEnd(2, '0').substring(0, 2);
    decPart = parseInt(decStr, 10);
  }

  let result = '';
  
  if (intPart > 0 || decPart === 0) {
    result += numberToWords(intPart);
    if (currency === 'TL') result += ' Türk Lirası';
    else if (currency === 'EUR') result += ' Euro';
    else if (currency === 'USD') result += ' Dolar';
  }

  if (decPart > 0) {
    if (result.length > 0) result += ' ';
    result += numberToWords(decPart);
    if (currency === 'TL') result += ' Kuruş';
    else if (currency === 'EUR') result += ' Cent';
    else if (currency === 'USD') result += ' Cent';
  }

  return result;
};

export const generateAmountInWords = (totalsByCurrency) => {
  const parts = [];
  
  for (const [currency, amount] of Object.entries(totalsByCurrency)) {
    if (amount > 0) {
      parts.push(numberToWordsTR(amount, currency));
    }
  }

  return parts.join(' ve ');
};
