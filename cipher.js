
class Cipher {
    #inputText;
    #encryptionMethod;
    #amount;
    
    constructor(inputText = null, encryptionMethod = null, amount = 0) { 
        this.#inputText = inputText;
        this.#encryptionMethod = encryptionMethod;
        this.#amount = amount;
    }

    // get the input value
    #getInputText() {
        this.#inputText = document.getElementById('cipherInputText').value;
    }

    // get the method which user want to use
    #getEncryptionMethod() {
        this.#encryptionMethod = document.getElementById('ciphers').value;
    }
    
    // get the value from amount input
    #getAmountValue() {
        this.#amount = Number(document.getElementById('amount').value);
    }

    // gives user alert if input text is not valid
    #giveAlertMessage() {

        this.#inputText === "" && this.#encryptionMethod === "" ? alert('Please write on textbox and select a crypt method.')
        : this.#inputText === "" ? alert('Please write on textbox.')
        : alert('Please selext a crypt method.');
        
    }

    // check if text and method are valid
    #isValidated() {
        return (this.#inputText !== "" && this.#encryptionMethod !== "");
    }

    // sanitize text
    #validateText() {
        this.#inputText = this.#inputText.toString().trim().split("").map(text => text.replace(/>/, '&#62;').replace(/</, '&#60;')).join("");
    }

    
    #caesarCipher(str, amount) {
        if (amount < 0) {                                   // if argument amount number is less than zero, invoke function with string and add to amount 26
            return this.#caesarCipher(str, (amount + 26));
        }
        let output = '';
        for (let i = 0; i < str.length; i++) { // iterate string 
            let char = str[i];
            if (char.match(/[a-z]/i)) {         // next code change all characters from string to different characters
                let code = str.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                char = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                char = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
        }
        output += char;
        }
        return output;
    }


    // function change character to different character, example i => ! etc
    #symbolCipher(str) {
        
        const symbols = {
            'i': '!',
            '!': 'i',
            'l': '1',
            '1': 'l',
            's': '$',
            '$': 's',
            'o': '0',
            '0': 'o',
            'a': '@',
            '@': 'a',
            'e': '3',
            '3': 'e',
            'b': '6',
            '6': 'b',
            '5': '§',
            '§': '5',
            'u': 'µ',
            'µ': 'u'
        }
        
        let output = '';
        for (let i = 0; i < str.length; i++) {
            let char = str.toLowerCase()[i];
    
            if (symbols[char]) {
                output += symbols[char]
            } else {
                output += char;
            }
        }
        return output;
    }

    // function takes string and flips it around
    #reverseCipher(str) {
        let words = str.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].split('').reverse().join('');
        }
        return words.join(' ');
    }

    // function takes string and runs it first in caesarCipher then symbolCipher and lastly reverseCipher
    #encodeMessage(str, amount) {
        return this.#reverseCipher(this.#symbolCipher(this.#caesarCipher(str, amount)));
    }

    // function takes string and runs it first reverseCipher then symbolCipher and lastly caesarCipher
    #decodeMessage(str, amount) {
        return this.#caesarCipher(this.#symbolCipher(this.#reverseCipher(str)), (amount * -1));
    }

    // function check which method user select and runs it
    #runEncryptionMethod() {
        //
        this.#getAmountValue();
        let output;
        const str = this.#inputText;
        const amount = this.#amount;
        const method = this.#encryptionMethod;

        switch (method) {
            case 'symbol':
                output = this.#symbolCipher(str);
                break;
            case 'reverse':
                output = this.#reverseCipher(str);
                break;
            case 'caesar':
                output = this.#caesarCipher(str, amount);
                break; 
            case 'encrypt':
                output = this.#encodeMessage(str, amount);
                break; 
            case 'decrypt':
                output = this.#decodeMessage(str, amount);
                break; 
        }

        return output;
       
    }

    // function display text
    #displayEncryptedMessage() {
              
        const output = this.#runEncryptionMethod();      
        const startText = `Here is your ${this.#encryptionMethod} message:`; 

        document.getElementById('displayCipherText').textContent = `${startText} ${output}`;
        
    }  
    
    run() {
     
        this.#getInputText();
        this.#getEncryptionMethod();
                
        if (this.#isValidated()) {
            this.#validateText();
            
            this.#displayEncryptedMessage();
            
            return true;
        }
        
        this.#giveAlertMessage();
        return false;
    }
}

const coder = new Cipher();

const showAmountInput = (divId, element) => {

    document.getElementById(divId).style.display = 'none';
    
    if (element.value === 'caesar') {
        document.getElementById('amount').min = -100;
        document.getElementById('amount').max = 100;
        document.getElementById('hidden_div_text').textContent = 'How many times encoding?';
        document.getElementById(divId).style.display = 'block';
        
    } 
    
    if (element.value === 'encrypt') {
        if (Number(document.getElementById('amount').value) < 0) {
            document.getElementById('amount').value *= -1; 
        } 
        document.getElementById('amount').min = 0;
        document.getElementById('amount').max = 100;
        document.getElementById('hidden_div_text').textContent = 'How many times encoding forward?';
        
        document.getElementById(divId).style.display = 'block';
        
        
    } 
    
    if (element.value === 'decrypt') {
        if (Number(document.getElementById('amount').value) < 0) {
            document.getElementById('amount').value *= -1; 
        } 
        document.getElementById('amount').min = 0;
        document.getElementById('amount').max = 100;
        document.getElementById('hidden_div_text').textContent = 'How many times decoding backward?';
        document.getElementById(divId).style.display = 'block';
      
    }
    
}


const textInput = document.getElementById('cipherInputText');
textInput.addEventListener('keyup',(event) => {
    if (event.key === "Enter") {
        coder.run();
    }
});

const button = document.getElementById('cryptButton');
button.addEventListener('click', (event) => {
    if (event.button === 0) {
        coder.run();
    }
  
});



