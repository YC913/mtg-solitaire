let deckListFile = document.getElementById('decklist');
let handsArticle = document.getElementById('hands');
let libraryArticle = document.getElementById('library');
let sideboardArticle = document.getElementById('sidebord');
let library = [];
let libraryBase = [];
let sideboard = [];
let sideboardBase = [];
let standardCards = [];
let hands = [];
const section = document.querySelector('section');

// jsonでデータ取得
let url = 'StandardCards.json';
$.get(url, (data) => {
    standardCards = data;

    console.log(data.foreignData.name == "苦悶の侍祭");
    console.log(typeof(data));
    // デッキリストの情報を取得
    
    // standardCardsに情報を格納
});

// デッキリストを読み込んでライブラリとサイドボードを作成する
deckListFile.addEventListener('change', function(evt){
    let file = evt.target.files;

    let reader = new FileReader();  // FileReaderの作成
    reader.readAsText(file[0]); // テキスト形式で読み込む

    reader.onload = function(ev){
        
        let deckList = reader.result.split(/[\r\n]+/);  // 改行で配列にしたもの

        // ライブラリの素の作成
        libraryBase = shapeList(deckList.slice(deckList.indexOf('デッキ')+1, deckList.indexOf('サイドボード')));

        // サイドボードの素の作成
        sideboardBase = shapeList(deckList.slice(deckList.indexOf('サイドボード') + 1));

        // ゲーム開始の処理
        library = new Library();
        hands = library.draw(7);
        sideboard = new SideBord();

        addSection(hands, handsArticle);
        addSection(library._library, libraryArticle);
        addSection(sideboard._sidebord, sideboardArticle);
    }
    
    
},false);


function addSection(arr, section){
    let myArticle = document.createElement('article');
    let myDiv = document.createElement('div');
    for(let i=0; i<arr.length; i++){
        let listItem = document.createElement('li');
        listItem.textContent = arr[i][0];
        myDiv.appendChild(listItem);
    }
    myArticle.appendChild(myDiv);
    section.appendChild(myArticle);
}

// const createCardElement = (card) => {
//     const elem = document.createElement('div');
//     elem.classList.add('card');

//     // 「アダントの先兵」のような表示を作る
//     const cardLabel = document.createElement('div');
//     cardLabel.innerText = `${card.suit || ''}${card.label}`;
//     elem.appendChild(cardLabel);

//     // isHoldフラグがあれば、「HOLD」表示を追加し、
//     // 要素にholdクラスを追加する
//     if(card.isHold) {
//         const holdIndicator = document.createElement('div');
//         holdIndicator.innerText = 'HOLD';
//         elem.appendChild(holdIndicator);
//         elem.classList.add('hold');
//     }

//     return elem;
// };

// シャッフルボタンが押されたときにライブラリをシャッフルする関数
document.getElementById('shufful-button').onclick = function(){
    library.shufful();
    console.log(library);
}

// 開始時のライブラリ、手札、サイドボードを定義
function gameStart(){
    library = new Library();
    hands = library.draw(7);
    sideboard = new SideBord();
}

