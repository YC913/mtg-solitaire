let deckListFile = document.getElementById('decklist');

// ファイルが選択されたとき
deckListFile.addEventListener('change', function(evt){
    let file = evt.target.files;

    let reader = new FileReader();  // FileReaderの作成
    reader.readAsText(file[0]); // テキスト形式で読み込む

    reader.onload = function(ev){
        document.test.txt.value = reader.result;
    }
},false);
