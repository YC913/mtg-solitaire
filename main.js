let deckListFile = document.getElementById('decklist');
let library = [];
let sideBoard = [];
const section = document.querySelector('section');

// 取得するJSONがあるURLを変数へ代入
let requestUrl = 'https://www.mtgjson.com/files/StandardCards.json';

// XMLHttpRequest から新しいリクエストオブジェクトを作成
let request = new XMLHttpRequest();

console.log(requestUrl);

// 新しいリクエストを開始
request.open('GET', requestURL);

request.responseType = 'json';  // ブラウザ側で JavaScript オブジェクトへ変換
request.send(); // リクエストを送信

// サーバからのレスポンスを待ち、それを処理するコード
request.onload = function() {
    let standardCards = request.response;
    console.log(StandardCards[0]);
}


// デッキリストを読み込んでライブラリとサイドボードを作成する
deckListFile.addEventListener('change', function(evt){
    let file = evt.target.files;

    let reader = new FileReader();  // FileReaderの作成
    reader.readAsText(file[0]); // テキスト形式で読み込む

    reader.onload = function(ev){
        let deckList = reader.result.split(/[\r\n]+/);  // 改行で配列にしたもの

        // ライブラリの作成
        library = shapeList(deckList.slice(deckList.indexOf('デッキ')+1, deckList.indexOf('サイドボード')));
        
        // サイドボードの作成
        sideBoard = shapeList(deckList.slice(deckList.indexOf('サイドボード') + 1));
        document.inputDeckList.txt.value = library;
    }
    
    
},false);

// カード枚数分だけカード要素を複製し、リストに保存する関数
function shapeList(defaultList){
    let cardList = []
    for(let i=0; i < defaultList.length; i++){
        let cardNum = Number(defaultList[i].split(' ')[0]);
        let cardData = defaultList[i].split(' ').slice(1,defaultList.length);
        /*
            ここでjsonからカード情報を取得して整形する
            例
            {
                'name' : 'アダントの先兵',
                'set' : 'XLN',
                'imageUrl' : 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=436348&type=card',

            }
        */
        for(let j=0; j < cardNum; j++){
            // カードを追加
            cardList.push(cardData);
        }
    }
    return cardList;
}
