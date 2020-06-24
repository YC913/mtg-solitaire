let deckListFile = document.getElementById('decklist');
let library = []
let sideBoard = []
// ファイルが選択されたとき
deckListFile.addEventListener('change', function(evt){
    let file = evt.target.files;

    let reader = new FileReader();  // FileReaderの作成
    reader.readAsText(file[0]); // テキスト形式で読み込む

    reader.onload = function(ev){
        let deckList = reader.result.split(/[\r\n]+/);  // 改行で配列にしたもの
        library = shapeList(deckList.slice(deckList.indexOf('デッキ')+1, deckList.indexOf('サイドボード')));
        sideBoard = shapeList(deckList.slice(deckList.indexOf('サイドボード') + 1));
        document.inputDeckList.txt.value = library;
    }
    
    
},false);

// カード枚数分だけ要素を生成する関数
function shapeList(defaultList){
    let cardList = []
    for(let i=0; i < defaultList.length; i++){
        let cardNum = Number(defaultList[i].split(' ')[0]);
        let cardData = defaultList[i].split(' ').slice(1,defaultList.length)
        for(let j=0; j < cardNum; j++){
            // カードを追加
            cardList.push(cardData);
        }
    }
    return cardList;
}