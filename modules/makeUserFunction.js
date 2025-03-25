
var functionName = null;

    
     
    document.getElementById('userInput').textContent = userInput;
    functionName = document.getElementById('equationInput');    


     
    const tokensList = document.getElementById('tokensList');
    tokens.forEach((token, index) => {
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';

        const tokenValue = document.createElement('div');
        tokenValue.className = 'token-value';
        tokenValue.textContent = token.value;
        tokenValue.contentEditable = token.type === 'NUMBER';
        tokenValue.addEventListener('input', function() {
            if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
                tokens[index].value = tokenValue.textContent;
            } else {
                tokenValue.textContent = tokens[index].value;  
            }
        });

        tokenItem.appendChild(tokenValue);

        if (token.type === 'NUMBER') {
            const tokenSelect = document.createElement('select');
            const optionNumber = document.createElement('option');
            optionNumber.value = 'NUMBER';
            optionNumber.textContent = 'TYPE_NUMBER';
            if (token.type === 'NUMBER') optionNumber.selected = true;

            const optionVariable = document.createElement('option');
            optionVariable.value = 'VARIABLE';
            optionVariable.textContent = 'TYPE_VARIABLE';

            tokenSelect.appendChild(optionNumber);
            tokenSelect.appendChild(optionVariable);

            tokenSelect.addEventListener('change', function() {
                tokens[index].type = tokenSelect.value;
                if (tokenSelect.value === 'VARIABLE') {
                    tokens[index].value = 'Variable1';
                    tokenValue.textContent = 'Variable1';
                    tokenValue.contentEditable = true;
                    tokenValue.focus();
                    selectText(tokenValue);
                } else {
                    tokenValue.contentEditable = true;
                }
            });

            tokenItem.appendChild(tokenSelect);
        }

        tokensList.appendChild(tokenItem);
    });

    document.getElementById('applyChanges').addEventListener('click', makeFunction);

    function selectText(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function makeFunction() {
         
        arrayInput.push(new Token(TokenType.TOKEN_FUN, 'fun'));
        arrayInput.push(new Token(TokenType.TOKEN_IDENTIFIER, functionName.value));
        arrayInput.push(new Token(TokenType.TOKEN_LEFT_PAREN,'('));
        tokens.forEach((token, index) => {
            if(token.type === 'VARIABLE') {
                token.type = TokenType.TOKEN_IDENTIFIER;
                arrayParameters.push(new Token(token.type, token.value));
                arrayInput.push(new Token(token.type, token.value));
                arrayInput.push(new Token(TokenType.TOKEN_COMA,','));
            }
        });
        if(arrayParameters.length > 0) {
            arrayInput.pop();
        }        
        arrayInput.push(new Token(TokenType.TOKEN_RIGHT_PAREN,')'));        
        arrayInput.push(new Token(TokenType.TOKEN_LEFT_BRACE,'{'));
        arrayInput.push(new Token(TokenType.TOKEN_RETURN,'return'));
        tokens.forEach((token, index) => {            
            arrayInput.push(new Token(token.type, token.value)); 
        });
        arrayInput.push(new Token(TokenType.TOKEN_SEMICOLON,';'));
        arrayInput.push(new Token(TokenType.TOKEN_RIGHT_BRACE,'}'));

         
        arrayInput.push(new Token(TokenType.TOKEN_PRINT,'PRINT'));
        arrayInput.push(new Token(TokenType.TOKEN_IDENTIFIER, functionName.value));
        arrayInput.push(new Token(TokenType.TOKEN_LEFT_PAREN, '('));
        arrayInput.push(new Token(TokenType.TOKEN_NUMBER, '10'));
        arrayInput.push(new Token(TokenType.TOKEN_COMA,','));
        arrayInput.push(new Token(TokenType.TOKEN_NUMBER, '20'));
        arrayInput.push(new Token(TokenType.TOKEN_RIGHT_PAREN,')'));
        arrayInput.push(new Token(TokenType.TOKEN_SEMICOLON,';'));
        arrayInput.push(new Token(TokenType.TOKEN_EOF,'FIN'));
        
    }
   

