


function isValidSIREN(siren) {

    if (!/^\d{9}$/.test(siren)) {
      return false;
    }
  
    let sum = 0;
    for (let i = 0; i < siren.length; i++) {
      let digit = parseInt(siren[i], 10);
  
      if (i % 2 === 0) { 
        digit *= 2;
      }
  
      if (digit > 9) {
        digit -= 9;
      }
  
      sum += digit;
    }
  
    return sum % 10 === 0;
  }
  

  
module.exports = { isValidSIREN }

